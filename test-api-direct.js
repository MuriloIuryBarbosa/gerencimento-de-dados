const fs = require('fs');
const path = require('path');

async function testBulkImportAPI() {
  try {
    // Dados de teste baseados no CSV
    const testData = [
      {
        id: 'TEST001',
        nome: 'Produto de Teste 1',
        familiaCodigo: '9999',
        familiaNome: 'Família Teste',
        unegCodigo: '99',
        unegNome: 'UNEG Teste',
        unidade: 'UN',
        ativo: true,
        estoqueMinimo: 10
      },
      {
        id: 'TEST002',
        nome: 'Produto de Teste 2',
        familiaCodigo: '8888',
        familiaNome: 'Família Teste 2',
        unegCodigo: '88',
        unegNome: 'UNEG Teste 2',
        unidade: 'UN',
        ativo: true,
        estoqueMinimo: 20
      }
    ];

    // Mapeamentos baseados no frontend
    const mappings = [
      { csvColumn: 'CHAVE SKU', dbField: 'id', required: true },
      { csvColumn: 'Nome do Produto', dbField: 'nome', required: false },
      { csvColumn: 'Codigo Familia', dbField: 'familiaCodigo', required: false },
      { csvColumn: 'Familia', dbField: 'familiaNome', required: false },
      { csvColumn: 'Codigo Uneg', dbField: 'unegCodigo', required: false },
      { csvColumn: 'Uneg', dbField: 'unegNome', required: false },
      { csvColumn: 'Unidade', dbField: 'unidade', required: true },
      { csvColumn: 'Ativo', dbField: 'ativo', required: false },
      { csvColumn: 'PE', dbField: 'estoqueMinimo', required: false }
    ];

    console.log('Enviando dados para API...');
    console.log('Dados:', JSON.stringify(testData, null, 2));
    console.log('Mapeamentos:', JSON.stringify(mappings, null, 2));

    const response = await fetch('http://localhost:3000/api/skus/bulk-import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: testData,
        mappings: mappings
      }),
    });

    const result = await response.json();
    console.log('Status da resposta:', response.status);
    console.log('Resultado:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testBulkImportAPI();
