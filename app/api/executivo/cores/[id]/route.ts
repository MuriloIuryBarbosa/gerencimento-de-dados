import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para converter HEX para RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
}

// Função para determinar o status baseado no estoque
function determinarStatus(estoqueTotal: number): string {
  if (estoqueTotal === 0) return 'Fora de Estoque';
  if (estoqueTotal < 500) return 'Baixo Estoque';
  return 'Ativo';
}

// Função para determinar a categoria baseada na cor
function determinarCategoria(corNome: string): string {
  const categorias: { [key: string]: string[] } = {
    'Neutros': ['branco', 'preto', 'cinza', 'bege', 'marfim'],
    'Azuis': ['azul', 'celeste', 'marinho', 'turquesa', 'cobalto'],
    'Vermelhos': ['vermelho', 'cereja', 'carmim', 'escarlate', 'vinho'],
    'Verdes': ['verde', 'esmeralda', 'limão', 'musgo', 'jade'],
    'Amarelos': ['amarelo', 'ouro', 'mostarda', 'canela'],
    'Rosas': ['rosa', 'salmon', 'magenta', 'fúcsia'],
    'Laranjas': ['laranja', 'pêssego', 'coral', 'salmon'],
    'Roxos': ['roxo', 'violeta', 'lavanda', 'índigo'],
    'Pretos': ['preto', 'carvão', 'ébano']
  };

  const corLower = corNome.toLowerCase();
  for (const [categoria, cores] of Object.entries(categorias)) {
    if (cores.some(cor => corLower.includes(cor))) {
      return categoria;
    }
  }
  return 'Outros';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const corId = id;

    // Buscar SKUs relacionados à cor
    const todosSkus = await prisma.sKU.findMany({
      where: {
        ativo: true
      },
      include: {
        estoques: true,
        movimentacoes: {
          orderBy: {
            dataMovimentacao: 'desc'
          },
          take: 10
        }
      }
    }) as any[];

    // Filtrar SKUs pela cor
    const skusRelacionados = todosSkus.filter((sku: any) => sku.cor === corId);

    if (skusRelacionados.length === 0) {
      return NextResponse.json(
        { error: 'Cor não encontrada' },
        { status: 404 }
      );
    }

    // Calcular métricas agregadas
    const estoqueTotal = skusRelacionados.reduce((total: number, sku: any) => {
      return total + sku.estoques.reduce((estoqueSku: number, estoque: any) => estoqueSku + estoque.quantidadeAtual, 0);
    }, 0);

    const valorTotal = skusRelacionados.reduce((total: number, sku: any) => {
      return total + sku.estoques.reduce((valorSku: number, estoque: any) => {
        return valorSku + (Number(estoque.valorTotalEstoque) || 0);
      }, 0);
    }, 0);

    // Buscar informações da cor (se existir na tabela Cor)
    const corInfo = await prisma.cor.findFirst({
      where: {
        nome: corId
      }
    });

    // Usar código HEX padrão se não encontrado
    const codigoHex = corInfo?.codigoHex || '#808080'; // Cinza padrão
    const codigoRgb = hexToRgb(codigoHex);

    // Preparar dados dos SKUs relacionados
    const skusFormatados = skusRelacionados.map((sku: any) => ({
      id: sku.id,
      nome: sku.nome,
      estoque: sku.estoques.reduce((total: number, estoque: any) => total + estoque.quantidadeAtual, 0),
      valorUnitario: Number(sku.custoMedio) || 0,
      vendasMes: sku.movimentacoes
        .filter((mov: any) => mov.tipoMovimentacao === 'Saída' &&
                      mov.dataMovimentacao >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((total: number, mov: any) => total + mov.quantidade, 0)
    }));

    // Preparar histórico de estoque
    const historicoEstoque = skusRelacionados
      .flatMap((sku: any) => sku.movimentacoes.slice(0, 5)) // Pegar últimas 5 movimentações por SKU
      .sort((a: any, b: any) => new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime())
      .slice(0, 20) // Limitar a 20 movimentações
      .map((mov: any) => ({
        data: mov.dataMovimentacao.toISOString(),
        tipo: mov.tipoMovimentacao === 'Entrada' ? 'Entrada' as const : 'Saída' as const,
        quantidade: mov.quantidade,
        motivo: mov.motivo || mov.tipoMovimentacao
      }));

    // Preparar vendas mensais (últimos 6 meses)
    const vendasMensais = [];
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);

      const vendasMes = skusRelacionados
        .flatMap((sku: any) => sku.movimentacoes)
        .filter((mov: any) =>
          mov.tipoMovimentacao === 'Saída' &&
          mov.dataMovimentacao >= mes &&
          mov.dataMovimentacao < proximoMes
        )
        .reduce((total: any, mov: any) => ({
          quantidade: total.quantidade + mov.quantidade,
          valor: total.valor + Number(mov.valorTotal || 0)
        }), { quantidade: 0, valor: 0 });

      vendasMensais.push({
        mes: mes.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        quantidade: vendasMes.quantidade,
        valor: vendasMes.valor
      });
    }

    const corDetalhes = {
      id: corId,
      nome: corId,
      codigoHex,
      codigoRgb,
      categoria: determinarCategoria(corId),
      skusRelacionados: skusFormatados,
      estoqueTotal,
      valorTotal,
      status: determinarStatus(estoqueTotal),
      dataCadastro: skusRelacionados[0]?.createdAt.toISOString() || new Date().toISOString(),
      fornecedor: 'Múltiplos Fornecedores', // Como não temos fornecedor específico por cor
      descricao: `Cor ${corId} utilizada em ${skusRelacionados.length} SKU(s)`,
      historicoEstoque,
      vendasMensais
    };

    return NextResponse.json(corDetalhes);

  } catch (error) {
    console.error('Erro ao buscar detalhes da cor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
