import { prisma } from './lib/prisma';

async function testConnection() {
  try {
    console.log('Testando conexão com o banco de dados...');

    // Testar conexão básica
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Testar uma query simples
    const count = await prisma.sKU.count();
    console.log(`✅ Query executada com sucesso. Total de SKUs: ${count}`);

    // Testar criação de uma família
    const testFamilia = await prisma.familia.create({
      data: {
        codigo: '999999',
        familia: 'TESTE CONEXAO',
        legado: 'Família de teste para verificar conexão'
      }
    });
    console.log(`✅ Família de teste criada: ${testFamilia.familia} (ID: ${testFamilia.id})`);

    // Limpar família de teste
    await prisma.familia.delete({
      where: { id: testFamilia.id }
    });
    console.log('✅ Família de teste removida');

    console.log('🎉 Todos os testes passaram!');

  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    console.error('Detalhes do erro:', JSON.stringify(error, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
