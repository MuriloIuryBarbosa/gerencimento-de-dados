import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
    const body = await request.json()
    const { nome, legado, ativo = true } = body

    // Validações - apenas nome é obrigatório
    if (!nome || nome.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se nome já existe
    const existingTamanho = await prisma.tamanho.findFirst({
      where: { nome: nome.trim() }
    })

    if (existingTamanho) {
      return NextResponse.json(
        { error: 'Já existe um tamanho com este nome' },
        { status: 400 }
      )
    }

    const tamanho = await prisma.tamanho.create({
      data: {
        nome: nome.trim(),
        legado: legado ? legado.trim() : null,
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
