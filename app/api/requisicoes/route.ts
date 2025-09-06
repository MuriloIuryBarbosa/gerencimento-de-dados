import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const requisicoes = await prisma.requisicao.findMany({
      include: {
        itens: {
          include: {
            sku: true
          }
        }
      },
      orderBy: { dataRequisicao: 'desc' }
    });
    return NextResponse.json(requisicoes);
  } catch (error) {
    console.error('Erro ao buscar requisições:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      solicitante,
      departamento,
      dataNecessidade,
      prioridade,
      observacoes,
      itens
    } = body;

    const requisicao = await prisma.requisicao.create({
      data: {
        id,
        solicitante,
        departamento,
        dataNecessidade: dataNecessidade ? new Date(dataNecessidade) : null,
        prioridade,
        observacoes,
        itens: {
          create: itens.map((item: any) => ({
            skuId: item.skuId,
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidade: item.unidade,
            observacoes: item.observacoes
          }))
        }
      },
      include: {
        itens: {
          include: {
            sku: true
          }
        }
      }
    });

    return NextResponse.json(requisicao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
