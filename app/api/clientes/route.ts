import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
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
    const { nome, razaoSocial, cnpj, endereco, telefone, email, contato, ativo } = body;

    // Validação básica
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome: nome.trim(),
        razaoSocial: razaoSocial ? razaoSocial.trim() : null,
        cnpj: cnpj ? cnpj.trim() : null,
        endereco: endereco ? endereco.trim() : null,
        telefone: telefone ? telefone.trim() : null,
        email: email ? email.trim() : null,
        contato: contato ? contato.trim() : null,
        ativo: ativo !== undefined ? ativo : true
      }
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);

    // Tratamento de erro de CNPJ duplicado
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este CNPJ já está cadastrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
