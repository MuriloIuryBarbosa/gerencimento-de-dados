import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const representantes = await prisma.representante.findMany({
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
    const { nome, email, telefone, empresa, comissao, ativo } = body;

    // Validação básica
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const representante = await prisma.representante.create({
      data: {
        nome: nome.trim(),
        email: email ? email.trim() : null,
        telefone: telefone ? telefone.trim() : null,
        empresa: empresa ? empresa.trim() : null,
        comissao: comissao ? parseFloat(comissao) : 0,
        ativo: ativo !== undefined ? ativo : true
      }
    });

    return NextResponse.json(representante, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar representante:', error);

    // Tratamento de erro de email duplicado
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
