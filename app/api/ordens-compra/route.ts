import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar ID único para a ordem de compra
    const id = `OC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    // Criar a ordem de compra
    const ordemCompra = await prisma.ordemCompra.create({
      data: {
        id,
        fornecedor: body.fornecedor || '',
        cnpj: body.cnpj || null,
        endereco: body.endereco || null,
        telefone: body.telefone || null,
        email: body.email || null,
        condicaoPagamento: body.condicaoPagamento || null,
        prazoEntrega: body.prazoEntrega ? new Date(body.prazoEntrega) : null,
        observacoes: body.observacoes || null,
        status: body.status || 'Pendente Aprovação',
        prioridade: body.prioridade || 'Média',
        valorTotal: body.valorTotal ? parseFloat(body.valorTotal) : 0.00
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Ordem de compra criada com sucesso',
      ordemCompra
    });

  } catch (error) {
    console.error('Erro ao criar ordem de compra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const fornecedor = searchParams.get('fornecedor');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (fornecedor) where.fornecedor = { contains: fornecedor, mode: 'insensitive' };

    const [ordensCompra, total] = await Promise.all([
      prisma.ordemCompra.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.ordemCompra.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      ordensCompra,
      total,
      totalPages,
      currentPage: page,
      limit
    });

  } catch (error) {
    console.error('Erro ao buscar ordens de compra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
