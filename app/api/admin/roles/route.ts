import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/roles - Listar todos os papéis
export async function GET(request: NextRequest) {
  try {
    // Buscar papéis com contagem de usuários
    const papeis = await (prisma as any).papel.findMany({
      include: {
        _count: {
          select: { usuarios: true, permissoes: true }
        },
        permissoes: {
          orderBy: [
            { recurso: 'asc' },
            { permissao: 'asc' },
            { valor: 'asc' }
          ]
        }
      },
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: papeis
    });

  } catch (error) {
    console.error('Erro ao listar papéis:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/admin/roles - Criar novo papel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, permissoes } = body;

    // Validar dados
    if (!nome || !nome.trim()) {
      return NextResponse.json(
        { error: 'Nome do papel é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se papel já existe
    const papelExistente = await (prisma as any).papel.findUnique({
      where: { nome: nome.trim() }
    });

    if (papelExistente) {
      return NextResponse.json(
        { error: 'Já existe um papel com este nome' },
        { status: 400 }
      );
    }

    // Criar papel
    const papel = await (prisma as any).papel.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim(),
        isSystem: false
      }
    });

    // Criar permissões se fornecidas
    if (permissoes && Array.isArray(permissoes)) {
      for (const perm of permissoes) {
        await (prisma as any).papelPermissao.create({
          data: {
            papelId: papel.id,
            permissao: perm.permissao,
            recurso: perm.recurso,
            valor: perm.valor
          }
        });
      }
    }

    // Buscar papel criado com permissões
    const papelCriado = await (prisma as any).papel.findUnique({
      where: { id: papel.id },
      include: {
        _count: {
          select: { usuarios: true, permissoes: true }
        },
        permissoes: true
      }
    });

    return NextResponse.json({
      success: true,
      data: papelCriado
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar papel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}