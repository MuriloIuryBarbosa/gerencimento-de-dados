import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Estatísticas de ordens de compra (mês atual)
    const ordensCompraStats = await prisma.ordemCompra.aggregate({
      _count: {
        id: true
      },
      _sum: {
        valorTotal: true
      },
      where: {
        dataEmissao: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Ordens de compra por status
    const ordensPorStatus = await prisma.ordemCompra.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Estatísticas de requisições (mês atual)
    const requisicoesStats = await prisma.requisicao.aggregate({
      _count: {
        id: true
      },
      where: {
        dataRequisicao: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Requisições por status
    const requisicoesPorStatus = await prisma.requisicao.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Estatísticas de proformas (mês atual)
    const proformasStats = await prisma.proforma.aggregate({
      _count: {
        id: true
      },
      _sum: {
        valorTotal: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Proformas por status
    const proformasPorStatus = await prisma.proforma.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Estatísticas de follow-ups
    const followUpsStats = await prisma.followUp.aggregate({
      _count: {
        id: true
      },
      where: {
        status: {
          not: 'Concluído'
        }
      }
    });

    // Follow-ups por prioridade
    const followUpsPorPrioridade = await prisma.followUp.groupBy({
      by: ['prioridade'],
      _count: {
        id: true
      }
    });

    // Estatísticas de estoque consolidado
    const estoqueStats = await prisma.estoqueConsolidado.aggregate({
      _count: {
        id: true
      },
      _sum: {
        quantidadeTotal: true,
        valorTotalEstoque: true
      }
    });

    // Movimentações de estoque (últimos 30 dias)
    const movimentacoesRecentes = await prisma.movimentacaoEstoque.count({
      where: {
        dataMovimentacao: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Ordens de compra pendentes de aprovação
    const ordensPendentes = await prisma.ordemCompra.count({
      where: {
        status: 'Pendente Aprovação'
      }
    });

    // Requisições pendentes
    const requisicoesPendentes = await prisma.requisicao.count({
      where: {
        status: 'Pendente'
      }
    });

    // Follow-ups com data de vencimento próxima (próximos 7 dias)
    const followUpsVencendo = await prisma.followUp.count({
      where: {
        dataVencimento: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        status: {
          not: 'Concluído'
        }
      }
    });

    // Cálculo de eficiência logística (baseado em follow-ups concluídos vs total)
    const followUpsConcluidos = await prisma.followUp.count({
      where: {
        status: 'Concluído',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const followUpsTotalMes = await prisma.followUp.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const eficienciaLogistica = followUpsTotalMes > 0
      ? Math.round((followUpsConcluidos / followUpsTotalMes) * 100)
      : 0;

    // Cálculo de custo médio por container (baseado em ordens de compra)
    const custoMedioContainer = ordensCompraStats._count.id > 0
      ? Math.round(Number(ordensCompraStats._sum.valorTotal || 0) / ordensCompraStats._count.id)
      : 0;

    // Tempo médio de entrega (baseado em follow-ups de logística)
    const followUpsLogistica = await prisma.followUp.findMany({
      where: {
        tipo: 'Logística',
        status: 'Concluído'
      },
      select: {
        createdAt: true,
        updatedAt: true
      }
    });

    const tempoMedioEntrega = followUpsLogistica.length > 0
      ? Math.round(
          followUpsLogistica.reduce((acc, followUp) => {
            const diffTime = followUp.updatedAt.getTime() - followUp.createdAt.getTime();
            return acc + (diffTime / (1000 * 60 * 60 * 24)); // dias
          }, 0) / followUpsLogistica.length
        )
      : 0;

    const planejamento = {
      ordensCompra: {
        total: ordensCompraStats._count.id,
        valorTotal: ordensCompraStats._sum.valorTotal || 0,
        porStatus: ordensPorStatus,
        pendentes: ordensPendentes
      },
      requisicoes: {
        total: requisicoesStats._count.id,
        porStatus: requisicoesPorStatus,
        pendentes: requisicoesPendentes
      },
      proformas: {
        total: proformasStats._count.id,
        valorTotal: proformasStats._sum.valorTotal || 0,
        porStatus: proformasPorStatus
      },
      followUps: {
        total: followUpsStats._count.id,
        porPrioridade: followUpsPorPrioridade,
        vencendo: followUpsVencendo
      },
      estoque: {
        totalProdutos: estoqueStats._count.id,
        quantidadeTotal: estoqueStats._sum.quantidadeTotal || 0,
        valorTotal: estoqueStats._sum.valorTotalEstoque || 0
      },
      indicadores: {
        ordensPendentes: ordensPendentes + requisicoesPendentes,
        eficienciaLogistica,
        custoMedioContainer,
        tempoMedioEntrega,
        movimentacoesRecentes
      }
    };

    return NextResponse.json(planejamento);
  } catch (error) {
    console.error('Erro ao buscar dados do planejamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
