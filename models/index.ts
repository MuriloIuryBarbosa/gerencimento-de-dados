// Models Layer - Interfaces TypeScript para os modelos de dados
// Este arquivo define as interfaces que representam as entidades do sistema

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cargo?: string;
  departamento?: string;
  empresaId?: number;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  ativo: boolean;
  ultimoAcesso?: Date;
  createdAt: Date;
  updatedAt: Date;
  empresa?: Empresa;
  permissoes: UsuarioPermissao[];
}

export interface Empresa {
  id: number;
  nome: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  usuarios: Usuario[];
}

export interface UsuarioPermissao {
  id: number;
  usuarioId: number;
  permissao: string;
  recurso: string;
  createdAt: Date;
  usuario: Usuario;
}

export interface PasswordResetToken {
  id: number;
  usuarioId: number;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  usuario: Usuario;
}

export interface SessaoUsuario {
  id: number;
  usuarioId: number;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  usuario: Usuario;
}

// DTOs para operações específicas
export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  cargo?: string;
  departamento?: string;
  empresaId?: number;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  cargo?: string;
  departamento?: string;
  empresaId?: number;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  ativo?: boolean;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface AuthResponse {
  user: Omit<Usuario, 'senha'>;
  token: string;
}

export interface UsuarioComEmpresa extends Omit<Usuario, 'senha'> {
  empresa?: Empresa;
}