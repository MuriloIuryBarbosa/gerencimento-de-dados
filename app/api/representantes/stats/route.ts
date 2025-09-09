import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar estatísticas dos representantes
    const [total, ativos, inativos] = await Promise.all([
      // Total de representantes
      prisma.representante.count(),

      // Representantes ativos
      prisma.representante.count({
        where: { ativo: true }
      }),

      // Representantes inativos
      prisma.representante.count({
        where: { ativo: false }
      })
    ]);

    return NextResponse.json({
      total,
      ativos,
      inativos,
      comClientes: 0 // Temporariamente 0 até implementar relação com clientes
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos representantes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
