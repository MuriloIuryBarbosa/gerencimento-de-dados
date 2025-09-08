import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const empresas = await prisma.empresa.findMany({
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: empresas
    });
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, cnpj, endereco, telefone, email } = body;

    if (!nome || !cnpj) {
      return NextResponse.json(
        { error: 'Nome e CNPJ são obrigatórios' },
        { status: 400 }
      );
    }

    const empresa = await prisma.empresa.create({
      data: {
        nome,
        cnpj,
        endereco: endereco || null,
        telefone: telefone || null,
        email: email || null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Empresa criada com sucesso',
      data: empresa
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar empresa:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'CNPJ já cadastrado' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
