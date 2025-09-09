import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const familias = await prisma.familia.findMany({
      include: {
        _count: {
          select: {
            skus: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(familias)
  } catch (error) {
    console.error('Erro ao buscar famílias:', error)
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
    const existingFamilia = await prisma.familia.findUnique({
      where: { codigo }
    })

    if (existingFamilia) {
      return NextResponse.json(
        { error: 'Já existe uma família com este código' },
        { status: 400 }
      )
    }

    const familia = await prisma.familia.create({
      data: {
        codigo,
        nome,
        descricao,
        ativo
      }
    })

    return NextResponse.json(familia, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar família:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
