import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cores = await prisma.cor.findMany({
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(cores);
  } catch (error) {
    console.error('Erro ao buscar cores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, legado, ativo = true } = body;

    // Verificar se o nome já existe
    const existingCor = await prisma.cor.findFirst({
      where: { nome: nome.trim() }
    });

    if (existingCor) {
      return NextResponse.json(
        { error: 'Já existe uma cor com este nome' },
        { status: 400 }
      );
    }

    const cor = await prisma.cor.create({
      data: {
        nome: nome.trim(),
        legado: legado?.trim() || null,
        ativo
      }
    });

    return NextResponse.json(cor, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
