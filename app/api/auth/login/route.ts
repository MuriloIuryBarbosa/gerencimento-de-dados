import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    // Validações
    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        empresa: true,
        permissoes: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar se usuário está ativo
    if (!usuario.ativo) {
      return NextResponse.json(
        { error: 'Usuário inativo' },
        { status: 401 }
      );
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Atualizar último acesso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcesso: new Date() }
    });

    // Gerar token JWT
    const token = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        isAdmin: usuario.isAdmin,
        isSuperAdmin: usuario.isSuperAdmin,
        empresaId: usuario.empresaId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Definir cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/'
    });

    // Retornar dados do usuário (sem senha)
    const { senha: _, ...usuarioSemSenha } = usuario;

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: usuarioSemSenha
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
