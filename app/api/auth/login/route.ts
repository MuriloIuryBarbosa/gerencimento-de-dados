import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services';
import { validateLogin } from '@/models/validations';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validation = validateLogin(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Autenticar usuário usando o serviço
    const authResponse = await AuthService.authenticateUser(validation.data);

    // Definir cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set('auth-token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/'
    });

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: authResponse.user
    });

  } catch (error: any) {
    console.error('Erro no login:', error);

    if (error.message === 'Credenciais inválidas') {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
