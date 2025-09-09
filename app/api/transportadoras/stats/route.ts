import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const [total, ativos, inativos] = await Promise.all([
      prisma.transportadora.count(),
      prisma.transportadora.count({ where: { ativo: true } }),
      prisma.transportadora.count({ where: { ativo: false } })
    ])

    return NextResponse.json({
      total,
      ativos,
      inativos,
      comPedidos: 0 // Temporariamente 0 até implementar relação
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas das transportadoras:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
