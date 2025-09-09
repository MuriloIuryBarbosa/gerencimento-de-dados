import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const [total, ativos, inativos, comProdutos] = await Promise.all([
      prisma.fornecedor.count(),
      prisma.fornecedor.count({ where: { ativo: true } }),
      prisma.fornecedor.count({ where: { ativo: false } }),
      prisma.fornecedor.count({
        where: {
          ordensCompra: {
            some: {}
          }
        }
      })
    ])

    return NextResponse.json({
      total,
      ativos,
      inativos,
      comProdutos
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos fornecedores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
