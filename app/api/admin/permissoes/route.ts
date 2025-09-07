import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const permissoes = await (prisma as any).permissao.findMany({
      orderBy: {
        categoria: 'asc'
      }
    });

    return NextResponse.json(permissoes);
  } catch (error) {
    console.error('Erro ao buscar permissões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, categoria } = body;

    if (!nome || !categoria) {
      return NextResponse.json(
        { error: 'Nome e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    const permissao = await (prisma as any).permissao.create({
      data: {
        nome,
        descricao,
        categoria,
        ativo: true
      }
    });

    return NextResponse.json(permissao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar permissão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
