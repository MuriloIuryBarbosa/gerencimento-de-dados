import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar estatísticas dos clientes
    const [total, ativos, inativos] = await Promise.all([
      // Total de clientes
      prisma.cliente.count(),

      // Clientes ativos
      prisma.cliente.count({
        where: { ativo: true }
      }),

      // Clientes inativos
      prisma.cliente.count({
        where: { ativo: false }
      })
    ]);

    return NextResponse.json({
      total,
      ativos,
      inativos,
      comRepresentante: 0 // Temporariamente 0 até implementar relação com representantes
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
