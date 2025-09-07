import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalUsuarios,
      totalEmpresas,
      totalTabelas,
      totalPermissoes
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.empresa.count(),
      prisma.tabelaDinamica.count(),
      prisma.permissao.count()
    ]);

    return NextResponse.json({
      totalUsuarios,
      totalEmpresas,
      totalTabelas,
      totalPermissoes
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
