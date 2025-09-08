import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Para este sistema simples, sempre retornar não autorizado
    // pois não estamos usando tokens JWT ou sessões reais
    // A autenticação é mantida apenas no localStorage do cliente
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
