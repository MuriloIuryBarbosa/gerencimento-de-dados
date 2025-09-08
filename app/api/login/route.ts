import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('API Login - Received request');
    const { email, password } = await request.json();
    console.log('API Login - Email:', email, 'Password length:', password?.length);

    // Simulação de autenticação - em produção, verificar no banco de dados
    if (email === 'admin@example.com' && password === '123456') {
      console.log('API Login - Authentication successful');
      const user = {
        id: 1,
        nome: 'Administrador',
        email: 'admin@example.com',
        cargo: 'admin',
        isAdmin: true,
        isSuperAdmin: false,
        permissoes: ['read', 'write', 'admin'],
      };

      console.log('API Login - Returning user:', user);
      return Response.json({ user });
    } else {
      console.log('API Login - Authentication failed');
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }
  } catch (error) {
    console.error('API Login - Error:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
