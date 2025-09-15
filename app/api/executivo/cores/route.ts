import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { legado: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Buscar cores com paginação
    const [cores, totalCount] = await Promise.all([
      prisma.cor.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit
      }),
      prisma.cor.count({ where })
    ]);

    // Para cada cor, buscar SKUs relacionados e calcular estatísticas
    const coresComDados = await Promise.all(
      cores.map(async (cor) => {
        // Buscar SKUs que usam esta cor (limitado para performance)
        const skusRelacionados = await prisma.sKU.findMany({
          where: {
            ativo: true
          },
          select: {
            id: true,
            nome: true
          },
          take: 5
        });

        // Calcular estoque total (simplificado)
        const estoqueTotal = { _sum: { quantidadeTotal: 0, valorTotalEstoque: 0 } };

        // Determinar status baseado no estoque
        let status = 'Ativo';
        const quantidadeTotal = 0; // Temporário até implementar cálculo real

        return {
          id: `COR-${cor.id.toString().padStart(3, '0')}`,
          nome: cor.nome,
          codigoHex: cor.codigoHex || '#CCCCCC',
          codigoRgb: cor.codigoHex ? hexToRgb(cor.codigoHex) : '204, 204, 204',
          categoria: 'Geral',
          skusRelacionados: skusRelacionados.map(sku => sku.id),
          estoqueTotal: quantidadeTotal,
          valorTotal: 0,
          status,
          dataCadastro: new Date().toISOString().split('T')[0],
          fornecedor: 'Diversos',
          descricao: `Cor ${cor.nome}`
        };
      })
    );

    // Estatísticas gerais (baseadas em todos os registros, não apenas da página atual)
    const allCores = await prisma.cor.findMany({
      where,
      select: { id: true, nome: true }
    });

    const totalCores = allCores.length;
    const coresAtivas = totalCores; // Temporário
    const coresBaixoEstoque = 0; // Temporário
    const coresForaEstoque = 0; // Temporário

    const estatisticas = {
      totalCores,
      coresAtivas,
      coresBaixoEstoque,
      coresForaEstoque,
      totalEstoque: 0, // Temporário
      valorTotal: 0 // Temporário
    };

    // Informações de paginação
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    return NextResponse.json({
      cores: coresComDados,
      estatisticas,
      categorias: ['Geral'],
      pagination
    });
  } catch (error) {
    console.error('Erro ao buscar dados das cores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para converter hex para RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}
