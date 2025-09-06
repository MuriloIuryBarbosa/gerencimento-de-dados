import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transportadoras = await prisma.transportadora.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(transportadoras);
  } catch (error) {
    console.error('Erro ao buscar transportadoras:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, cnpj, endereco, telefone, email, contato, prazoEntrega, valorFrete } = body;

    const transportadora = await prisma.transportadora.create({
      data: {
        nome,
        cnpj,
        endereco,
        telefone,
        email,
        contato,
        prazoEntrega: prazoEntrega ? parseInt(prazoEntrega) : null,
        valorFrete: valorFrete ? parseFloat(valorFrete) : 0
      }
    });

    return NextResponse.json(transportadora, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar transportadora:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
