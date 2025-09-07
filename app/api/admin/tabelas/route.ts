import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tabelas = await prisma.tabelaDinamica.findMany({
      include: {
        empresa: true,
        campos: {
          orderBy: { ordem: 'asc' }
        },
        _count: {
          select: { registros: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tabelas);
  } catch (error) {
    console.error('Erro ao buscar tabelas dinâmicas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, empresaId, campos } = body;

    // Criar a tabela dinâmica
    const tabela = await prisma.tabelaDinamica.create({
      data: {
        nome,
        descricao,
        empresaId: parseInt(empresaId),
        criadoPor: 1, // TODO: Pegar do contexto do usuário
        campos: {
          create: campos.map((campo: any, index: number) => ({
            nome: campo.nome,
            tipo: campo.tipo,
            tamanho: campo.tamanho ? parseInt(campo.tamanho) : null,
            obrigatorio: campo.obrigatorio || false,
            unico: campo.unico || false,
            valorPadrao: campo.valorPadrao,
            opcoes: campo.opcoes ? JSON.stringify(campo.opcoes) : null,
            ordem: index
          }))
        }
      },
      include: {
        campos: true,
        empresa: true
      }
    });

    return NextResponse.json(tabela, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tabela dinâmica:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
