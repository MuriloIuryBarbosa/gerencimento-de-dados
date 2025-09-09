import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

interface LinhaEstoque {
  localizacao: string;
  codigo: string;
  apelidoFamilia: string;
  qualidade?: string;
  qmm?: string;
  cor?: string;
  quantidade: number;
  descricaoCor?: string;
  tamanho?: string;
  tamanhoDetalhado?: string;
  embalagemVolume?: string;
  unidade: string;
  pesoLiquido?: number;
  pesoBruto?: number;
}

function parseLinhaEstoque(linha: string, empresa: string): LinhaEstoque | null {
  try {
    // Pular linhas de cabeçalho ou linhas vazias
    if (linha.trim() === '' ||
        linha.includes('MAPEAMENTO DO ESTOQUE') ||
        linha.includes('PERIODO CHECKIN') ||
        linha.includes('LOCALIZAC.') ||
        linha.includes('-------') ||
        linha.includes('TOTAL FAMILIA') ||
        linha.includes('TOTAL DO LOCAL')) {
      return null;
    }

    // Parse baseado na posição dos campos (formato fixo)
    const localizacao = linha.substring(0, 12).trim();
    const codigo = linha.substring(12, 23).trim();
    const apelidoFamilia = linha.substring(23, 50).trim();

    // Campos QUAL QMM COR
    const qualQmmCor = linha.substring(50, 65).trim();
    const partesQualQmmCor = qualQmmCor.split(/\s+/);
    const qualidade = partesQualQmmCor[0] || undefined;
    const qmm = partesQualQmmCor[1] || undefined;
    const cor = partesQualQmmCor.slice(2).join(' ') || undefined;

    // Quantidade
    const quantidadeStr = linha.substring(65, 80).trim().replace(',', '.');
    const quantidade = parseFloat(quantidadeStr) || 0;

    // Descrição da cor
    const descricaoCor = linha.substring(80, 95).trim() || undefined;

    // Tamanho
    const tamanho = linha.substring(95, 105).trim() || undefined;
    const tamanhoDetalhado = linha.substring(105, 115).trim() || undefined;

    // Embalagem/Volume
    const embalagemVolume = linha.substring(115, 135).trim() || undefined;

    // Unidade
    const unidade = linha.substring(135, 140).trim();

    // Peso Líquido
    const pesoLiquidoStr = linha.substring(140, 155).trim().replace(',', '.');
    const pesoLiquido = pesoLiquidoStr ? parseFloat(pesoLiquidoStr) : undefined;

    // Peso Bruto
    const pesoBrutoStr = linha.substring(155).trim().replace(',', '.');
    const pesoBruto = pesoBrutoStr ? parseFloat(pesoBrutoStr) : undefined;

    // Validações básicas
    if (!localizacao || !codigo || !unidade || quantidade <= 0) {
      return null;
    }

    return {
      localizacao,
      codigo,
      apelidoFamilia,
      qualidade,
      qmm,
      cor,
      quantidade,
      descricaoCor,
      tamanho,
      tamanhoDetalhado,
      embalagemVolume,
      unidade,
      pesoLiquido,
      pesoBruto
    };
  } catch (error) {
    console.error('Erro ao parsear linha:', linha, error);
    return null;
  }
}

function extrairEmpresaDoArquivo(conteudo: string): string {
  const linhas = conteudo.split('\n');
  for (const linha of linhas) {
    if (linha.includes('CORTTEX IND COM IMP E EXP LTDA')) {
      return 'CORTTEX';
    }
    if (linha.includes('FATEX INDL COML IMP E EXP LTDA')) {
      return 'FATEX';
    }
  }
  return 'DESCONHECIDA';
}

function extrairCentroResponsavel(conteudo: string): string | null {
  const linhas = conteudo.split('\n');
  for (const linha of linhas) {
    if (linha.includes('CENTRO RESPONS.')) {
      const match = linha.match(/CENTRO RESPONS\. :\s*\d+\s+(.+?)\s*\(/);
      return match ? match[1].trim() : null;
    }
  }
  return null;
}

function extrairArmazem(conteudo: string): string | null {
  const linhas = conteudo.split('\n');
  for (const linha of linhas) {
    if (linha.includes('ARMAZEM :')) {
      const match = linha.match(/ARMAZEM :\s*(\d+)/);
      return match ? match[1] : null;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const nomeArquivo = file.name.toLowerCase();
    if (!['tecido01.txt', 'fatex01.txt', 'confec01.txt', 'estsc01.txt'].includes(nomeArquivo)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      );
    }

    // Ler conteúdo do arquivo
    const conteudo = await file.text();
    const linhas = conteudo.split('\n');

    // Extrair informações do cabeçalho
    const empresa = extrairEmpresaDoArquivo(conteudo);
    const centroResponsavel = extrairCentroResponsavel(conteudo);
    const armazem = extrairArmazem(conteudo);

    // Processar linhas de dados
    const dadosEstoque: LinhaEstoque[] = [];
    const erros: string[] = [];

    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i];
      const dados = parseLinhaEstoque(linha, empresa);

      if (dados) {
        dadosEstoque.push(dados);
      } else if (linha.trim() && !linha.includes('MAPEAMENTO') &&
                 !linha.includes('PERIODO') && !linha.includes('LOCALIZAC') &&
                 !linha.includes('---') && !linha.includes('TOTAL')) {
        // Limitar erros para evitar estouro de tamanho
        if (erros.length < 50) {
          erros.push(`Linha ${i + 1}: Formato inválido - ${linha.substring(0, 50)}...`);
        }
      }
    }

    // Verificar se já existe um arquivo processado com o mesmo nome
    const arquivoExistente = await (prisma as any).arquivoEstoqueProcessado.findUnique({
      where: { nomeArquivo }
    });

    if (arquivoExistente) {
      return NextResponse.json(
        { error: 'Este arquivo já foi processado anteriormente' },
        { status: 400 }
      );
    }

    // Iniciar transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar registro do arquivo processado
      const arquivoProcessado = await (tx as any).arquivoEstoqueProcessado.create({
        data: {
          nomeArquivo,
          empresa,
          totalRegistros: dadosEstoque.length,
          registrosValidos: 0,
          registrosInvalidos: erros.length,
          status: 'Processando',
          erros: erros.length > 0 ? JSON.stringify(erros.slice(0, 10)) : null // Limitar a 10 erros
        }
      });

      // Retornar resultado simplificado por enquanto
      return {
        totalRegistros: dadosEstoque.length,
        registrosValidos: dadosEstoque.length - erros.length,
        registrosInvalidos: erros.length,
        skusCriados: 0,
        skusAtualizados: 0,
        erros: erros.length > 0 ? erros.slice(0, 5) : [] // Retornar apenas os primeiros 5 erros
      };
    });

    return NextResponse.json(resultado);

  } catch (error) {
    console.error('Erro no processamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', detalhes: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
