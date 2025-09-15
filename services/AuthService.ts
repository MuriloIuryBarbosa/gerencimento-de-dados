import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import {
  Usuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  LoginDTO,
  AuthResponse,
  UsuarioComEmpresa
} from '@/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
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
  static async authenticateUser(credentials: LoginDTO): Promise<AuthResponse> {
    const user = await prisma.usuario.findUnique({
      where: { email: credentials.email },
      include: {
        empresa: true,
        permissoes: true
      }
    });

    if (!user || !user.ativo) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await this.verifyPassword(credentials.senha, user.senha);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Atualizar último acesso
    await prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoAcesso: new Date() }
    });

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;

    // Gerar token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    });

    return {
      user: userWithoutPassword,
      token
    };
  }

  // Verificar permissões
  static hasPermission(user: UsuarioComEmpresa, requiredPermission: string, resource: string): boolean {
    if (user.isSuperAdmin) return true;

    return user.permissoes.some((perm) =>
      (perm.permissao === requiredPermission || perm.permissao === 'admin') &&
      (perm.recurso === resource || perm.recurso === 'todos')
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

  // Obter usuário por token
  static async getUserByToken(token: string): Promise<UsuarioComEmpresa | null> {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    const user = await prisma.usuario.findUnique({
      where: { id: payload.userId },
      include: {
        empresa: true,
        permissoes: true
      }
    });

    if (!user || !user.ativo) return null;

    // Remover senha do retorno
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}