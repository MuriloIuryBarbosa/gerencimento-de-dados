import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'

// Mock database users for testing - in production this would come from real database
const MOCK_USERS = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@sistema.com',
    senha: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    cargo: 'Administrador',
    isAdmin: true,
    isSuperAdmin: true,
    ativo: true,
    permissoes: []
  }
];

export async function POST(request: Request) {
  try {
    console.log('API Login - Received request');
    const { email, password } = await request.json();
    console.log('API Login - Email:', email, 'Password length:', password?.length);

    if (!email || !password) {
      return Response.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Buscar usuário no "banco de dados" mock
    const usuario = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.ativo
    );

    if (!usuario) {
      console.log('API Login - User not found');
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Verificar senha usando bcrypt
    const senhaValida = await bcrypt.compare(password, usuario.senha);
    if (!senhaValida) {
      console.log('API Login - Invalid password');
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    console.log('API Login - Authentication successful');

    const user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      isAdmin: usuario.isAdmin,
      isSuperAdmin: usuario.isSuperAdmin,
      permissoes: usuario.permissoes,
    };

    console.log('API Login - Returning user:', { ...user, permissoes: 'hidden for security' });
    return Response.json({ user });

  } catch (error) {
    console.error('API Login - Error:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
