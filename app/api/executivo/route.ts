import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Total de SKUs individuais cadastrados
    const totalProdutos = await prisma.sKU.count({
      where: { ativo: true }
    });

    // SKUs ativos vs inativos
    const produtosAtivos = await prisma.sKU.count({
      where: { ativo: true }
    });

    const produtosInativos = await prisma.sKU.count({
      where: { ativo: false }
    });

    // Estoque total em metros
    const estoqueTotalMetros = await prisma.estoqueConsolidado.aggregate({
      _sum: {
        quantidadeTotal: true
      }
    });

    // Produtos com baixo estoque (abaixo do mínimo)
    const produtosBaixoEstoque = await prisma.estoqueConsolidado.count({
      where: {
        quantidadeTotal: {
          lt: prisma.estoqueConsolidado.findFirst({
            select: { sku: { select: { estoqueMinimo: true } } }
          }).then(result => result?.sku?.estoqueMinimo || 0)
        }
      }
    });

    // Cores cadastradas
    const totalCores = await prisma.cor.count();
    const coresAtivas = await prisma.cor.count({
      where: {
        id: {
          in: await prisma.sKU.findMany({
            where: { ativo: true },
            select: { cor: true }
          }).then(results => results.map(r => r.cor).filter(Boolean))
        }
      }
    });

    // Preços desatualizados (não atualizados há mais de 30 dias)
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    const precosDesatualizados = await prisma.sKU.count({
      where: {
        updatedAt: {
          lt: trintaDiasAtras
        },
        ativo: true
      }
    });

    // Cálculo da margem média
    const skusComPreco = await prisma.sKU.findMany({
      where: {
        precoVenda: { not: null },
        custoMedio: { not: null },
        ativo: true
      },
      select: {
        precoVenda: true,
        custoMedio: true
      }
    });

    const margemMedia = skusComPreco.length > 0
      ? skusComPreco.reduce((acc, sku) => {
          const margem = ((Number(sku.precoVenda) - Number(sku.custoMedio)) / Number(sku.precoVenda)) * 100;
          return acc + margem;
        }, 0) / skusComPreco.length
      : 0;

    // Dados dos módulos
    const modulosData = {
      skus: {
        total: totalProdutos,
        ativos: produtosAtivos,
        inativos: produtosInativos
      },
      cores: {
        total: totalCores,
        ativas: coresAtivas,
        descontinuadas: totalCores - coresAtivas
      },
      precos: {
        total: totalProdutos,
        atualizados: totalProdutos - precosDesatualizados,
        pendentes: precosDesatualizados
      },
      estoque: {
        total: Number(estoqueTotalMetros._sum.quantidadeTotal || 0),
        disponivel: Number(estoqueTotalMetros._sum.quantidadeTotal || 0) - produtosBaixoEstoque,
        reservado: produtosBaixoEstoque
      }
    };

    const executivo = {
      estatisticasGerais: {
        totalProdutos,
        produtosAtivos,
        margemMedia: Math.round(margemMedia * 100) / 100,
        estoqueTotal: Number(estoqueTotalMetros._sum.quantidadeTotal || 0),
        produtosBaixoEstoque,
        precosDesatualizados
      },
      modulos: modulosData,
      alertas: {
        produtosBaixoEstoque,
        precosDesatualizados
      }
    };

    return NextResponse.json(executivo);
  } catch (error) {
    console.error('Erro ao buscar dados do executivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
