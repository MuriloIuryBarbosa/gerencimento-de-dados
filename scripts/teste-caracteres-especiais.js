#!/usr/bin/env node

/**
 * Script de teste para verificar suporte a caracteres especiais
 * Testa a importação de dados com acentos e caracteres especiais
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testando suporte a caracteres especiais...\n');

// Verificar se o arquivo de teste existe
const testFilePath = path.join(__dirname, '..', 'public', 'exemplos', 'teste-caracteres-especiais.csv');

if (!fs.existsSync(testFilePath)) {
  console.error('❌ Arquivo de teste não encontrado:', testFilePath);
  process.exit(1);
}

// Ler o conteúdo do arquivo
const content = fs.readFileSync(testFilePath, 'utf8');
console.log('📄 Conteúdo do arquivo de teste:');
console.log(content);
console.log('\n' + '='.repeat(50) + '\n');

// Verificar caracteres especiais
const specialChars = ['ç', 'ã', 'é', 'ô', 'í', 'ú', 'à', 'â', 'ê', 'õ'];
let foundChars = [];

specialChars.forEach(char => {
  if (content.includes(char)) {
    foundChars.push(char);
  }
});

if (foundChars.length > 0) {
  console.log('✅ Caracteres especiais encontrados no arquivo:', foundChars.join(', '));
} else {
  console.log('⚠️  Nenhum caractere especial encontrado no arquivo de teste');
}

// Testar conexão com banco de dados
console.log('\n🔌 Testando conexão com banco de dados...');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabase() {
  try {
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');

    // Verificar se há registros de teste
    const testRecords = await prisma.sKU.findMany({
      where: {
        id: {
          in: ['TEST001', 'TEST002', 'TEST003']
        }
      }
    });

    if (testRecords.length > 0) {
      console.log('📊 Registros de teste encontrados:');
      testRecords.forEach(record => {
        console.log(`  - ${record.id}: ${record.nome} (${record.descricao})`);
      });

      // Verificar se caracteres especiais foram preservados
      const recordsWithSpecialChars = testRecords.filter(record =>
        specialChars.some(char => record.nome?.includes(char) || record.descricao?.includes(char))
      );

      if (recordsWithSpecialChars.length > 0) {
        console.log('✅ Caracteres especiais preservados no banco de dados!');
      } else {
        console.log('⚠️  Nenhum registro com caracteres especiais encontrado no banco');
      }
    } else {
      console.log('ℹ️  Nenhum registro de teste encontrado no banco');
      console.log('💡 Execute o upload do arquivo teste-caracteres-especiais.csv para testar');
    }

  } catch (error) {
    console.error('❌ Erro ao conectar com banco:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase().then(() => {
  console.log('\n🏁 Teste concluído!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Acesse a página de upload de SKUs');
  console.log('2. Faça upload do arquivo teste-caracteres-especiais.csv');
  console.log('3. Execute este script novamente para verificar se os dados foram salvos corretamente');
});
