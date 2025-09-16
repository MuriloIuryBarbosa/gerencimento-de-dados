#!/usr/bin/env node

/**
 * Script de Migração de Dados entre Ambientes MySQL
 * Migra dados de produção para desenvolvimento ou vice-versa
 */

const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

class DataMigration {
  constructor() {
    this.stats = {
      migrated: {},
      errors: [],
      skipped: []
    };
    this.config = {
      batchSize: 1000,
      maxRetries: 3,
      timeout: 30000
    };
  }

  async migrateData(sourceConfig, targetConfig, options = {}) {
    console.log('🚀 Iniciando migração de dados...');

    const sourcePrisma = new PrismaClient({
      datasourceUrl: this.buildConnectionString(sourceConfig)
    });

    const targetPrisma = new PrismaClient({
      datasourceUrl: this.buildConnectionString(targetConfig)
    });

    try {
      await sourcePrisma.$connect();
      await targetPrisma.$connect();
      console.log('✅ Conexões estabelecidas');

      // Validar conexões
      await this.validateConnections(sourcePrisma, targetPrisma);

      // Obter lista de tabelas
      const tables = await this.getTablesToMigrate(sourcePrisma, options);

      // Executar migração
      for (const table of tables) {
        await this.migrateTable(sourcePrisma, targetPrisma, table, options);
      }

      // Gerar relatório
      this.generateMigrationReport();

    } catch (error) {
      console.error('❌ Erro na migração:', error.message);
      this.stats.errors.push(error.message);
    } finally {
      await sourcePrisma.$disconnect();
      await targetPrisma.$disconnect();
    }

    return this.stats;
  }

  buildConnectionString(config) {
    return `mysql://${config.user}:${config.password}@${config.host}:${config.port || 3306}/${config.database}`;
  }

  async validateConnections(sourcePrisma, targetPrisma) {
    console.log('\n🔍 Validando conexões...');

    try {
      // Testar conexão source
      await sourcePrisma.$queryRaw`SELECT 1`;
      console.log('✅ Conexão source OK');

      // Testar conexão target
      await targetPrisma.$queryRaw`SELECT 1`;
      console.log('✅ Conexão target OK');

    } catch (error) {
      throw new Error(`Falha na validação de conexões: ${error.message}`);
    }
  }

  async getTablesToMigrate(sourcePrisma, options) {
    console.log('\n📋 Obtendo lista de tabelas...');

    let tables = [
      'usuario', 'empresa', 'usuarioPermissao', 'passwordResetToken',
      'sessaoUsuario', 'cor', 'familia', 'tamanho', 'deposito',
      'uNEG', 'sKU', 'representante', 'cliente', 'fornecedor',
      'transportadora', 'tabelaDinamica'
    ];

    // Filtrar tabelas se especificado
    if (options.tables && options.tables.length > 0) {
      tables = tables.filter(table => options.tables.includes(table));
      console.log(`📋 Migrando apenas tabelas: ${tables.join(', ')}`);
    } else {
      console.log(`📋 Migrando todas as tabelas: ${tables.length} tabelas`);
    }

    // Verificar se tabelas existem
    const existingTables = [];
    for (const table of tables) {
      try {
        await sourcePrisma.$queryRaw`SELECT 1 FROM ${sourcePrisma.$queryRaw(table)} LIMIT 1`;
        existingTables.push(table);
      } catch (error) {
        console.warn(`⚠️  Tabela ${table} não encontrada, pulando...`);
        this.stats.skipped.push(table);
      }
    }

    return existingTables;
  }

  async migrateTable(sourcePrisma, targetPrisma, tableName, options) {
    console.log(`\n🔄 Migrando tabela: ${tableName}`);

    try {
      // Contar registros na origem
      const sourceCount = await sourcePrisma[tableName].count();
      console.log(`📊 Registros na origem: ${sourceCount}`);

      if (sourceCount === 0) {
        console.log(`⏭️  Tabela ${tableName} vazia, pulando...`);
        this.stats.migrated[tableName] = 0;
        return;
      }

      // Limpar tabela de destino se solicitado
      if (options.truncate !== false) {
        await targetPrisma.$executeRaw`TRUNCATE TABLE ${targetPrisma.$queryRaw(tableName)}`;
        console.log(`🗑️  Tabela ${tableName} limpa no destino`);
      }

      // Migrar dados em lotes
      let migrated = 0;
      let offset = 0;

      while (offset < sourceCount) {
        const batch = await sourcePrisma[tableName].findMany({
          skip: offset,
          take: this.config.batchSize,
          orderBy: { id: 'asc' }
        });

        if (batch.length === 0) break;

        // Inserir lote no destino
        await this.insertBatch(targetPrisma, tableName, batch);

        migrated += batch.length;
        offset += batch.length;

        console.log(`   📦 Lote ${Math.floor(offset / this.config.batchSize) + 1}: ${batch.length} registros`);

        // Pequena pausa para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      this.stats.migrated[tableName] = migrated;
      console.log(`✅ Tabela ${tableName} migrada: ${migrated} registros`);

    } catch (error) {
      console.error(`❌ Erro ao migrar ${tableName}:`, error.message);
      this.stats.errors.push(`${tableName}: ${error.message}`);
    }
  }

  async insertBatch(targetPrisma, tableName, batch) {
    // Usar transação para inserção em lote
    await targetPrisma.$transaction(async (tx) => {
      for (const record of batch) {
        // Remover campos de timestamp se necessário
        const cleanRecord = { ...record };
        delete cleanRecord.createdAt;
        delete cleanRecord.updatedAt;

        await tx[tableName].create({ data: cleanRecord });
      }
    });
  }

  generateMigrationReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportFile = `./migration_report_${timestamp}.json`;

    const totalMigrated = Object.values(this.stats.migrated).reduce((sum, val) => sum + val, 0);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTables: Object.keys(this.stats.migrated).length,
        totalRecords: totalMigrated,
        skippedTables: this.stats.skipped.length,
        errorCount: this.stats.errors.length,
        status: this.stats.errors.length === 0 ? 'success' : 'completed_with_errors'
      },
      migrated: this.stats.migrated,
      skipped: this.stats.skipped,
      errors: this.stats.errors
    };

    // Salvar relatório
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

    console.log('\n📊 RELATÓRIO DE MIGRAÇÃO');
    console.log('='.repeat(50));
    console.log(`📋 Tabelas migradas: ${report.summary.totalTables}`);
    console.log(`📊 Registros migrados: ${report.summary.totalRecords}`);
    console.log(`⏭️  Tabelas puladas: ${report.summary.skippedTables}`);
    console.log(`❌ Erros: ${report.summary.errorCount}`);
    console.log(`📄 Relatório salvo em: ${reportFile}`);

    if (report.summary.status === 'success') {
      console.log('\n🎉 Migração concluída com SUCESSO!');
    } else {
      console.log('\n⚠️  Migração concluída com alguns erros!');
      console.log('Verifique o relatório para detalhes.');
    }
  }

  // Método para migração via mysqldump (mais rápido para grandes volumes)
  async migrateViaDump(sourceConfig, targetConfig, options = {}) {
    console.log('🚀 Iniciando migração via dump...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const dumpFile = `./migration_dump_${timestamp}.sql`;

    try {
      // Criar dump da origem
      console.log('📤 Criando dump da origem...');
      const dumpCommand = `mysqldump -h ${sourceConfig.host} -u ${sourceConfig.user} -p${sourceConfig.password} ${sourceConfig.database} > ${dumpFile}`;

      await execAsync(dumpCommand);
      console.log(`✅ Dump criado: ${dumpFile}`);

      // Importar para o destino
      console.log('📥 Importando para o destino...');
      const importCommand = `mysql -h ${targetConfig.host} -u ${targetConfig.user} -p${targetConfig.password} ${targetConfig.database} < ${dumpFile}`;

      await execAsync(importCommand);
      console.log('✅ Dados importados com sucesso');

      // Limpar arquivo de dump
      if (options.keepDump !== true) {
        fs.unlinkSync(dumpFile);
        console.log('🗑️  Arquivo de dump removido');
      }

      return { status: 'success', dumpFile };

    } catch (error) {
      console.error('❌ Erro na migração via dump:', error.message);

      // Limpar arquivo de dump em caso de erro
      if (fs.existsSync(dumpFile)) {
        fs.unlinkSync(dumpFile);
      }

      throw error;
    }
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
🚀 Migração de Dados MySQL

Uso: node migrate-database.js <source-config> <target-config> [opções]

Configurações devem ser arquivos JSON ou variáveis de ambiente:
  - Arquivo JSON: caminho para arquivo com {host, user, password, database, port?}
  - Ambiente: usar DB_SOURCE_* e DB_TARGET_* variáveis

Opções:
  --tables table1,table2    Migrar apenas tabelas específicas
  --no-truncate             Não truncar tabelas de destino
  --use-dump                Usar mysqldump (mais rápido)
  --keep-dump               Manter arquivo de dump após migração
  --help                    Mostrar esta ajuda

Exemplos:
  node migrate-database.js config/source.json config/target.json
  node migrate-database.js config/source.json config/target.json --tables usuario,empresa
  node migrate-database.js config/source.json config/target.json --use-dump
`);
    process.exit(1);
  }

  const sourceConfigPath = args[0];
  const targetConfigPath = args[1];

  // Carregar configurações
  let sourceConfig, targetConfig;

  try {
    if (fs.existsSync(sourceConfigPath)) {
      sourceConfig = JSON.parse(fs.readFileSync(sourceConfigPath, 'utf8'));
    } else {
      // Usar variáveis de ambiente
      sourceConfig = {
        host: process.env.DB_SOURCE_HOST,
        user: process.env.DB_SOURCE_USER,
        password: process.env.DB_SOURCE_PASSWORD,
        database: process.env.DB_SOURCE_DATABASE,
        port: process.env.DB_SOURCE_PORT
      };
    }

    if (fs.existsSync(targetConfigPath)) {
      targetConfig = JSON.parse(fs.readFileSync(targetConfigPath, 'utf8'));
    } else {
      // Usar variáveis de ambiente
      targetConfig = {
        host: process.env.DB_TARGET_HOST,
        user: process.env.DB_TARGET_USER,
        password: process.env.DB_TARGET_PASSWORD,
        database: process.env.DB_TARGET_DATABASE,
        port: process.env.DB_TARGET_PORT
      };
    }
  } catch (error) {
    console.error('❌ Erro ao carregar configurações:', error.message);
    process.exit(1);
  }

  // Processar opções
  const options = {
    truncate: true,
    useDump: false,
    keepDump: false,
    tables: null
  };

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--no-truncate':
        options.truncate = false;
        break;
      case '--use-dump':
        options.useDump = true;
        break;
      case '--keep-dump':
        options.keepDump = true;
        break;
      case '--tables':
        if (i + 1 < args.length) {
          options.tables = args[i + 1].split(',');
          i++; // Pular próximo argumento
        }
        break;
    }
  }

  const migration = new DataMigration();

  try {
    if (options.useDump) {
      await migration.migrateViaDump(sourceConfig, targetConfig, options);
    } else {
      await migration.migrateData(sourceConfig, targetConfig, options);
    }
  } catch (error) {
    console.error('❌ Migração falhou:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { DataMigration };