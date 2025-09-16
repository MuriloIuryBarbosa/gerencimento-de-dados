#!/usr/bin/env node

/**
 * Script para criar papéis e permissões padrão do sistema
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_ROLES = [
  {
    nome: 'Super Administrador',
    descricao: 'Acesso total ao sistema',
    isSystem: true,
    permissoes: [
      // Acesso a todos os módulos
      { permissao: 'admin', recurso: 'todos', valor: null }
    ]
  },
  {
    nome: 'Administrador',
    descricao: 'Gerenciamento geral do sistema',
    isSystem: true,
    permissoes: [
      // Dashboard
      { permissao: 'read', recurso: 'menu', valor: 'dashboard' },
      { permissao: 'read', recurso: 'page', valor: 'dashboard' },

      // Cadastro - Acesso total
      { permissao: 'read', recurso: 'menu', valor: 'cadastro' },
      { permissao: 'write', recurso: 'menu', valor: 'cadastro' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/skus' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/skus' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/cores' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/cores' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/familias' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/familias' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/tamanhos' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/tamanhos' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/depositos' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/depositos' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/unegs' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/unegs' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/empresas' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/empresas' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/representantes' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/representantes' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/clientes' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/clientes' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/fornecedores' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/fornecedores' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/transportadoras' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/transportadoras' },

      // Executivo - Acesso total
      { permissao: 'read', recurso: 'menu', valor: 'executivo' },
      { permissao: 'write', recurso: 'menu', valor: 'executivo' },

      // Cubagem - Acesso total
      { permissao: 'read', recurso: 'menu', valor: 'cubagem' },
      { permissao: 'write', recurso: 'menu', valor: 'cubagem' },

      // Financeiro - Acesso total
      { permissao: 'read', recurso: 'menu', valor: 'financeiro' },
      { permissao: 'write', recurso: 'menu', valor: 'financeiro' },

      // Planejamento - Acesso total
      { permissao: 'read', recurso: 'menu', valor: 'planejamento' },
      { permissao: 'write', recurso: 'menu', valor: 'planejamento' },

      // Administração - Acesso limitado
      { permissao: 'read', recurso: 'menu', valor: 'admin' },
      { permissao: 'read', recurso: 'submenu', valor: 'admin/dashboard' },
      { permissao: 'read', recurso: 'submenu', valor: 'admin/usuarios' },
      { permissao: 'write', recurso: 'submenu', valor: 'admin/usuarios' }
    ]
  },
  {
    nome: 'Gerente de Cadastro',
    descricao: 'Gerencia cadastros de produtos e entidades',
    isSystem: false,
    permissoes: [
      // Dashboard
      { permissao: 'read', recurso: 'menu', valor: 'dashboard' },
      { permissao: 'read', recurso: 'page', valor: 'dashboard' },

      // Cadastro - Acesso total
      { permissao: 'read', recurso: 'menu', valor: 'cadastro' },
      { permissao: 'write', recurso: 'menu', valor: 'cadastro' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/skus' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/skus' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/cores' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/cores' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/familias' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/familias' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/tamanhos' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/tamanhos' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/depositos' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/depositos' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/unegs' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/unegs' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/empresas' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/empresas' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/representantes' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/representantes' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/clientes' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/clientes' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/fornecedores' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/fornecedores' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/transportadoras' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/transportadoras' },

      // Executivo - Apenas leitura
      { permissao: 'read', recurso: 'menu', valor: 'executivo' },

      // Cubagem - Apenas leitura
      { permissao: 'read', recurso: 'menu', valor: 'cubagem' }
    ]
  },
  {
    nome: 'Especialista em Cores',
    descricao: 'Gerencia apenas cadastros de cores',
    isSystem: false,
    permissoes: [
      // Dashboard
      { permissao: 'read', recurso: 'menu', valor: 'dashboard' },
      { permissao: 'read', recurso: 'page', valor: 'dashboard' },

      // Cadastro - Apenas cores
      { permissao: 'read', recurso: 'menu', valor: 'cadastro' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/cores' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/cores' }
    ]
  },
  {
    nome: 'Especialista em Famílias',
    descricao: 'Gerencia apenas cadastros de famílias',
    isSystem: false,
    permissoes: [
      // Dashboard
      { permissao: 'read', recurso: 'menu', valor: 'dashboard' },
      { permissao: 'read', recurso: 'page', valor: 'dashboard' },

      // Cadastro - Apenas famílias
      { permissao: 'read', recurso: 'menu', valor: 'cadastro' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/familias' },
      { permissao: 'write', recurso: 'submenu', valor: 'cadastro/familias' }
    ]
  },
  {
    nome: 'Usuário Básico',
    descricao: 'Acesso básico de leitura',
    isSystem: false,
    permissoes: [
      // Dashboard
      { permissao: 'read', recurso: 'menu', valor: 'dashboard' },
      { permissao: 'read', recurso: 'page', valor: 'dashboard' },

      // Cadastro - Apenas leitura
      { permissao: 'read', recurso: 'menu', valor: 'cadastro' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/skus' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/cores' },
      { permissao: 'read', recurso: 'submenu', valor: 'cadastro/familias' },

      // Executivo - Apenas leitura
      { permissao: 'read', recurso: 'menu', valor: 'executivo' }
    ]
  }
];

async function createDefaultRoles() {
  console.log('🚀 Criando papéis e permissões padrão...');

  try {
    await prisma.$connect();
    console.log('✅ Conexão estabelecida');

    for (const roleData of DEFAULT_ROLES) {
      console.log(`\n📝 Criando papel: ${roleData.nome}`);

      // Criar papel
      const papel = await prisma.papel.create({
        data: {
          nome: roleData.nome,
          descricao: roleData.descricao,
          isSystem: roleData.isSystem
        }
      });

      console.log(`✅ Papel criado com ID: ${papel.id}`);

      // Criar permissões do papel
      for (const permissao of roleData.permissoes) {
        await prisma.papelPermissao.create({
          data: {
            papelId: papel.id,
            permissao: permissao.permissao,
            recurso: permissao.recurso,
            valor: permissao.valor
          }
        });
      }

      console.log(`✅ ${roleData.permissoes.length} permissões criadas para ${roleData.nome}`);
    }

    console.log('\n🎉 Todos os papéis e permissões foram criados com sucesso!');

    // Listar papéis criados
    const papeisCriados = await prisma.papel.findMany({
      include: {
        _count: {
          select: { permissoes: true, usuarios: true }
        }
      }
    });

    console.log('\n📊 Resumo dos papéis criados:');
    papeisCriados.forEach(papel => {
      console.log(`   ${papel.nome}: ${papel._count.permissoes} permissões, ${papel._count.usuarios} usuários`);
    });

  } catch (error) {
    console.error('❌ Erro ao criar papéis:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createDefaultRoles().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { createDefaultRoles, DEFAULT_ROLES };