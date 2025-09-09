import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar todas as cores
    const cores = await prisma.cor.findMany({
      orderBy: { nome: 'asc' }
    });

    // Para cada cor, buscar SKUs relacionados e calcular estatísticas
    const coresComDados = await Promise.all(
      cores.map(async (cor) => {
        // Buscar SKUs que usam esta cor
        const skusRelacionados = await prisma.sKU.findMany({
          where: {
            ativo: true
          },
          select: {
            id: true,
            nome: true
          },
          take: 5 // Limitar para performance
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
          dataCadastro: new Date().toISOString().split('T')[0], // Temporário
          fornecedor: 'Diversos',
          descricao: `Cor ${cor.nome}`
        };
      })
    );

    // Estatísticas gerais
    const totalCores = coresComDados.length;
    const coresAtivas = coresComDados.filter(cor => cor.status === 'Ativo').length;
    const coresBaixoEstoque = coresComDados.filter(cor => cor.status === 'Baixo Estoque').length;
    const coresForaEstoque = coresComDados.filter(cor => cor.status === 'Fora de Estoque').length;

    const estatisticas = {
      totalCores,
      coresAtivas,
      coresBaixoEstoque,
      coresForaEstoque,
      totalEstoque: coresComDados.reduce((acc, cor) => acc + cor.estoqueTotal, 0),
      valorTotal: coresComDados.reduce((acc, cor) => acc + cor.valorTotal, 0)
    };

    return NextResponse.json({
      cores: coresComDados,
      estatisticas,
      categorias: ['Geral'] // Poderia ser dinâmico se houvesse categorias
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
