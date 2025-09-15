// Validações e tipos auxiliares para os modelos
import { z } from 'zod';

// Schemas de validação usando Zod
export const CreateUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  cargo: z.string().optional(),
  departamento: z.string().optional(),
  empresaId: z.number().optional(),
  isAdmin: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
});

export const UpdateUsuarioSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email().optional(),
  cargo: z.string().optional(),
  departamento: z.string().optional(),
  empresaId: z.number().optional(),
  isAdmin: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
  ativo: z.boolean().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

// Tipos inferidos dos schemas
export type CreateUsuarioInput = z.infer<typeof CreateUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof UpdateUsuarioSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// Funções de validação
export function validateCreateUsuario(data: unknown) {
  return CreateUsuarioSchema.safeParse(data);
}

export function validateUpdateUsuario(data: unknown) {
  return UpdateUsuarioSchema.safeParse(data);
}

export function validateLogin(data: unknown) {
  return LoginSchema.safeParse(data);
}