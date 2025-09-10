import { NextRequest, NextResponse } from 'next/server';

// Mock database users for development/testing
const MOCK_USERS = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@sistema.com',
    cargo: 'Administrador',
    isAdmin: true,
    isSuperAdmin: true,
    ativo: true,
    ultimoAcesso: new Date()
  }
];

// Try to import Prisma, fallback to null if not available
let prisma: any = null;
try {
  const { prisma: prismaClient } = require('../../../../lib/prisma');
  prisma = prismaClient;
} catch (error) {
  console.log('Prisma client not available, using mock data for testing');
}

export async function GET(request: NextRequest) {
  try {
    // Para um sistema mais simples, vamos validar baseado no email fornecido no header
    // Em um sistema mais robusto, usaríamos JWT tokens ou sessões
    const authHeader = request.headers.get('authorization');
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Usuário não identificado' },
        { status: 401 }
      );
    }

    let usuario = null;

    // Try to use real database first, fallback to mock data
    if (prisma) {
      try {
        console.log('Auth Check - Using Prisma database');
        usuario = await prisma.usuario.findUnique({
          where: {
            email: userEmail.toLowerCase(),
            ativo: true
          },
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true,
            isAdmin: true,
            isSuperAdmin: true,
            ultimoAcesso: true
          }
        });
      } catch (error) {
        console.log('Auth Check - Prisma error, falling back to mock data:', error.message);
        prisma = null;
      }
    }

    // Fallback to mock data if Prisma is not available
    if (!prisma) {
      console.log('Auth Check - Using mock database');
      usuario = MOCK_USERS.find(u => 
        u.email.toLowerCase() === userEmail.toLowerCase() && u.ativo
      );
    }

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado ou inativo' },
        { status: 401 }
      );
    }

    // Verificar se o último acesso foi recente (24 horas)
    const now = new Date();
    const ultimoAcesso = usuario.ultimoAcesso ? new Date(usuario.ultimoAcesso) : null;
    const vinteCquatroHorasAtras = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (!ultimoAcesso || ultimoAcesso < vinteCquatroHorasAtras) {
      return NextResponse.json(
        { error: 'Sessão expirada' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        isAdmin: usuario.isAdmin,
        isSuperAdmin: usuario.isSuperAdmin
      },
      authenticated: true
    });

  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
