#!/usr/bin/env node

/**
 * Script de Limpeza e Manutenção do Banco MySQL
 * Executa operações de limpeza, otimização e manutenção
 */

const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const prisma = new PrismaClient();

class DatabaseMaintenance {
  constructor() {
    this.stats = {
      before: {},
      after: {},
      operations: [],
      errors: []
    };
  }

  async runMaintenance(options = {}) {
    console.log('🧹 Iniciando manutenção do banco de dados...');

    try {
      await prisma.$connect();
      console.log('✅ Conexão estabelecida');

      // Estatísticas antes da manutenção
      await this.collectStats('before');

      // Executar operações de manutenção
      if (options.cleanTempData !== false) {
        await this.cleanTemporaryData();
      }

      if (options.optimizeTables !== false) {
        await this.optimizeTables();
      }

      if (options.cleanOldSessions !== false) {
        await this.cleanOldSessions();
      }

      if (options.rebuildIndexes !== false) {
        await this.rebuildIndexes();
      }

      if (options.vacuumDatabase !== false) {
        await this.vacuumDatabase();
      }

      // Estatísticas após a manutenção
      await this.collectStats('after');

      // Gerar relatório
      this.generateReport();

    } catch (error) {
      console.error('❌ Erro na manutenção:', error.message);
      this.stats.errors.push(error.message);
    } finally {
      await prisma.$disconnect();
    }

    return this.stats;
  }

  async collectStats(stage) {
    console.log(`📊 Coletando estatísticas ${stage}...`);

    try {
      // Contagem de registros por tabela
      const tables = [
        'usuario', 'empresa', 'usuarioPermissao', 'passwordResetToken',
        'sessaoUsuario', 'cor', 'familia', 'tamanho', 'deposito',
        'uNEG', 'sKU', 'representante', 'cliente', 'fornecedor',
        'transportadora', 'tabelaDinamica'
      ];

      this.stats[stage] = {};

      for (const table of tables) {
        try {
          const count = await prisma[table].count();
          this.stats[stage][table] = count;
        } catch (error) {
          console.warn(`⚠️  Erro ao contar ${table}:`, error.message);
          this.stats[stage][table] = 'error';
        }
      }

      // Estatísticas adicionais
      this.stats[stage].totalRecords = Object.values(this.stats[stage])
        .filter(val => typeof val === 'number')
        .reduce((sum, val) => sum + val, 0);

    } catch (error) {
      console.error(`❌ Erro ao coletar estatísticas ${stage}:`, error.message);
    }
  }

  async cleanTemporaryData() {
    console.log('\n🗑️  Limpando dados temporários...');

    try {
      // Limpar tokens de reset de senha expirados (mais de 24 horas)
      const expiredTokens = await prisma.passwordResetToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 horas atrás
          }
        }
      });

      this.stats.operations.push({
        operation: 'clean_expired_tokens',
        deleted: expiredTokens.count,
        description: 'Tokens de reset de senha expirados removidos'
      });

      // Limpar sessões antigas (mais de 30 dias)
      const oldSessions = await prisma.sessaoUsuario.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
          }
        }
      });

      this.stats.operations.push({
        operation: 'clean_old_sessions',
        deleted: oldSessions.count,
        description: 'Sessões antigas removidas'
      });

      console.log(`✅ ${expiredTokens.count} tokens expirados removidos`);
      console.log(`✅ ${oldSessions.count} sessões antigas removidas`);

    } catch (error) {
      console.error('❌ Erro na limpeza de dados temporários:', error.message);
      this.stats.errors.push(`clean_temp_data: ${error.message}`);
    }
  }

  async optimizeTables() {
    console.log('\n🔧 Otimizando tabelas...');

    try {
      // Lista de tabelas para otimizar
      const tables = [
        'usuarios', 'empresas', 'usuario_permissoes', 'password_reset_tokens',
        'sessao_usuarios', 'cores', 'familia', 'tamanhos', 'depositos',
        'unegs', 'skus', 'representantes', 'clientes', 'fornecedores',
        'transportadoras', 'tabelas_dinamicas'
      ];

      for (const table of tables) {
        try {
          // Executar OPTIMIZE TABLE via raw query
          await prisma.$executeRaw`OPTIMIZE TABLE ${prisma.$queryRaw(table)}`;

          this.stats.operations.push({
            operation: 'optimize_table',
            table: table,
            description: `Tabela ${table} otimizada`
          });

        } catch (error) {
          console.warn(`⚠️  Erro ao otimizar ${table}:`, error.message);
        }
      }

      console.log('✅ Tabelas otimizadas');

    } catch (error) {
      console.error('❌ Erro na otimização de tabelas:', error.message);
      this.stats.errors.push(`optimize_tables: ${error.message}`);
    }
  }

  async cleanOldSessions() {
    console.log('\n🧽 Limpando sessões antigas...');

    try {
      // Já foi feito em cleanTemporaryData, mas podemos fazer limpeza mais específica
      const veryOldSessions = await prisma.sessaoUsuario.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 dias atrás
          }
        }
      });

      this.stats.operations.push({
        operation: 'clean_very_old_sessions',
        deleted: veryOldSessions.count,
        description: 'Sessões muito antigas removidas (90+ dias)'
      });

      console.log(`✅ ${veryOldSessions.count} sessões muito antigas removidas`);

    } catch (error) {
      console.error('❌ Erro na limpeza de sessões:', error.message);
      this.stats.errors.push(`clean_old_sessions: ${error.message}`);
    }
  }

  async rebuildIndexes() {
    console.log('\n🔨 Reconstruindo índices...');

    try {
      // Executar ANALYZE TABLE para atualizar estatísticas dos índices
      const tables = [
        'usuarios', 'empresas', 'usuario_permissoes', 'skus'
      ];

      for (const table of tables) {
        try {
          await prisma.$executeRaw`ANALYZE TABLE ${prisma.$queryRaw(table)}`;

          this.stats.operations.push({
            operation: 'analyze_table',
            table: table,
            description: `Estatísticas de índices atualizadas para ${table}`
          });

        } catch (error) {
          console.warn(`⚠️  Erro ao analisar ${table}:`, error.message);
        }
      }

      console.log('✅ Índices analisados e atualizados');

    } catch (error) {
      console.error('❌ Erro na reconstrução de índices:', error.message);
      this.stats.errors.push(`rebuild_indexes: ${error.message}`);
    }
  }

  async vacuumDatabase() {
    console.log('\n🧹 Executando limpeza geral do banco...');

    try {
      // Para MySQL, podemos executar algumas operações de manutenção
      const maintenanceQueries = [
        'FLUSH TABLES',
        'RESET QUERY CACHE',
        'FLUSH LOGS'
      ];

      for (const query of maintenanceQueries) {
        try {
          await prisma.$executeRawUnsafe(query);

          this.stats.operations.push({
            operation: 'maintenance_query',
            query: query,
            description: `Comando de manutenção executado: ${query}`
          });

        } catch (error) {
          console.warn(`⚠️  Erro no comando ${query}:`, error.message);
        }
      }

      console.log('✅ Manutenção geral executada');

    } catch (error) {
      console.error('❌ Erro na limpeza geral:', error.message);
      this.stats.errors.push(`vacuum_database: ${error.message}`);
    }
  }

  generateReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportFile = `./maintenance_report_${timestamp}.json`;

    const report = {
      timestamp: new Date().toISOString(),
      maintenance_summary: {
        operations_completed: this.stats.operations.length,
        errors_count: this.stats.errors.length,
        tables_optimized: this.stats.operations.filter(op => op.operation === 'optimize_table').length,
        records_cleaned: this.stats.operations
          .filter(op => op.deleted !== undefined)
          .reduce((sum, op) => sum + op.deleted, 0)
      },
      statistics: {
        before: this.stats.before,
        after: this.stats.after,
        difference: this.calculateDifference()
      },
      operations: this.stats.operations,
      errors: this.stats.errors,
      status: this.stats.errors.length === 0 ? 'success' : 'completed_with_errors'
    };

    // Salvar relatório
    const fs = require('fs');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

    console.log('\n📊 RELATÓRIO DE MANUTENÇÃO');
    console.log('='.repeat(50));
    console.log(`📈 Operações realizadas: ${report.maintenance_summary.operations_completed}`);
    console.log(`🧹 Registros removidos: ${report.maintenance_summary.records_cleaned}`);
    console.log(`🔧 Tabelas otimizadas: ${report.maintenance_summary.tables_optimized}`);
    console.log(`🚨 Erros encontrados: ${report.maintenance_summary.errors_count}`);
    console.log(`📄 Relatório salvo em: ${reportFile}`);

    if (report.status === 'success') {
      console.log('\n🎉 Manutenção concluída com SUCESSO!');
    } else {
      console.log('\n⚠️  Manutenção concluída com alguns erros!');
      console.log('Verifique o relatório para detalhes.');
    }

    // Mostrar diferenças
    console.log('\n📊 DIFERENÇAS APÓS MANUTENÇÃO:');
    const diff = this.calculateDifference();
    Object.entries(diff).forEach(([table, difference]) => {
      if (difference !== 0) {
        console.log(`   ${table}: ${difference > 0 ? '+' : ''}${difference}`);
      }
    });
  }

  calculateDifference() {
    const diff = {};

    for (const table in this.stats.before) {
      const before = this.stats.before[table];
      const after = this.stats.after[table];

      if (typeof before === 'number' && typeof after === 'number') {
        diff[table] = after - before;
      } else {
        diff[table] = 'N/A';
      }
    }

    return diff;
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);

  // Opções padrão
  const options = {
    cleanTempData: true,
    optimizeTables: true,
    cleanOldSessions: true,
    rebuildIndexes: true,
    vacuumDatabase: true
  };

  // Processar argumentos
  args.forEach(arg => {
    switch (arg) {
      case '--no-clean':
        options.cleanTempData = false;
        break;
      case '--no-optimize':
        options.optimizeTables = false;
        break;
      case '--no-sessions':
        options.cleanOldSessions = false;
        break;
      case '--no-indexes':
        options.rebuildIndexes = false;
        break;
      case '--no-vacuum':
        options.vacuumDatabase = false;
        break;
      case '--help':
        console.log(`
🧹 Manutenção do Banco de Dados MySQL

Uso: node maintenance-database.js [opções]

Opções:
  --no-clean      Não limpar dados temporários
  --no-optimize   Não otimizar tabelas
  --no-sessions   Não limpar sessões antigas
  --no-indexes    Não reconstruir índices
  --no-vacuum     Não executar limpeza geral
  --help          Mostrar esta ajuda

Exemplos:
  node maintenance-database.js                    # Manutenção completa
  node maintenance-database.js --no-vacuum       # Manutenção sem vacuum
  node maintenance-database.js --no-clean --no-sessions  # Apenas otimização
`);
        process.exit(0);
    }
  });

  const maintenance = new DatabaseMaintenance();
  await maintenance.runMaintenance(options);
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { DatabaseMaintenance };