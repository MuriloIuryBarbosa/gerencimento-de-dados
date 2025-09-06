import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fornecedores = await prisma.fornecedor.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(fornecedores);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
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
      nome,
      cnpj,
      endereco,
      telefone,
      email,
      contatoPrincipal,
      condicoesPagamento,
      prazoEntregaPadrao
    } = body;

    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome,
        cnpj,
        endereco,
        telefone,
        email,
        contatoPrincipal,
        condicoesPagamento,
        prazoEntregaPadrao
      }
    });

    return NextResponse.json(fornecedor, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
