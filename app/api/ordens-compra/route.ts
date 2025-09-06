import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ordensCompra = await prisma.ordemCompra.findMany({
      include: {
        fornecedorRel: true,
        itens: {
          include: {
            sku: true
          }
        }
      },
      orderBy: { dataEmissao: 'desc' }
    });
    return NextResponse.json(ordensCompra);
  } catch (error) {
    console.error('Erro ao buscar ordens de compra:', error);
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
      fornecedor,
      cnpj,
      endereco,
      telefone,
      email,
      condicaoPagamento,
      prazoEntrega,
      observacoes,
      prioridade,
      itens
    } = body;

    // Calcular valor total
    const valorTotal = itens.reduce((total: number, item: any) =>
      total + (item.quantidade * item.valorUnitario), 0
    );

    const ordemCompra = await prisma.ordemCompra.create({
      data: {
        id,
        fornecedor,
        cnpj,
        endereco,
        telefone,
        email,
        condicaoPagamento,
        prazoEntrega: prazoEntrega ? new Date(prazoEntrega) : null,
        observacoes,
        prioridade,
        valorTotal,
        itens: {
          create: itens.map((item: any) => ({
            skuId: item.skuId,
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidade: item.unidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.quantidade * item.valorUnitario,
            dataEntrega: item.dataEntrega ? new Date(item.dataEntrega) : null
          }))
        }
      },
      include: {
        fornecedorRel: true,
        itens: {
          include: {
            sku: true
          }
        }
      }
    });

    return NextResponse.json(ordemCompra, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ordem de compra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
