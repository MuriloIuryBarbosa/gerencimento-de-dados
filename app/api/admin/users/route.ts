import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/users - Listar usuários com papéis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Buscar usuários
    const usuarios = await (prisma as any).usuario.findMany({
      where: {
        OR: [
          { nome: { contains: search } },
          { email: { contains: search } }
        ]
      },
      include: {
        empresa: true,
        papel: true,
        permissoes: {
          orderBy: [
            { recurso: 'asc' },
            { permissao: 'asc' }
          ]
        },
        _count: {
          select: { permissoes: true }
        }
      },
      orderBy: { nome: 'asc' },
      skip,
      take: limit
    });

    // Contar total
    const total = await (prisma as any).usuario.count({
      where: {
        OR: [
          { nome: { contains: search } },
          { email: { contains: search } }
        ]
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        usuarios,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Atualizar papel e permissões do usuário
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { papelId, permissoes } = body;

    // Verificar se usuário existe
    const usuario = await (prisma as any).usuario.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar papel do usuário
    if (papelId !== undefined) {
      await (prisma as any).usuario.update({
        where: { id: parseInt(userId) },
        data: { papelId: papelId || null }
      });
    }

    // Atualizar permissões específicas se fornecidas
    if (permissoes && Array.isArray(permissoes)) {
      // Remover permissões existentes
      await (prisma as any).usuarioPermissao.deleteMany({
        where: { usuarioId: parseInt(userId) }
      });

      // Criar novas permissões
      for (const perm of permissoes) {
        await (prisma as any).usuarioPermissao.create({
          data: {
            usuarioId: parseInt(userId),
            permissao: perm.permissao,
            recurso: perm.recurso,
            valor: perm.valor
          }
        });
      }
    }

    // Buscar usuário atualizado
    const usuarioAtualizado = await (prisma as any).usuario.findUnique({
      where: { id: parseInt(userId) },
      include: {
        empresa: true,
        papel: true,
        permissoes: {
          orderBy: [
            { recurso: 'asc' },
            { permissao: 'asc' }
          ]
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: usuarioAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}