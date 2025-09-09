import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Buscar arquivos processados
    const arquivos = await prisma.arquivoEstoqueProcessado.findMany({
      orderBy: {
        dataProcessamento: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        usuario: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    });

    // Contar total de registros
    const total = await prisma.arquivoEstoqueProcessado.count();

    // Estatísticas gerais
    const estatisticas = await prisma.arquivoEstoqueProcessado.aggregate({
      _count: {
        id: true
      },
      _sum: {
        totalRegistros: true,
        registrosValidos: true,
        registrosInvalidos: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        arquivos,
        total,
        estatisticas: {
          totalArquivos: estatisticas._count.id,
          totalRegistros: estatisticas._sum.totalRegistros || 0,
          totalValidos: estatisticas._sum.registrosValidos || 0,
          totalInvalidos: estatisticas._sum.registrosInvalidos || 0
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar arquivos processados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', detalhes: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
