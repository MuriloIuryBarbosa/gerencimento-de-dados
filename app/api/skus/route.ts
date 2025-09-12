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
        OR: search ? [
          { nome: { contains: search } },
          { id: { contains: search } }
        ] : undefined
      },
      select: {
        id: true,
        nome: true,
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
      familiaId,
      cor,
      tamanhoId,
      unegId,
      unidade,
      precoVenda,
      custoMedio,
      estoqueMinimo,
      estoqueMaximo,
      ativo = true
    } = body;

    const sku = await prisma.sKU.create({
      data: {
        id,
        nome,
        familiaId,
        cor,
        tamanhoId,
        unegId,
        unidade,
        precoVenda,
        custoMedio,
        estoqueMinimo,
        estoqueMaximo,
        ativo
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
