const fs = require('fs');
const path = require('path');

async function testBulkImport() {
  try {
    const csvPath = path.join(__dirname, 'teste_sku_simples_novo.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    const formData = new FormData();
    formData.append('file', new Blob([csvContent], { type: 'text/csv' }), 'teste_sku_simples_novo.csv');

    const response = await fetch('http://localhost:3000/api/skus/bulk-import', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Resultado:', result);
  } catch (error) {
    console.error('Erro:', error);
  }
}

testBulkImport();
