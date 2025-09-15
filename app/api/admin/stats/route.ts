import { NextResponse } from 'next/server';
import { UserService } from '@/services';

export async function GET() {
  try {
    const stats = await UserService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
