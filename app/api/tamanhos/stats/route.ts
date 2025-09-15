import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [total, ativas, inativas, comProdutos] = await Promise.all([
      prisma.tamanho.count(),
      prisma.tamanho.count({ where: { ativo: true } }),
      prisma.tamanho.count({ where: { ativo: false } }),
      prisma.tamanho.count({
        where: {
          skus: {
            some: {}
          }
        }
      })
    ])

    return NextResponse.json({
      total,
      ativas,
      inativas,
      comProdutos
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos tamanhos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
