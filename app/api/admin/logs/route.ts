import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const acao = searchParams.get('acao') || '';
    const entidade = searchParams.get('entidade') || '';
    const usuario = searchParams.get('usuario') || '';
    const dataInicio = searchParams.get('dataInicio') || '';
    const dataFim = searchParams.get('dataFim') || '';

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (acao) {
      where.acao = {
        contains: acao,
        mode: 'insensitive'
      };
    }

    if (entidade) {
      where.entidade = {
        contains: entidade,
        mode: 'insensitive'
      };
    }

    if (usuario) {
      where.OR = [
        {
          usuario: {
            nome: {
              contains: usuario,
              mode: 'insensitive'
            }
          }
        },
        {
          usuario: {
            email: {
              contains: usuario,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) {
        where.createdAt.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.createdAt.lte = new Date(dataFim + 'T23:59:59');
      }
    }

    // Buscar logs com paginação
    const [logs, total] = await Promise.all([
      prisma.logSistema.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.logSistema.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      logs,
      total,
      totalPages,
      currentPage: page,
      limit
    });

  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados obrigatórios
    if (!body.acao || !body.entidade) {
      return NextResponse.json(
        { error: 'Ação e entidade são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar log
    const log = await prisma.logSistema.create({
      data: {
        usuarioId: body.usuarioId || null,
        acao: body.acao,
        entidade: body.entidade,
        entidadeId: body.entidadeId || null,
        descricao: body.descricao || body.detalhes || '',
        dadosAntes: body.dadosAntes || null,
        dadosDepois: body.dadosDepois || null,
        ip: body.ip || null,
        userAgent: body.userAgent || null
      }
    });

    return NextResponse.json({
      success: true,
      log
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar log:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
