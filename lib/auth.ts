import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  papelId?: number;
  permissions: string[];
}

export interface PermissionCheck {
  permissao: string;
  recurso: string;
  valor?: string;
}

export class AuthService {
  // Hash de senha
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Verificar senha
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Gerar token JWT
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  // Verificar token JWT
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  // Autenticar usuário
  static async authenticateUser(email: string, password: string) {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        empresa: true,
        permissoes: true,
        papel: {
          include: {
            permissoes: true
          }
        }
      }
    });

    if (!user || !user.ativo) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await this.verifyPassword(password, user.senha);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Atualizar último acesso
    await prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoAcesso: new Date() }
    });

    // Coletar todas as permissões (papel + específicas do usuário)
    const permissions = this.collectUserPermissions(user);

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      permissions
    };
  }

  // Coletar todas as permissões do usuário (papel + específicas)
  static collectUserPermissions(user: any): string[] {
    const permissions: string[] = [];

    // Super admin tem acesso total
    if (user.isSuperAdmin) {
      permissions.push('super_admin');
      return permissions;
    }

    // Permissões do papel
    if (user.papel?.permissoes) {
      user.papel.permissoes.forEach((perm: any) => {
        const permKey = `${perm.permissao}:${perm.recurso}${perm.valor ? `:${perm.valor}` : ''}`;
        permissions.push(permKey);
      });
    }

    // Permissões específicas do usuário (sobrescrevem as do papel)
    if (user.permissoes) {
      user.permissoes.forEach((perm: any) => {
        const permKey = `${perm.permissao}:${perm.recurso}${perm.valor ? `:${perm.valor}` : ''}`;
        // Se já existe, substitui; senão, adiciona
        const existingIndex = permissions.findIndex(p => p.startsWith(`${perm.permissao}:${perm.recurso}`));
        if (existingIndex >= 0) {
          permissions[existingIndex] = permKey;
        } else {
          permissions.push(permKey);
        }
      });
    }

    return permissions;
  }

  // Verificar token de requisição (para APIs)
  static async verifyRequest(request: any): Promise<any | null> {
    try {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
      }

      const token = authHeader.substring(7);
      const payload = this.verifyToken(token);

      if (!payload) return null;

      // Buscar usuário completo
      const user = await prisma.usuario.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
          departamento: true,
          empresaId: true,
          papelId: true,
          isAdmin: true,
          isSuperAdmin: true,
          ativo: true,
          ultimoAcesso: true,
          createdAt: true,
          updatedAt: true,
          empresa: true,
          permissoes: true
        }
      });

      if (!user || !user.ativo) return null;

      // Buscar papel separadamente se existir
      let papel = null;
      if (user.papelId) {
        papel = await prisma.papel.findUnique({
          where: { id: user.papelId },
          include: {
            permissoes: true
          }
        });
      }

      const userWithPapel = { ...user, papel };

      // Coletar permissões
      const permissions = this.collectUserPermissions(userWithPapel);

      return {
        ...user,
        permissions
      };

      return {
        ...user,
        permissions
      };

    } catch (error) {
      return null;
    }
  }
  static hasPermission(user: any, requiredPermission: string, resource: string, value?: string): boolean {
    // Super admin tem acesso total
    if (user.isSuperAdmin || user.permissions?.includes('super_admin')) return true;

    // Verificar permissões do usuário
    if (user.permissions) {
      const requiredPerm = `${requiredPermission}:${resource}${value ? `:${value}` : ''}`;

      // Verificar permissão exata
      if (user.permissions.includes(requiredPerm)) return true;

      // Verificar permissão genérica (sem valor específico)
      if (value && user.permissions.includes(`${requiredPermission}:${resource}`)) return true;

      // Verificar permissão admin para o recurso
      if (user.permissions.includes(`admin:${resource}`)) return true;

      // Verificar permissão admin geral
      if (user.permissions.includes('admin:todos')) return true;
    }

    return false;
  }

  // Verificar múltiplas permissões (OU lógico)
  static hasAnyPermission(user: any, permissions: PermissionCheck[]): boolean {
    return permissions.some(perm =>
      this.hasPermission(user, perm.permissao, perm.recurso, perm.valor)
    );
  }

  // Verificar todas as permissões (E lógico)
  static hasAllPermissions(user: any, permissions: PermissionCheck[]): boolean {
    return permissions.every(perm =>
      this.hasPermission(user, perm.permissao, perm.recurso, perm.valor)
    );
  }

  // Gerar token de recuperação de senha
  static async generatePasswordResetToken(userId: number): Promise<string> {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // TODO: Implementar quando o modelo estiver funcionando
    // await prisma.passwordResetToken.create({
    //   data: {
    //     usuarioId: userId,
    //     token,
    //     expiresAt
    //   }
    // });

    return token;
  }

  // Verificar token de recuperação de senha
  static async verifyPasswordResetToken(token: string) {
    // TODO: Implementar quando o modelo estiver funcionando
    // const resetToken = await prisma.passwordResetToken.findUnique({
    //   where: { token },
    //   include: { usuario: true }
    // });

    // if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    //   throw new Error('Token inválido ou expirado');
    // }

    // return resetToken.usuario;

    throw new Error('Funcionalidade temporariamente indisponível');
  }

  // Resetar senha
  static async resetPassword(token: string, newPassword: string) {
    // TODO: Implementar quando o modelo estiver funcionando
    throw new Error('Funcionalidade temporariamente indisponível');
  }

  // Gerar token seguro
  private static generateSecureToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}
