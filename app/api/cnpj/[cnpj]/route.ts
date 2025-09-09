import { NextRequest, NextResponse } from 'next/server';

// Simulação de API de CNPJ - Em produção, integrar com serviço real
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  try {
    const { cnpj } = await params;

    // Validação básica do CNPJ
    if (!cnpj || cnpj.length !== 14) {
      return NextResponse.json(
        { success: false, error: 'CNPJ inválido' },
        { status: 400 }
      );
    }

    // Simulação de busca na API externa
    // Em produção, substituir por chamada real para API de CNPJ
    const mockData = {
      '12345678000190': {
        nome: 'Empresa ABC Ltda',
        fantasia: 'ABC Textiles',
        endereco: 'Rua das Flores, 123',
        numero: '123',
        complemento: 'Sala 456',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 99999-9999',
        email: 'contato@empresaabc.com.br',
        situacao: 'ATIVA',
        data_situacao: '2020-01-15',
        cnae_principal: '13.94-1-00',
        cnae_principal_descricao: 'Fabricação de outros produtos têxteis não especificados anteriormente'
      },
      '98765432000110': {
        nome: 'Fábrica XYZ S.A.',
        fantasia: 'XYZ Malharia',
        endereco: 'Av. Industrial, 456',
        numero: '456',
        complemento: '',
        bairro: 'Distrito Industrial',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000-000',
        telefone: '(21) 88888-8888',
        email: 'vendas@fabricaxyz.com.br',
        situacao: 'ATIVA',
        data_situacao: '2019-03-20',
        cnae_principal: '13.91-1-00',
        cnae_principal_descricao: 'Fabricação de tecidos de malha'
      }
    };

    const empresaData = mockData[cnpj as keyof typeof mockData];

    if (!empresaData) {
      return NextResponse.json(
        { success: false, error: 'CNPJ não encontrado' },
        { status: 404 }
      );
    }

    // Simular delay da API externa
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: empresaData
    });

  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Para futuras implementações de busca customizada
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cnpj } = body;

    if (!cnpj) {
      return NextResponse.json(
        { success: false, error: 'CNPJ é obrigatório' },
        { status: 400 }
      );
    }

    // Criar uma requisição GET simulada
    const getRequest = new Request(`${request.url.split('?')[0]}/${cnpj}`, {
      method: 'GET',
      headers: request.headers
    });

    const response = await GET(getRequest as NextRequest, { params: Promise.resolve({ cnpj }) });
    return response;

  } catch (error) {
    console.error('Erro na busca de CNPJ:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
