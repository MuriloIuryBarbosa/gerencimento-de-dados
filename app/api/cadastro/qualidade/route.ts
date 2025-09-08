import { NextRequest, NextResponse } from 'next/server';

// Simulação de dados de qualidade para o dashboard de cadastro
export async function GET() {
  try {
    const estatisticasQualidade = {
      totalTabelas: 7,
      totalRegistros: 1864,
      registrosCompletos: 1712,
      registrosIncompletos: 152,
      qualidadeGeral: 91.8,
      tabelasComProblemas: 3,
      detalhesPorTabela: [
        {
          nome: 'SKUs',
          total: 1250,
          completos: 1180,
          incompletos: 70,
          qualidade: 94.4,
          problemas: ['45 sem descrição', '25 sem categoria']
        },
        {
          nome: 'Cores',
          total: 156,
          completos: 142,
          incompletos: 14,
          qualidade: 91.0,
          problemas: ['14 sem código hexadecimal']
        },
        {
          nome: 'Representantes',
          total: 45,
          completos: 38,
          incompletos: 7,
          qualidade: 84.4,
          problemas: ['7 sem telefone']
        },
        {
          nome: 'Clientes',
          total: 234,
          completos: 198,
          incompletos: 36,
          qualidade: 84.6,
          problemas: ['23 sem endereço', '13 sem CNPJ']
        },
        {
          nome: 'Fornecedores',
          total: 89,
          completos: 76,
          incompletos: 13,
          qualidade: 85.4,
          problemas: ['8 sem CNPJ', '5 sem contato']
        },
        {
          nome: 'Transportadoras',
          total: 67,
          completos: 58,
          incompletos: 9,
          qualidade: 86.6,
          problemas: ['9 sem dados de contato']
        },
        {
          nome: 'Empresas',
          total: 23,
          completos: 20,
          incompletos: 3,
          qualidade: 87.0,
          problemas: ['3 sem endereço completo']
        }
      ],
      alertas: [
        {
          tipo: 'critico',
          titulo: 'Cadastros Críticos Incompletos',
          descricao: 'Alguns cadastros essenciais estão com campos obrigatórios vazios',
          itens: [
            'SKUs sem descrição completa: 45 registros',
            'Fornecedores sem CNPJ: 8 registros',
            'Clientes sem endereço: 23 registros'
          ]
        },
        {
          tipo: 'aviso',
          titulo: 'Dados Desatualizados',
          descricao: 'Alguns registros não são atualizados há mais de 6 meses',
          itens: [
            'Transportadoras: 12 registros desatualizados',
            'Representantes: 5 registros desatualizados',
            'Cores: 3 registros desatualizados'
          ]
        }
      ]
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
  }
}
