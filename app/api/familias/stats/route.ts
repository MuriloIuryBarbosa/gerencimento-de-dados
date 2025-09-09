import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const [total, ativas, inativas, comProdutos] = await Promise.all([
      prisma.familia.count(),
      prisma.familia.count({ where: { ativo: true } }),
      prisma.familia.count({ where: { ativo: false } }),
      prisma.familia.count({
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
    console.error('Erro ao buscar estatísticas das famílias:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
