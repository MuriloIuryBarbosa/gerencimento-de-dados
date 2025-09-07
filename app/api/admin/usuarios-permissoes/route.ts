import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const usuariosPermissoes = await (prisma as any).usuarioPermissao.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        permissao: {
          select: {
            nome: true,
            categoria: true
          }
        }
      },
      orderBy: {
        dataConcessao: 'desc'
      }
    });

    return NextResponse.json(usuariosPermissoes);
  } catch (error) {
    console.error('Erro ao buscar usuários permissões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usuarioId, permissaoId, dataExpiracao } = body;

    if (!usuarioId || !permissaoId) {
      return NextResponse.json(
        { error: 'Usuário e permissão são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se a permissão já foi concedida
    const existingPermissao = await (prisma as any).usuarioPermissao.findUnique({
      where: {
        usuarioId_permissaoId: {
          usuarioId: parseInt(usuarioId),
          permissaoId: parseInt(permissaoId)
        }
      }
    });

    if (existingPermissao) {
      return NextResponse.json(
        { error: 'Esta permissão já foi concedida ao usuário' },
        { status: 400 }
      );
    }

    const usuarioPermissao = await (prisma as any).usuarioPermissao.create({
      data: {
        usuarioId: parseInt(usuarioId),
        permissaoId: parseInt(permissaoId),
        concedidoPor: 1, // TODO: Pegar do contexto de autenticação
        dataExpiracao: dataExpiracao ? new Date(dataExpiracao) : null,
        ativo: true
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        permissao: {
          select: {
            nome: true,
            categoria: true
          }
        }
      }
    });

    return NextResponse.json(usuarioPermissao, { status: 201 });
  } catch (error) {
    console.error('Erro ao conceder permissão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
