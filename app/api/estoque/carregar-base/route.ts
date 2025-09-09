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
        erros.push(`Linha ${i + 1}: Formato inválido - ${linha.substring(0, 50)}...`);
      }
    }

    // Verificar se já existe um arquivo processado com o mesmo nome
    const arquivoExistente = await prisma.arquivoEstoqueProcessado.findUnique({
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
      const arquivoProcessado = await tx.arquivoEstoqueProcessado.create({
        data: {
          nomeArquivo,
          empresa,
          totalRegistros: dadosEstoque.length,
          registrosValidos: 0,
          registrosInvalidos: erros.length,
          status: 'Processando',
          erros: erros.length > 0 ? JSON.stringify(erros) : null
        }
      });

      // Processar localizações únicas
      const localizacoesUnicas = [...new Set(dadosEstoque.map(d => d.localizacao))];

      for (const loc of localizacoesUnicas) {
        await tx.localizacaoEstoque.upsert({
          where: { codigo: loc },
          update: {
            empresa,
            armazem,
            centroResponsavel
          },
          create: {
            codigo: loc,
            empresa,
            armazem,
            centroResponsavel
          }
        });
      }

      // Inserir dados de estoque e criar SKUs automaticamente
      let registrosValidos = 0;
      const skusCriados: string[] = [];
      const skusAtualizados: string[] = [];

      for (const dados of dadosEstoque) {
        try {
          const localizacao = await tx.localizacaoEstoque.findUnique({
            where: { codigo: dados.localizacao }
          });

          if (localizacao) {
            // Gerar ID do SKU baseado na composição (Família + Cor + Tamanho)
            const skuId = `${dados.apelidoFamilia}_${dados.cor || 'SEM_COR'}_${dados.tamanho || 'SEM_TAMANHO'}`.replace(/\s+/g, '_').toUpperCase();

            // Verificar se SKU já existe
            let skuExistente = await tx.sKU.findUnique({
              where: { id: skuId }
            });

            if (!skuExistente) {
              // Criar SKU automaticamente
              skuExistente = await tx.sKU.create({
                data: {
                  id: skuId,
                  nome: `${dados.apelidoFamilia} ${dados.cor || ''} ${dados.tamanho || ''}`.trim(),
                  descricao: `SKU criado automaticamente a partir do arquivo ${nomeArquivo}`,
                  familia: dados.apelidoFamilia,
                  cor: dados.cor,
                  tamanho: dados.tamanho,
                  categoria: 'Estoque Carregado',
                  unidade: dados.unidade,
                  origemCriacao: 'sistema',
                  statusRevisao: 'pendente_revisao',
                  ativo: true
                }
              });
              skusCriados.push(skuId);
            } else {
              skusAtualizados.push(skuId);
            }

            // Inserir dados de estoque vinculados ao SKU
            await tx.estoqueBase.create({
              data: {
                localizacaoId: localizacao.id,
                skuId: skuExistente.id,
                codigoProduto: dados.codigo,
                apelidoFamilia: dados.apelidoFamilia,
                qualidade: dados.qualidade ?? undefined,
                qmm: dados.qmm ?? undefined,
                cor: dados.cor ?? undefined,
                quantidade: dados.quantidade,
                descricaoCor: dados.descricaoCor ?? undefined,
                tamanho: dados.tamanho ?? undefined,
                tamanhoDetalhado: dados.tamanhoDetalhado ?? undefined,
                embalagemVolume: dados.embalagemVolume ?? undefined,
                unidade: dados.unidade,
                pesoLiquido: dados.pesoLiquido ?? undefined,
                pesoBruto: dados.pesoBruto ?? undefined,
                empresa,
                arquivoOrigem: nomeArquivo
              }
            });

            // Atualizar ou criar estoque consolidado
            const estoqueExistente = await tx.estoqueConsolidado.findUnique({
              where: { skuId: skuExistente.id }
            });

            if (estoqueExistente) {
              await tx.estoqueConsolidado.update({
                where: { skuId: skuExistente.id },
                data: {
                  quantidadeTotal: {
                    increment: dados.quantidade
                  },
                  quantidadeDisponivel: {
                    increment: dados.quantidade
                  },
                  unidade: dados.unidade,
                  ultimaAtualizacao: new Date()
                }
              });
            } else {
              await tx.estoqueConsolidado.create({
                data: {
                  skuId: skuExistente.id,
                  quantidadeTotal: dados.quantidade,
                  quantidadeDisponivel: dados.quantidade,
                  unidade: dados.unidade,
                  ultimaAtualizacao: new Date()
                }
              });
            }

            registrosValidos++;
          }
        } catch (error) {
          console.error('Erro ao inserir registro:', dados, error);
          erros.push(`Erro ao inserir: ${dados.codigo} - ${error}`);
        }
      }

      // Atualizar status do arquivo
      await tx.arquivoEstoqueProcessado.update({
        where: { id: arquivoProcessado.id },
        data: {
          registrosValidos,
          registrosInvalidos: erros.length,
          status: erros.length === 0 ? 'Concluido' : 'Concluido',
          erros: erros.length > 0 ? JSON.stringify(erros) : null
        }
      });

      return {
        totalRegistros: dadosEstoque.length,
        registrosValidos,
        registrosInvalidos: erros.length,
        skusCriados: skusCriados.length,
        skusAtualizados: skusAtualizados.length,
        erros: erros.length > 0 ? erros.slice(0, 10) : [] // Retornar apenas os primeiros 10 erros
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
