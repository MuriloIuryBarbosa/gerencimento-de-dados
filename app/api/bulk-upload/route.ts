import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Implementação básica para resolver erro de TypeScript
    return NextResponse.json({ message: 'Endpoint não implementado' }, { status: 501 });
  } catch (error) {
    console.error('Erro no bulk upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}