import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação - por enquanto, simular verificação
    // TODO: Implementar verificação de sessão/token adequada

    // Simulação: verificar se há um usuário super admin no banco
    const superAdminUser = await prisma.usuario.findFirst({
      where: {
        isSuperAdmin: true
      },
      select: {
        id: true,
        nome: true,
        email: true,
        isSuperAdmin: true
      }
    });

    if (!superAdminUser) {
      return NextResponse.json(
        { error: 'Acesso negado. Nenhum super administrador encontrado.' },
        { status: 403 }
      );
    }

    console.log('Iniciando configuração do banco de dados por:', superAdminUser.nome);

    // Executar prisma db push para criar as tabelas
    try {
      const { stdout, stderr } = await execAsync('npx prisma db push --force-reset');
      console.log('Prisma db push stdout:', stdout);
      if (stderr) {
        console.log('Prisma db push stderr:', stderr);
      }
    } catch (error) {
      console.error('Erro ao executar prisma db push:', error);
      return NextResponse.json(
        { error: 'Erro ao criar tabelas do banco de dados', details: error instanceof Error ? error.message : 'Erro desconhecido' },
        { status: 500 }
      );
    }

    // Verificar se as tabelas foram criadas
    try {
      const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
      console.log('Tabelas criadas:', tables);
    } catch (error) {
      console.error('Erro ao verificar tabelas:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados configurado com sucesso!'
    });

  } catch (error) {
    console.error('Erro geral:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
