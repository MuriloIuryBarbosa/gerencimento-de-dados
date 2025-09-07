import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar obtenção do usuário do contexto de autenticação
    // Por enquanto, vamos simular diferentes cenários para teste

    // Simulação: verificar se há um usuário admin no banco
    const adminUser = await (prisma as any).usuario.findFirst({
      where: {
        OR: [
          { isAdmin: true },
          { isSuperAdmin: true }
        ]
      },
      select: {
        id: true,
        nome: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true
      }
    });

    if (!adminUser) {
      // Se não há usuário admin, retornar acesso negado
      return NextResponse.json({
        canAccessAdmin: false,
        isAdmin: false,
        isSuperAdmin: false,
        permissions: []
      });
    }

    // Usar o primeiro usuário admin encontrado para simulação
    const userId = adminUser.id;

    // Se for super admin, tem acesso total
    if (adminUser.isSuperAdmin) {
      return NextResponse.json({
        canAccessAdmin: true,
        isAdmin: adminUser.isAdmin,
        isSuperAdmin: true,
        permissions: ['*'] // Todas as permissões
      });
    }

    // Buscar permissões específicas do usuário
    const usuarioPermissoes = await (prisma as any).usuarioPermissao.findMany({
      where: {
        usuarioId: userId,
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
    });

    const permissions = usuarioPermissoes.map((up: any) => up.permissao.nome);

    // Verificar se tem permissão de admin ou é admin
    const canAccessAdmin = adminUser.isAdmin ||
                          permissions.includes('admin.full_access') ||
                          permissions.some((p: string) => p.startsWith('admin.'));

    return NextResponse.json({
      canAccessAdmin,
      isAdmin: adminUser.isAdmin,
      isSuperAdmin: false,
      permissions
    });

  } catch (error) {
    console.error('Erro ao verificar permissões do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
