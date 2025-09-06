import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Estatísticas de ordens de compra
    const ordensCompraStats = await prisma.ordemCompra.aggregate({
      _count: {
        id: true
      },
      _sum: {
        valorTotal: true
      },
      where: {
        dataEmissao: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Mês atual
        }
      }
    });

    // Estatísticas de requisições
    const requisicoesStats = await prisma.requisicao.aggregate({
      _count: {
        id: true
      },
      where: {
        dataRequisicao: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Mês atual
        }
      }
    });

    // Total de SKUs ativos
    const totalSkus = await prisma.sku.count({
      where: { ativo: true }
    });

    // Total de fornecedores ativos
    const totalFornecedores = await prisma.fornecedor.count({
      where: { ativo: true }
    });

    // Ordens por status
    const ordensPorStatus = await prisma.ordemCompra.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Requisições por status
    const requisicoesPorStatus = await prisma.requisicao.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    const dashboard = {
      ordensCompra: {
        total: ordensCompraStats._count.id,
        valorTotal: ordensCompraStats._sum.valorTotal || 0,
        porStatus: ordensPorStatus
      },
      requisicoes: {
        total: requisicoesStats._count.id,
        porStatus: requisicoesPorStatus
      },
      inventario: {
        totalSkus,
        totalFornecedores
      }
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
