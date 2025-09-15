const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');

    // Testar uma query simples
    const userCount = await prisma.usuario.count();
    console.log(`📊 Total de usuários: ${userCount}`);

    await prisma.$disconnect();
    console.log('✅ Conexão fechada com sucesso');
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  }
}

testConnection();
