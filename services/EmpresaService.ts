import { prisma } from '@/lib/prisma';
import { Empresa, CreateUsuarioDTO } from '@/models';

export class EmpresaService {
  // Buscar todas as empresas
  static async findAll(): Promise<Empresa[]> {
    return prisma.empresa.findMany({
      where: { ativo: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Buscar empresa por ID
  static async findById(id: number): Promise<Empresa | null> {
    return prisma.empresa.findUnique({
      where: { id }
    });
  }

  // Buscar empresa padrão ou criar uma
  static async getOrCreateDefault(): Promise<Empresa> {
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

    return empresa;
  }

  // Criar nova empresa
  static async create(data: {
    nome: string;
    cnpj?: string;
    endereco?: string;
    telefone?: string;
    email?: string;
  }): Promise<Empresa> {
    return prisma.empresa.create({
      data: {
        nome: data.nome,
        cnpj: data.cnpj,
        endereco: data.endereco,
        telefone: data.telefone,
        email: data.email,
        ativo: true
      }
    });
  }

  // Atualizar empresa
  static async update(id: number, data: Partial<{
    nome: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    ativo: boolean;
  }>): Promise<Empresa> {
    return prisma.empresa.update({
      where: { id },
      data
    });
  }

  // Deletar empresa (soft delete)
  static async delete(id: number): Promise<void> {
    await prisma.empresa.update({
      where: { id },
      data: { ativo: false }
    });
  }
}