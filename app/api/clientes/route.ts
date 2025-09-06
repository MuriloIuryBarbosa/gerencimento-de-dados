import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, razaoSocial, cnpj, endereco, telefone, email, contato } = body;

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        razaoSocial,
        cnpj,
        endereco,
        telefone,
        email,
        contato
      }
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
