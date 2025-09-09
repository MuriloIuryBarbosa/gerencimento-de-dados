import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EstatisticasTabela {
  nome: string;
  total: number;
  completos: number;
  incompletos: number;
  qualidade: number;
  problemas: string[];
}

interface AlertaQualidade {
  tipo: string;
  titulo: string;
  descricao: string;
  itens: string[];
}

async function analisarQualidadeSKU(): Promise<EstatisticasTabela> {
  const skus = await prisma.sKU.findMany();
  const total = skus.length;

  let completos = 0;
  let problemas: string[] = [];

  const semDescricao = skus.filter(sku => !sku.descricao).length;
  const semCategoria = skus.filter(sku => !sku.categoria).length;
  const semPreco = skus.filter(sku => !sku.precoVenda).length;

  // Um SKU é considerado completo se tem pelo menos nome, descrição e categoria
  completos = skus.filter(sku =>
    sku.nome &&
    sku.descricao &&
    sku.categoria &&
    sku.unidade
  ).length;

  if (semDescricao > 0) problemas.push(`${semDescricao} sem descrição`);
  if (semCategoria > 0) problemas.push(`${semCategoria} sem categoria`);
  if (semPreco > 0) problemas.push(`${semPreco} sem preço de venda`);

  const qualidade = total > 0 ? (completos / total) * 100 : 0;

  return {
    nome: 'SKUs',
    total,
    completos,
    incompletos: total - completos,
    qualidade: Math.round(qualidade * 10) / 10,
    problemas
  };
}

async function analisarQualidadeCores(): Promise<EstatisticasTabela> {
  const cores = await prisma.cor.findMany();
  const total = cores.length;

  let completos = 0;
  let problemas: string[] = [];

  const semHex = cores.filter(cor => !cor.codigoHex).length;
  const semPantone = cores.filter(cor => !cor.codigoPantone).length;

  // Uma cor é considerada completa se tem pelo menos nome e código hex
  completos = cores.filter(cor => cor.nome && cor.codigoHex).length;

  if (semHex > 0) problemas.push(`${semHex} sem código hexadecimal`);
  if (semPantone > 0) problemas.push(`${semPantone} sem código Pantone`);

  const qualidade = total > 0 ? (completos / total) * 100 : 0;

  return {
    nome: 'Cores',
    total,
    completos,
    incompletos: total - completos,
    qualidade: Math.round(qualidade * 10) / 10,
    problemas
  };
}

async function analisarQualidadeRepresentantes(): Promise<EstatisticasTabela> {
  const representantes = await prisma.representante.findMany();
  const total = representantes.length;

  let completos = 0;
  let problemas: string[] = [];

  const semEmail = representantes.filter(rep => !rep.email).length;
  const semTelefone = representantes.filter(rep => !rep.telefone).length;
  const semEmpresa = representantes.filter(rep => !rep.empresa).length;

  // Um representante é considerado completo se tem nome, email e telefone
  completos = representantes.filter(rep =>
    rep.nome && rep.email && rep.telefone
  ).length;

  if (semEmail > 0) problemas.push(`${semEmail} sem email`);
  if (semTelefone > 0) problemas.push(`${semTelefone} sem telefone`);
  if (semEmpresa > 0) problemas.push(`${semEmpresa} sem empresa`);

  const qualidade = total > 0 ? (completos / total) * 100 : 0;

  return {
    nome: 'Representantes',
    total,
    completos,
    incompletos: total - completos,
    qualidade: Math.round(qualidade * 10) / 10,
    problemas
  };
}

async function analisarQualidadeClientes(): Promise<EstatisticasTabela> {
  const clientes = await prisma.cliente.findMany();
  const total = clientes.length;

  let completos = 0;
  let problemas: string[] = [];

  const semCnpj = clientes.filter(cli => !cli.cnpj).length;
  const semEndereco = clientes.filter(cli => !cli.endereco).length;
  const semTelefone = clientes.filter(cli => !cli.telefone).length;
  const semEmail = clientes.filter(cli => !cli.email).length;

  // Um cliente é considerado completo se tem nome, CNPJ, endereço e contato
  completos = clientes.filter(cli =>
    cli.nome && cli.cnpj && cli.endereco && (cli.telefone || cli.email)
  ).length;

  if (semCnpj > 0) problemas.push(`${semCnpj} sem CNPJ`);
  if (semEndereco > 0) problemas.push(`${semEndereco} sem endereço`);
  if (semTelefone > 0) problemas.push(`${semTelefone} sem telefone`);
  if (semEmail > 0) problemas.push(`${semEmail} sem email`);

  const qualidade = total > 0 ? (completos / total) * 100 : 0;

  return {
    nome: 'Clientes',
    total,
    completos,
    incompletos: total - completos,
    qualidade: Math.round(qualidade * 10) / 10,
    problemas
  };
}

async function analisarQualidadeFornecedores(): Promise<EstatisticasTabela> {
  const fornecedores = await prisma.fornecedor.findMany();
  const total = fornecedores.length;

  let completos = 0;
  let problemas: string[] = [];

  const semCnpj = fornecedores.filter(forn => !forn.cnpj).length;
  const semEndereco = fornecedores.filter(forn => !forn.endereco).length;
  const semContato = fornecedores.filter(forn => !forn.contatoPrincipal && !forn.telefone && !forn.email).length;

  // Um fornecedor é considerado completo se tem nome, CNPJ e algum contato
  completos = fornecedores.filter(forn =>
    forn.nome && forn.cnpj && (forn.contatoPrincipal || forn.telefone || forn.email)
  ).length;

  if (semCnpj > 0) problemas.push(`${semCnpj} sem CNPJ`);
  if (semEndereco > 0) problemas.push(`${semEndereco} sem endereço`);
  if (semContato > 0) problemas.push(`${semContato} sem dados de contato`);

  const qualidade = total > 0 ? (completos / total) * 100 : 0;

  return {
    nome: 'Fornecedores',
    total,
    completos,
    incompletos: total - completos,
    qualidade: Math.round(qualidade * 10) / 10,
    problemas
  };
}

async function analisarQualidadeTransportadoras(): Promise<EstatisticasTabela> {
  const transportadoras = await prisma.transportadora.findMany();
  const total = transportadoras.length;

  let completos = 0;
  let problemas: string[] = [];

  const semCnpj = transportadoras.filter(trans => !trans.cnpj).length;
  const semEndereco = transportadoras.filter(trans => !trans.endereco).length;
  const semContato = transportadoras.filter(trans => !trans.contato && !trans.telefone && !trans.email).length;

  // Uma transportadora é considerada completa se tem nome, CNPJ e algum contato
  completos = transportadoras.filter(trans =>
    trans.nome && trans.cnpj && (trans.contato || trans.telefone || trans.email)
  ).length;

  if (semCnpj > 0) problemas.push(`${semCnpj} sem CNPJ`);
  if (semEndereco > 0) problemas.push(`${semEndereco} sem endereço`);
  if (semContato > 0) problemas.push(`${semContato} sem dados de contato`);

  const qualidade = total > 0 ? (completos / total) * 100 : 0;

  return {
    nome: 'Transportadoras',
    total,
    completos,
    incompletos: total - completos,
    qualidade: Math.round(qualidade * 10) / 10,
    problemas
  };
}

async function analisarQualidadeEmpresas(): Promise<EstatisticasTabela> {
  const empresas = await prisma.empresa.findMany() as any[];
  const total = empresas.length;

  let completos = 0;
  let problemas: string[] = [];

  const semCnpj = empresas.filter(emp => !emp.cnpj).length;
  const semEndereco = empresas.filter(emp => !emp.endereco).length;
  const semContato = empresas.filter(emp => !emp.contato && !emp.telefone && !emp.email).length;

  // Uma empresa é considerada completa se tem nome, CNPJ, endereço e algum contato
  completos = empresas.filter(emp =>
    emp.nome && emp.cnpj && emp.endereco && (emp.contato || emp.telefone || emp.email)
  ).length;

  if (semCnpj > 0) problemas.push(`${semCnpj} sem CNPJ`);
  if (semEndereco > 0) problemas.push(`${semEndereco} sem endereço completo`);
  if (semContato > 0) problemas.push(`${semContato} sem dados de contato`);

  const qualidade = total > 0 ? (completos / total) * 100 : 0;

  return {
    nome: 'Empresas',
    total,
    completos,
    incompletos: total - completos,
    qualidade: Math.round(qualidade * 10) / 10,
    problemas
  };
}

async function gerarAlertas(detalhesPorTabela: EstatisticasTabela[]): Promise<AlertaQualidade[]> {
  const alertas: AlertaQualidade[] = [];

  // Alertas críticos
  const tabelasCriticas = detalhesPorTabela.filter(tabela =>
    tabela.qualidade < 80 && tabela.total > 0
  );

  if (tabelasCriticas.length > 0) {
    alertas.push({
      tipo: 'critico',
      titulo: 'Qualidade Crítica de Dados',
      descricao: 'Tabelas com qualidade abaixo de 80% precisam de atenção imediata',
      itens: tabelasCriticas.map(tabela =>
        `${tabela.nome}: ${tabela.qualidade}% de qualidade (${tabela.incompletos} registros incompletos)`
      )
    });
  }

  // Alertas de dados desatualizados (simulado - em produção seria baseado em updatedAt)
  const tabelasComProblemas = detalhesPorTabela.filter(tabela =>
    tabela.problemas.length > 0
  );

  if (tabelasComProblemas.length > 0) {
    alertas.push({
      tipo: 'aviso',
      titulo: 'Dados Incompletos Detectados',
      descricao: 'Foram encontrados registros com campos obrigatórios vazios',
      itens: tabelasComProblemas.flatMap(tabela =>
        tabela.problemas.map(problema => `${tabela.nome}: ${problema}`)
      )
    });
  }

  return alertas;
}

export async function GET() {
  try {
    // Analisar todas as tabelas
    const [
      skus,
      cores,
      representantes,
      clientes,
      fornecedores,
      transportadoras,
      empresas
    ] = await Promise.all([
      analisarQualidadeSKU(),
      analisarQualidadeCores(),
      analisarQualidadeRepresentantes(),
      analisarQualidadeClientes(),
      analisarQualidadeFornecedores(),
      analisarQualidadeTransportadoras(),
      analisarQualidadeEmpresas()
    ]);

    const detalhesPorTabela = [skus, cores, representantes, clientes, fornecedores, transportadoras, empresas];

    // Calcular estatísticas gerais
    const totalTabelas = detalhesPorTabela.length;
    const totalRegistros = detalhesPorTabela.reduce((sum, tabela) => sum + tabela.total, 0);
    const registrosCompletos = detalhesPorTabela.reduce((sum, tabela) => sum + tabela.completos, 0);
    const registrosIncompletos = totalRegistros - registrosCompletos;
    const qualidadeGeral = totalRegistros > 0 ? (registrosCompletos / totalRegistros) * 100 : 0;
    const tabelasComProblemas = detalhesPorTabela.filter(tabela => tabela.problemas.length > 0).length;

    // Buscar último cálculo para comparar evolução
    const ultimoCalculo = await (prisma as any).historicoQualidadeDados.findFirst({
      orderBy: { dataCalculo: 'desc' }
    });

    let evolucaoQualidade = 0;
    let evolucaoRegistros = 0;
    let statusEvolucao = 'estavel';

    if (ultimoCalculo) {
      evolucaoQualidade = Math.round((qualidadeGeral - Number(ultimoCalculo.qualidadeGeral)) * 10) / 10;
      evolucaoRegistros = totalRegistros - ultimoCalculo.totalRegistros;

      if (evolucaoQualidade > 1) statusEvolucao = 'melhoria';
      else if (evolucaoQualidade < -1) statusEvolucao = 'retrocesso';
    }

    // Registrar histórico
    await (prisma as any).historicoQualidadeDados.create({
      data: {
        qualidadeGeral: qualidadeGeral,
        totalTabelas,
        totalRegistros,
        registrosCompletos,
        registrosIncompletos,
        detalhesTabelas: JSON.stringify(detalhesPorTabela),
        observacoes: `Cálculo automático - Qualidade: ${Math.round(qualidadeGeral * 10) / 10}%`
      }
    });

    // Gerar alertas
    const alertas = await gerarAlertas(detalhesPorTabela);

    const estatisticasQualidade = {
      totalTabelas,
      totalRegistros,
      registrosCompletos,
      registrosIncompletos,
      qualidadeGeral: Math.round(qualidadeGeral * 10) / 10,
      tabelasComProblemas,
      detalhesPorTabela,
      alertas,
      evolucao: {
        qualidade: evolucaoQualidade,
        registros: evolucaoRegistros,
        status: statusEvolucao,
        ultimoCalculo: ultimoCalculo?.dataCalculo
      }
    };

    return NextResponse.json({
      success: true,
      data: estatisticasQualidade
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de qualidade:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
