const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Verificando usuários no banco MySQL...');

    const users = await prisma.usuario.findMany({
      include: {
        empresa: true,
        permissoes: true
      }
    });

    console.log(`Encontrados ${users.length} usuários:`);
    users.forEach(user => {
      console.log(`- ID: ${user.id}`);
      console.log(`  Nome: ${user.nome}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Admin: ${user.isAdmin}`);
      console.log(`  Super Admin: ${user.isSuperAdmin}`);
      console.log(`  Ativo: ${user.ativo}`);
      console.log(`  Empresa: ${user.empresa?.nome || 'N/A'}`);
      console.log(`  Permissões: ${user.permissoes.length}`);
      console.log('---');
    });

    // Verificar empresas
    const empresas = await prisma.empresa.findMany();
    console.log(`\nEncontradas ${empresas.length} empresas:`);
    empresas.forEach(empresa => {
      console.log(`- ${empresa.nome} (${empresa.id})`);
    });

  } catch (error) {
    console.error('Erro ao verificar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
