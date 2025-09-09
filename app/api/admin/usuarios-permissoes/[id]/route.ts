import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar se a permissão existe
    const usuarioPermissao = await (prisma as any).usuarioPermissao.findUnique({
      where: { id: idNum }
    });

    if (!usuarioPermissao) {
      return NextResponse.json(
        { error: 'Permissão não encontrada' },
        { status: 404 }
      );
    }

    // Revogar a permissão (desativar)
    await (prisma as any).usuarioPermissao.update({
      where: { id: idNum },
      data: {
        ativo: false
      }
    });

    return NextResponse.json({ message: 'Permissão revogada com sucesso' });
  } catch (error) {
    console.error('Erro ao revogar permissão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
