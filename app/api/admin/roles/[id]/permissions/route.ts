import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/roles/[id]/permissions - Listar permissões de um papel
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const papelId = parseInt(params.id);

    // Verificar se papel existe
    const papel = await (prisma as any).papel.findUnique({
      where: { id: papelId },
      include: {
        permissoes: {
          orderBy: [
            { recurso: 'asc' },
            { permissao: 'asc' },
            { valor: 'asc' }
          ]
        }
      }
    });

    if (!papel) {
      return NextResponse.json(
        { error: 'Papel não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: papel.permissoes
    });

  } catch (error) {
    console.error('Erro ao listar permissões do papel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/admin/roles/[id]/permissions - Adicionar permissão ao papel
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const papelId = parseInt(params.id);
    const body = await request.json();
    const { permissao, recurso, valor } = body;

    // Validar dados
    if (!permissao || !recurso) {
      return NextResponse.json(
        { error: 'Permissão e recurso são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se papel existe
    const papel = await (prisma as any).papel.findUnique({
      where: { id: papelId }
    });

    if (!papel) {
      return NextResponse.json(
        { error: 'Papel não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se permissão já existe
    const permissaoExistente = await (prisma as any).papelPermissao.findUnique({
      where: {
        papelId_permissao_recurso_valor: {
          papelId,
          permissao,
          recurso,
          valor: valor || null
        }
      }
    });

    if (permissaoExistente) {
      return NextResponse.json(
        { error: 'Esta permissão já existe para este papel' },
        { status: 400 }
      );
    }

    // Criar permissão
    const novaPermissao = await (prisma as any).papelPermissao.create({
      data: {
        papelId,
        permissao,
        recurso,
        valor
      }
    });

    return NextResponse.json({
      success: true,
      data: novaPermissao
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao adicionar permissão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/roles/[id]/permissions/[permissionId] - Remover permissão do papel
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; permissionId: string } }
) {
  try {
    const papelId = parseInt(params.id);
    const permissionId = parseInt(params.permissionId);

    // Verificar se permissão existe e pertence ao papel
    const permissao = await (prisma as any).papelPermissao.findFirst({
      where: {
        id: permissionId,
        papelId
      }
    });

    if (!permissao) {
      return NextResponse.json(
        { error: 'Permissão não encontrada' },
        { status: 404 }
      );
    }

    // Remover permissão
    await (prisma as any).papelPermissao.delete({
      where: { id: permissionId }
    });

    return NextResponse.json({
      success: true,
      message: 'Permissão removida com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover permissão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}