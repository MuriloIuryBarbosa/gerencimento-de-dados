import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'

// Mock database users for development/testing - remove in production when Prisma is available
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

// Try to import Prisma, fallback to null if not available
let prisma: any = null;
try {
  const { prisma: prismaClient } = require('../../../lib/prisma');
  prisma = prismaClient;
} catch (error) {
  console.log('Prisma client not available, using mock data for testing');
}

export async function POST(request: Request) {
  try {
    console.log('API Login - Received request');
    const { email, password } = await request.json();
    console.log('API Login - Email:', email, 'Password length:', password?.length);

    if (!email || !password) {
      return Response.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    let usuario = null;

    // Try to use real database first, fallback to mock data
    if (prisma) {
      try {
        console.log('API Login - Using Prisma database');
        usuario = await prisma.usuario.findUnique({
          where: {
            email: email.toLowerCase(),
            ativo: true
          },
          include: {
            permissoes: {
              where: {
                ativo: true,
                OR: [
                  { dataExpiracao: null },
                  { dataExpiracao: { gt: new Date() } }
                ]
              },
              include: {
                permissao: {
                  select: {
                    nome: true,
                    categoria: true
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.log('API Login - Prisma error, falling back to mock data:', error.message);
        prisma = null; // Disable Prisma for this request
      }
    }

    // Fallback to mock data if Prisma is not available
    if (!prisma) {
      console.log('API Login - Using mock database');
      usuario = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.ativo
      );
    }

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

    // Mapear permissões
    let permissoes = [];
    if (prisma && usuario.permissoes) {
      permissoes = usuario.permissoes.map((up: any) => up.permissao.nome);
    } else {
      permissoes = usuario.permissoes || [];
    }

    // Atualizar último acesso se usando Prisma
    if (prisma) {
      try {
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { ultimoAcesso: new Date() }
        });
      } catch (error) {
        console.log('API Login - Could not update last access:', error.message);
      }
    }

    const user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      isAdmin: usuario.isAdmin,
      isSuperAdmin: usuario.isSuperAdmin,
      permissoes: permissoes,
    };

    console.log('API Login - Returning user:', { ...user, permissoes: 'hidden for security' });
    return Response.json({ user });

  } catch (error) {
    console.error('API Login - Error:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
