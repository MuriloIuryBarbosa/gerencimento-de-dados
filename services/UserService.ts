import { prisma } from '@/lib/prisma';
import {
  Usuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  UsuarioComEmpresa
} from '@/models';
import { AuthService } from './AuthService';

export class UserService {
  // Buscar todos os usuários
  static async findAll(): Promise<UsuarioComEmpresa[]> {
    const usuarios = await prisma.usuario.findMany({
      include: {
        empresa: true,
        permissoes: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Remover senhas do retorno
    return usuarios.map(user => {
      const { senha, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Buscar usuário por ID
  static async findById(id: number): Promise<UsuarioComEmpresa | null> {
    const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        empresa: true,
        permissoes: true
      }
    });

    if (!user) return null;

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Buscar usuário por email
  static async findByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email },
      include: {
        empresa: true,
        permissoes: true
      }
    });
  }

  // Criar novo usuário
  static async create(data: CreateUsuarioDTO): Promise<UsuarioComEmpresa> {
    // Hash da senha
    const hashedPassword = await AuthService.hashPassword(data.senha);

    const user = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
        cargo: data.cargo,
        departamento: data.departamento,
        empresaId: data.empresaId,
        isAdmin: data.isAdmin || false,
        isSuperAdmin: data.isSuperAdmin || false
      },
      include: {
        empresa: true,
        permissoes: true
      }
    });

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Atualizar usuário
  static async update(id: number, data: UpdateUsuarioDTO): Promise<UsuarioComEmpresa> {
    const updateData: any = { ...data };

    // Se a senha foi fornecida, fazer hash
    if (data.senha) {
      updateData.senha = await AuthService.hashPassword(data.senha);
    }

    const user = await prisma.usuario.update({
      where: { id },
      data: updateData,
      include: {
        empresa: true,
        permissoes: true
      }
    });

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Deletar usuário (soft delete)
  static async delete(id: number): Promise<void> {
    await prisma.usuario.update({
      where: { id },
      data: { ativo: false }
    });
  }

  // Reativar usuário
  static async reactivate(id: number): Promise<UsuarioComEmpresa> {
    const user = await prisma.usuario.update({
      where: { id },
      data: { ativo: true },
      include: {
        empresa: true,
        permissoes: true
      }
    });

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Buscar usuários por empresa
  static async findByEmpresa(empresaId: number): Promise<UsuarioComEmpresa[]> {
    const usuarios = await prisma.usuario.findMany({
      where: {
        empresaId,
        ativo: true
      },
      include: {
        empresa: true,
        permissoes: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Remover senhas do retorno
    return usuarios.map(user => {
      const { senha, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Verificar se email já existe
  static async emailExists(email: string, excludeId?: number): Promise<boolean> {
    const where: any = { email };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await prisma.usuario.count({ where });
    return count > 0;
  }

  // Obter estatísticas de usuários
  static async getStats() {
    const [totalUsuarios, totalEmpresas, totalPermissoes] = await Promise.all([
      prisma.usuario.count({ where: { ativo: true } }),
      prisma.empresa.count({ where: { ativo: true } }),
      prisma.usuarioPermissao.count()
    ]);

    return {
      totalUsuarios,
      totalEmpresas,
      totalPermissoes
    };
  }
}