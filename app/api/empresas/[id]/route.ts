import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const empresaId = parseInt(params.id);

    if (isNaN(empresaId)) {
      return NextResponse.json(
        { success: false, error: 'ID da empresa inválido' },
        { status: 400 }
      );
    }

    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
      include: {
        _count: {
          select: {
            usuarios: true,
            permissoes: true,
            tabelas: true
          }
        }
      }
    });

    if (!empresa) {
      return NextResponse.json(
        { success: false, error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: empresa
    });

  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
