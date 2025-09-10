import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const tamanhos = await prisma.tamanho.findMany({
      include: {
        _count: {
          select: {
            skus: true
          }
        }
      },
      orderBy: [
        { nome: 'asc' }
      ]
    })

    return NextResponse.json(tamanhos)
  } catch (error) {
    console.error('Erro ao buscar tamanhos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { codigo, nome, descricao, ativo = true } = body

    // Validações
    if (!codigo || !nome) {
      return NextResponse.json(
        { error: 'Código e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se código já existe
    const existingTamanho = await prisma.tamanho.findUnique({
      where: { codigo }
    })

    if (existingTamanho) {
      return NextResponse.json(
        { error: 'Já existe um tamanho com este código' },
        { status: 400 }
      )
    }

    const tamanho = await prisma.tamanho.create({
      data: {
        codigo,
        nome,
        descricao,
        ativo
      }
    })

    return NextResponse.json(tamanho, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar tamanho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
