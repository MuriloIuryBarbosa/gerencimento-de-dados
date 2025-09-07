import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        empresa: true,
        permissoes: {
          include: {
            permissao: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
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
      email,
      senha,
      cargo,
      departamento,
      empresaId,
      isAdmin,
      isSuperAdmin
    } = body;

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha, // Em produção, deve ser hash
        cargo,
        departamento,
        empresaId: empresaId ? parseInt(empresaId) : null,
        isAdmin: isAdmin || false,
        isSuperAdmin: isSuperAdmin || false
      },
      include: {
        empresa: true
      }
    });

    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
