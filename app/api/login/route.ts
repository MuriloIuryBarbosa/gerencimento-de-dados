import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Autenticar usuário
    const user = await AuthService.authenticateUser(email, password);

    // Gerar token JWT
    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    });

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user,
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
