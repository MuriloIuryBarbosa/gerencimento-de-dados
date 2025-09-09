import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Metas ativas (simulação - seria uma tabela específica)
    const metasAtivas = 0;
    const metasPendentes = 0;

    // Metas de compra (por representante)
    const representantes = await prisma.representante.findMany({
      where: { ativo: true },
      select: {
        id: true,
        nome: true
      }
    });

    // Simulação de metas (em produção seria uma tabela dedicada)
    const metasCompra = representantes.map(rep => ({
      representanteId: rep.id,
      representanteNome: rep.nome,
      metaValor: 0,
      metaMetragem: 0,
      realizadoValor: 0,
      realizadoMetragem: 0,
      percentualValor: 0,
      percentualMetragem: 0
    }));

    // Metas de venda (por representante)
    const metasVenda = representantes.map(rep => ({
      representanteId: rep.id,
      representanteNome: rep.nome,
      metaValor: 0,
      metaMetragem: 0,
      realizadoValor: 0,
      realizadoMetragem: 0,
      percentualValor: 0,
      percentualMetragem: 0
    }));

    // Totais consolidados
    const totais = {
      metaCompraValor: 0,
      realizadoCompraValor: 0,
      metaCompraMetragem: 0,
      realizadoCompraMetragem: 0,
      metaVendaValor: 0,
      realizadoVendaValor: 0,
      metaVendaMetragem: 0,
      realizadoVendaMetragem: 0,
      percentualCompraValor: 0,
      percentualCompraMetragem: 0,
      percentualVendaValor: 0,
      percentualVendaMetragem: 0
    };

    const metas = {
      representantes,
      metasCompra,
      metasVenda,
      totais,
      resumo: {
        totalRepresentantes: representantes.length,
        metasAtivas,
        metasPendentes
      }
    };

    return NextResponse.json(metas);
  } catch (error) {
    console.error('Erro ao buscar dados de metas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
