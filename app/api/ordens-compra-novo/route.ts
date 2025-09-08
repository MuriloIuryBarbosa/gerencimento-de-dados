import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ordensCompra = await prisma.ordensCompra.findMany({
      include: {
        empresa: true
      },
      orderBy: { data_criacao: 'desc' },
      take: 50 // Limitar para performance
    });

    return NextResponse.json({
      success: true,
      data: ordensCompra
    });
  } catch (error) {
    console.error('Erro ao buscar ordens de compra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados obrigatórios
    if (!body.empresaId || !body.uneg || !body.familiaCodigo || !body.itens || body.itens.length === 0) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos (empresa, UNEG, família, itens)' },
        { status: 400 }
      );
    }

    // Verificar se a empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id: parseInt(body.empresaId) }
    });

    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada. Verifique se a empresa foi cadastrada corretamente.' },
        { status: 400 }
      );
    }

    // Gerar ID único para a ordem
    const id = `OC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    // Criar a ordem de compra com o novo schema
    const ordemCompra = await prisma.ordensCompra.create({
      data: {
        id,
        empresa_id: parseInt(body.empresaId),
        uneg: body.uneg,
        familia_codigo: body.familiaCodigo,
        familia_nome: body.familiaNome || null,
        produto_descricao: body.produtoDescricao || null,
        cod_tamanho: body.codTamanho || null,
        observacao: body.observacao || null,
        capacidade_container: body.capacidadeContainer || null,
        planejado_compra: body.planejadoCompra ? parseInt(body.planejadoCompra) : null,
        etd_target: body.etdTarget ? new Date(body.etdTarget) : null,
        week_etd: body.weekEtd || null,
        transit_time: body.transitTime ? parseInt(body.transitTime) : null,
        lead_time: body.leadTime ? parseInt(body.leadTime) : null,
        factory_date: body.factoryDate ? new Date(body.factoryDate) : null,
        week_factory: body.weekFactory || null,
        date_of_sale: body.dateOfSale ? new Date(body.dateOfSale) : null,
        prop_cont: body.propCont || null,
        original_total_value: body.valorTotal || 0, // Usar o valor total calculado
        cost_in_dollars: body.costInDollars ? parseFloat(body.costInDollars) : null,
        total_value_dollars_item: body.totalValueDollarsItem ? parseFloat(body.totalValueDollarsItem) : null,
        total_value_dollars_uc: body.totalValueDollarsUc ? parseFloat(body.totalValueDollarsUc) : null,
        total_containers: body.totalContainers ? parseInt(body.totalContainers) : null,

        // Campos PI (Proforma Invoice)
        pi_numero: body.piNumero || null,
        pi_date: body.piDate ? new Date(body.piDate) : null,
        pi_country: body.piCountry || null,
        pi_supplier: body.piSupplier || null,
        pi_obs: body.piObs || null,
        pi_original_currency: body.piOriginalCurrency || null,
        pi_original_cost: body.piOriginalCost ? parseFloat(body.piOriginalCost) : null,

        // Controle
        status: body.status || 'Pendente Aprovação',
        usuario_criador_nome: body.usuarioCriadorNome || 'Sistema',
        data_criacao: new Date(),
        compartilhado_com: body.compartilhadoCom ? JSON.stringify(body.compartilhadoCom) : null
      },
      include: {
        empresa: true
      }
    });

    // Criar os itens da ordem de compra
    if (body.itens && Array.isArray(body.itens)) {
      for (const item of body.itens) {
        await prisma.itemOrdemCompra.create({
          data: {
            ordemId: id,
            skuId: item.skuId,
            descricao: item.descricao || item.skuNome,
            quantidade: item.quantidade,
            unidade: item.unidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal,
            dataEntrega: null, // Pode ser definido depois
            status: 'Pendente'
          }
        });
      }
    }

    // Criar entrada no histórico
    await prisma.ordensCompraHistorico.create({
      data: {
        ordem_compra_id: id,
        acao: 'Criada',
        usuario_nome: body.usuarioCriadorNome || 'Sistema',
        data_acao: new Date(),
        detalhes: `Ordem de compra ${id} criada com sucesso`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Ordem de compra criada com sucesso',
      data: {
        id: ordemCompra.id,
        status: ordemCompra.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar ordem de compra:', error);

    // Verificar se é erro de constraint ou chave duplicada
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'ID da ordem de compra já existe. Tente novamente.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
