import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const skus = await prisma.sku.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(skus);
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

    const sku = await prisma.sku.create({
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
