// Services Layer - Lógica de negócio do sistema
// Este arquivo exporta todos os serviços disponíveis

export { AuthService } from './AuthService';
export { UserService } from './UserService';
export { EmpresaService } from './EmpresaService';

// Re-export types from models for convenience
export type {
  Usuario,
  Empresa,
  UsuarioPermissao,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  LoginDTO,
  AuthResponse,
  UsuarioComEmpresa,
  JWTPayload
} from '@/models';