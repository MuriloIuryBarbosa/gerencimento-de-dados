import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const representantes = await prisma.representante.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(representantes);
  } catch (error) {
    console.error('Erro ao buscar representantes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, telefone, empresa, comissao } = body;

    const representante = await prisma.representante.create({
      data: {
        nome,
        email,
        telefone,
        empresa,
        comissao: comissao ? parseFloat(comissao) : 0
      }
    });

    return NextResponse.json(representante, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar representante:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
