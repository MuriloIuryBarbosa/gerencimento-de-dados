// Arquivo de teste para verificar tipos do Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    // Testar acesso aos modelos
    const permissoes = await prisma.permissao.findMany();
    const usuariosPermissoes = await prisma.usuarioPermissao.findMany();

    console.log('Permissões encontradas:', permissoes.length);
    console.log('Usuários permissões encontradas:', usuariosPermissoes.length);
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
