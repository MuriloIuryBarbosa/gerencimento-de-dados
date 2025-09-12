const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testando conexão com o banco de dados...');

    // Test connection
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Check if tables exist
    const users = await prisma.usuario.findMany();
    console.log(`📊 Encontrados ${users.length} usuários na tabela`);

    if (users.length === 0) {
      console.log('⚠️  Nenhum usuário encontrado. Execute o seed script.');
    } else {
      console.log('Usuários existentes:');
      users.forEach(user => {
        console.log(`- ${user.nome} (${user.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
