const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Criando usuários de teste...');

    // Criar empresa padrão se não existir
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
      console.log('Empresa padrão criada:', empresa.nome);
    }

    // Hash das senhas
    const adminPassword = await bcrypt.hash('admin123', 10);
    const testPassword = await bcrypt.hash('teste123', 10);

    // Criar usuário admin
    const adminUser = await prisma.usuario.upsert({
      where: { email: 'admin@empresa.com' },
      update: {},
      create: {
        nome: 'Administrador',
        email: 'admin@empresa.com',
        senha: adminPassword,
        cargo: 'Administrador',
        departamento: 'TI',
        empresaId: empresa.id,
        isAdmin: true,
        isSuperAdmin: true,
        ativo: true
      }
    });

    // Criar usuário de teste
    const testUser = await prisma.usuario.upsert({
      where: { email: 'teste@empresa.com' },
      update: {},
      create: {
        nome: 'Usuário Teste',
        email: 'teste@empresa.com',
        senha: testPassword,
        cargo: 'Analista',
        departamento: 'Vendas',
        empresaId: empresa.id,
        isAdmin: false,
        isSuperAdmin: false,
        ativo: true
      }
    });

    console.log('Usuários criados:');
    console.log('- Admin:', adminUser.email);
    console.log('- Teste:', testUser.email);

    // Criar permissões básicas para o admin
    await prisma.usuarioPermissao.upsert({
      where: {
        usuarioId_permissao_recurso: {
          usuarioId: adminUser.id,
          permissao: 'admin',
          recurso: 'todos'
        }
      },
      update: {},
      create: {
        usuarioId: adminUser.id,
        permissao: 'admin',
        recurso: 'todos'
      }
    });

    console.log('Permissões criadas para admin');

  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
