import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Buscar métricas gerais de estoque
    const [
      totalEstoque,
      produtosOK,
      baixoEstoque,
      foraEstoque,
      estoqueItens
    ] = await Promise.all([
      // Total em estoque (soma de todas as quantidades)
      prisma.estoqueBase.aggregate({
        _sum: {
          quantidade: true
        }
      }),

      // Produtos OK (estoque acima do mínimo)
      prisma.estoqueConsolidado.count({
        where: {
          quantidadeDisponivel: {
            gt: 100 // Considerando mínimo de 100 unidades
          }
        }
      }),

      // Baixo estoque (estoque abaixo do mínimo)
      prisma.estoqueConsolidado.count({
        where: {
          quantidadeDisponivel: {
            gt: 0,
            lte: 100
          }
        }
      }),

      // Fora de estoque
      prisma.estoqueConsolidado.count({
        where: {
          quantidadeDisponivel: {
            lte: 0
          }
        }
      }),

      // Itens de estoque com detalhes
      prisma.estoqueBase.findMany({
        take: 50,
        include: {
          sku: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              categoria: true,
              unidade: true,
              estoqueMinimo: true,
              estoqueMaximo: true
            }
          },
          localizacao: {
            select: {
              codigo: true,
              descricao: true,
              empresa: true
            }
          }
        },
        orderBy: {
          quantidade: 'desc'
        }
      })
    ]);

    // Calcular métricas
    const totalEstoqueValue = totalEstoque._sum.quantidade || 0;
    const totalProdutos = await prisma.estoqueConsolidado.count();

    // Formatar dados dos itens
    const formattedItens = estoqueItens.map(item => ({
      id: item.id,
      sku: item.skuId || item.codigoProduto,
      nomeProduto: item.sku?.nome || `${item.apelidoFamilia} ${item.cor || ''}`.trim(),
      categoria: item.sku?.categoria || item.apelidoFamilia,
      fornecedor: item.empresa,
      estoqueAtual: Number(item.quantidade),
      estoqueMinimo: item.sku?.estoqueMinimo || 100,
      estoqueMaximo: item.sku?.estoqueMaximo || 1000,
      unidade: item.unidade,
      localizacao: `${item.localizacao?.codigo || 'N/A'} - ${item.localizacao?.empresa || ''}`,
      ultimoMovimento: item.dataProcessamento.toISOString().split('T')[0],
      status: getStatusEstoque(Number(item.quantidade), item.sku?.estoqueMinimo || 100, item.sku?.estoqueMaximo || 1000),
      valorUnitario: 0, // TODO: implementar cálculo de valor
      valorTotal: 0 // TODO: implementar cálculo de valor
    }));

    // Por enquanto, usar dados mockados para o mapa de depósitos
    const mapaDepositos = [
      {
        id: 1,
        nome: 'Depósito A - FATEX',
        quantidade: 2140,
        unidade: 'metros',
        ocupacaoPercentual: 85
      },
      {
        id: 2,
        nome: 'Depósito B - CORTTEX',
        quantidade: 245,
        unidade: 'metros',
        ocupacaoPercentual: 35
      }
    ];

    return NextResponse.json({
      success: true,
      metrics: {
        totalEstoque: Number(totalEstoqueValue),
        produtosOK,
        baixoEstoque,
        foraEstoque,
        totalProdutos
      },
      itens: formattedItens,
      mapaDepositos,
      alertas: {
        foraEstoque,
        baixoEstoque,
        excesso: 0 // TODO: implementar cálculo de excesso
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados de estoque:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

function getStatusEstoque(atual: number, minimo: number, maximo: number): string {
  if (atual <= 0) return "Fora de Estoque";
  if (atual <= minimo) return "Baixo Estoque";
  if (atual >= maximo) return "Excesso";
  return "Normal";
}
