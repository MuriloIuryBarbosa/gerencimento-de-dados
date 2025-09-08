import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    const skus = await prisma.sKU.findMany({
      where: {
        ativo: true,
        OR: [
          { nome: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
          { descricao: { contains: search, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
        categoria: true,
        unidade: true,
        precoVenda: true,
        custoMedio: true,
        estoqueMinimo: true
      },
      orderBy: { nome: 'asc' },
      take: limit
    });

    return NextResponse.json({
      success: true,
      data: skus
    });
  } catch (error) {
    console.error('Erro ao buscar SKUs:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      nome,
      descricao,
      categoria,
      unidade,
      precoVenda,
      custoMedio,
      estoqueMinimo,
      estoqueMaximo
    } = body;

    const sku = await prisma.sKU.create({
      data: {
        id,
        nome,
        descricao,
        categoria,
        unidade,
        precoVenda,
        custoMedio,
        estoqueMinimo,
        estoqueMaximo
      }
    });

    return NextResponse.json(sku, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar SKU:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
