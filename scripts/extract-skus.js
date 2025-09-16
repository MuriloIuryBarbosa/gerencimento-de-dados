#!/usr/bin/env node

/**
 * Script de Extração de Dados - SKUs
 * Extrai todos os dados da tabela skus do MySQL com relacionamentos
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function extractSKUs() {
  console.log('📦 Extraindo dados de SKUs...');

  try {
    // Conectar ao banco
    await prisma.$connect();
    console.log('✅ Conexão estabelecida');

    // Extrair dados com todos os relacionamentos
    const skus = await prisma.sKU.findMany({
      include: {
        cor: true,
        familia: true,
        tamanho: true,
        deposito: true,
        uneg: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Encontrados ${skus.length} SKUs`);

    // Estatísticas
    const stats = {
      total: skus.length,
      ativos: skus.filter(s => s.ativo).length,
      inativos: skus.filter(s => !s.ativo).length,
      comCor: skus.filter(s => s.corId).length,
      semCor: skus.filter(s => !s.corId).length,
      comFamilia: skus.filter(s => s.familiaId).length,
      semFamilia: skus.filter(s => !s.familiaId).length,
      comTamanho: skus.filter(s => s.tamanhoId).length,
      semTamanho: skus.filter(s => !s.tamanhoId).length,
      comDeposito: skus.filter(s => s.depositoId).length,
      semDeposito: skus.filter(s => !s.depositoId).length,
      comUNEG: skus.filter(s => s.unegId).length,
      semUNEG: skus.filter(s => !s.unegId).length,
      familias: [...new Set(skus.filter(s => s.familia).map(s => s.familia.nome))],
      cores: [...new Set(skus.filter(s => s.cor).map(s => s.cor.nome))],
      tamanhos: [...new Set(skus.filter(s => s.tamanho).map(s => s.tamanho.nome))],
      depositos: [...new Set(skus.filter(s => s.deposito).map(s => s.deposito.nome))],
      unegs: [...new Set(skus.filter(s => s.uneg).map(s => s.uneg.nome))]
    };

    // Criar diretório se não existir
    const outputDir = './exports/skus';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Salvar dados completos
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const dataFile = path.join(outputDir, `skus_completos_${timestamp}.json`);
    fs.writeFileSync(dataFile, JSON.stringify(skus, null, 2), 'utf8');

    // Salvar dados simplificados para análise
    const skusSimplificados = skus.map(s => ({
      id: s.id,
      codigo: s.codigo,
      nome: s.nome,
      cor: s.cor?.nome || null,
      familia: s.familia?.nome || null,
      tamanho: s.tamanho?.nome || null,
      deposito: s.deposito?.nome || null,
      uneg: s.uneg?.nome || null,
      ativo: s.ativo,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));

    const simplificadoFile = path.join(outputDir, `skus_simplificado_${timestamp}.json`);
    fs.writeFileSync(simplificadoFile, JSON.stringify(skusSimplificados, null, 2), 'utf8');

    // Salvar estatísticas
    const statsFile = path.join(outputDir, `skus_estatisticas_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf8');

    // Salvar em CSV
    const csvData = skusSimplificados.map(s => ({
      ID: s.id,
      Codigo: s.codigo,
      Nome: s.nome,
      Cor: s.cor || '',
      Familia: s.familia || '',
      Tamanho: s.tamanho || '',
      Deposito: s.deposito || '',
      UNEG: s.uneg || '',
      Ativo: s.ativo ? 'Sim' : 'Não',
      CriadoEm: new Date(s.createdAt).toLocaleString('pt-BR'),
      AtualizadoEm: new Date(s.updatedAt).toLocaleString('pt-BR')
    }));

    const csvHeaders = Object.keys(csvData[0]).join(';');
    const csvRows = csvData.map(row => Object.values(row).map(val => val.toString().replace(/;/g, ',')).join(';'));
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    const csvFile = path.join(outputDir, `skus_${timestamp}.csv`);
    fs.writeFileSync(csvFile, csvContent, 'utf8');

    // Salvar agrupamentos por família
    const porFamilia = {};
    skus.forEach(sku => {
      const familiaNome = sku.familia?.nome || 'Sem Família';
      if (!porFamilia[familiaNome]) {
        porFamilia[familiaNome] = [];
      }
      porFamilia[familiaNome].push({
        id: sku.id,
        codigo: sku.codigo,
        nome: sku.nome,
        cor: sku.cor?.nome,
        tamanho: sku.tamanho?.nome
      });
    });

    const familiaFile = path.join(outputDir, `skus_por_familia_${timestamp}.json`);
    fs.writeFileSync(familiaFile, JSON.stringify(porFamilia, null, 2), 'utf8');

    console.log('\n✅ Extração concluída!');
    console.log(`📁 Arquivos salvos em: ${outputDir}`);
    console.log(`📄 Dados completos: ${dataFile}`);
    console.log(`📄 Dados simplificados: ${simplificadoFile}`);
    console.log(`📄 Estatísticas: ${statsFile}`);
    console.log(`📄 CSV: ${csvFile}`);
    console.log(`📄 Por família: ${familiaFile}`);

    console.log('\n📊 Estatísticas:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Ativos: ${stats.ativos} (${Math.round(stats.ativos/stats.total*100)}%)`);
    console.log(`   Com cor: ${stats.comCor} (${Math.round(stats.comCor/stats.total*100)}%)`);
    console.log(`   Com família: ${stats.comFamilia} (${Math.round(stats.comFamilia/stats.total*100)}%)`);
    console.log(`   Com tamanho: ${stats.comTamanho} (${Math.round(stats.comTamanho/stats.total*100)}%)`);
    console.log(`   Com depósito: ${stats.comDeposito} (${Math.round(stats.comDeposito/stats.total*100)}%)`);
    console.log(`   Com UNEG: ${stats.comUNEG} (${Math.round(stats.comUNEG/stats.total*100)}%)`);

    console.log('\n🏷️  Famílias encontradas:');
    stats.familias.slice(0, 10).forEach(familia => console.log(`   - ${familia}`));
    if (stats.familias.length > 10) {
      console.log(`   ... e mais ${stats.familias.length - 10} famílias`);
    }

  } catch (error) {
    console.error('❌ Erro na extração:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  extractSKUs().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { extractSKUs };