import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nome, legado, ativo } = body;

    // Validações
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome da cor é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma cor com o mesmo nome (exceto a atual)
    const corExistente = await prisma.cor.findFirst({
      where: {
        nome: nome.trim(),
        id: { not: id }
      }
    });

    if (corExistente) {
      return NextResponse.json(
        { error: 'Já existe uma cor com este nome' },
        { status: 400 }
      );
    }

    // Verificar se a cor existe
    const corAtual = await prisma.cor.findUnique({
      where: { id }
    });

    if (!corAtual) {
      return NextResponse.json(
        { error: 'Cor não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar a cor
    const corAtualizada = await prisma.cor.update({
      where: { id },
      data: {
        nome: nome.trim()
      }
    });

    return NextResponse.json({
      message: 'Cor atualizada com sucesso',
      cor: corAtualizada
    });

  } catch (error) {
    console.error('Erro ao atualizar cor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar se a cor existe
    const cor = await prisma.cor.findUnique({
      where: { id }
    });

    if (!cor) {
      return NextResponse.json(
        { error: 'Cor não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se a cor está sendo usada em SKUs (através do campo cor)
    const skusRelacionados = await prisma.sKU.count({
      where: {
        cor: cor.nome
      }
    });

    if (skusRelacionados > 0) {
      return NextResponse.json(
        {
          error: 'Não é possível excluir esta cor pois ela está sendo usada em SKUs',
          skusCount: skusRelacionados
        },
        { status: 400 }
      );
    }

    // Excluir a cor
    await prisma.cor.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Cor excluída com sucesso',
      cor: { id: cor.id, nome: cor.nome }
    });

  } catch (error) {
    console.error('Erro ao excluir cor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
