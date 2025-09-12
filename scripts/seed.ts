import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar empresa padrão
    const empresa = await prisma.empresa.upsert({
      where: { nome: 'Empresa Padrão' },
      update: {},
      create: {
        nome: 'Empresa Padrão',
        cnpj: '00.000.000/0001-00',
        endereco: 'Rua Principal, 123',
        telefone: '(11) 99999-9999',
        email: 'contato@empresa.com',
        ativo: true
      }
    });

    console.log('✅ Empresa criada:', empresa.nome);

    // Criar Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const superAdmin = await prisma.usuario.upsert({
      where: { email: 'admin@empresa.com' },
      update: {},
      create: {
        nome: 'Super Administrador',
        email: 'admin@empresa.com',
        senha: hashedPassword,
        cargo: 'Super Admin',
        departamento: 'TI',
        empresaId: empresa.id,
        isAdmin: true,
        isSuperAdmin: true,
        ativo: true
      }
    });

    console.log('✅ Super Admin criado:', superAdmin.email);

    // Nota: Permissões serão implementadas posteriormente
    console.log('ℹ️  Permissões serão configuradas posteriormente');

    // Criar usuário de teste
    const testUserPassword = await bcrypt.hash('teste123', 10);

    const testUser = await prisma.usuario.upsert({
      where: { email: 'teste@empresa.com' },
      update: {},
      create: {
        nome: 'Usuário de Teste',
        email: 'teste@empresa.com',
        senha: testUserPassword,
        cargo: 'Analista',
        departamento: 'Vendas',
        empresaId: empresa.id,
        isAdmin: false,
        isSuperAdmin: false,
        ativo: true
      }
    });

    console.log('✅ Usuário de teste criado:', testUser.email);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('Super Admin:');
    console.log('  Email: admin@empresa.com');
    console.log('  Senha: admin123');
    console.log('\nUsuário Teste:');
    console.log('  Email: teste@empresa.com');
    console.log('  Senha: teste123');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
