import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha, cargo, departamento } = await request.json();

    // Validações
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Buscar empresa padrão (ou criar se não existir)
    let empresa = await prisma.empresa.findFirst({
      where: { nome: 'Empresa Padrão' }
    });

    if (!empresa) {
      empresa = await prisma.empresa.create({
        data: {
          nome: 'Empresa Padrão',
          cnpj: '00.000.000/0001-00',
          endereco: 'Rua Principal, 123',
          telefone: '(11) 99999-9999',
          email: 'contato@empresa.com',
          ativo: true
        }
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senha: hashedPassword,
        cargo: cargo?.trim() || null,
        departamento: departamento?.trim() || null,
        empresaId: empresa.id,
        isAdmin: false,
        isSuperAdmin: false,
        ativo: true
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        departamento: true,
        isAdmin: true,
        isSuperAdmin: true,
        ativo: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: novoUsuario
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
