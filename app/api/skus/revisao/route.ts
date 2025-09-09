import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusRevisao = searchParams.get('statusRevisao') || 'pendente_revisao';
    const origemCriacao = searchParams.get('origemCriacao');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Construir filtros
    const where: any = {
      statusRevisao
    };

    if (origemCriacao) {
      where.origemCriacao = origemCriacao;
    }

    // Buscar SKUs que precisam de revisão
    const skus = await prisma.sKU.findMany({
      where,
      include: {
        itensEstoque: {
          take: 5, // Limitar para performance
          include: {
            localizacao: true
          }
        },
        estoqueConsolidado: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Contar total
    const total = await prisma.sKU.count({ where });

    // Estatísticas
    const estatisticas = await prisma.sKU.groupBy({
      by: ['origemCriacao', 'statusRevisao'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        skus,
        total,
        estatisticas,
        paginaAtual: Math.floor(offset / limit) + 1,
        totalPaginas: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar SKUs para revisão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', detalhes: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

// Endpoint para marcar SKU como revisado
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { skuId, statusRevisao, observacoesRevisao, revisadoPor } = body;

    if (!skuId) {
      return NextResponse.json(
        { error: 'ID do SKU é obrigatório' },
        { status: 400 }
      );
    }

    const skuAtualizado = await prisma.sKU.update({
      where: { id: skuId },
      data: {
        statusRevisao: statusRevisao || 'revisado',
        observacoesRevisao,
        revisadoPor,
        dataRevisao: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: skuAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar SKU:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', detalhes: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
