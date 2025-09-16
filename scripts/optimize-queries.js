#!/usr/bin/env node

/**
 * Script de Análise de Performance e Otimização de Queries MySQL
 * Analisa queries lentas e sugere otimizações
 */

const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const prisma = new PrismaClient();

class QueryOptimizer {
  constructor() {
    this.analysis = {
      slowQueries: [],
      tableStats: {},
      indexRecommendations: [],
      queryPatterns: {},
      optimizationSuggestions: []
    };
  }

  async analyzePerformance(options = {}) {
    console.log('🔍 Iniciando análise de performance...');

    try {
      await prisma.$connect();
      console.log('✅ Conexão estabelecida');

      // Executar análises
      await this.analyzeSlowQueries(options);
      await this.analyzeTableStatistics();
      await this.analyzeIndexes();
      await this.analyzeQueryPatterns();
      await this.generateOptimizationSuggestions();

      // Gerar relatório
      this.generateOptimizationReport();

    } catch (error) {
      console.error('❌ Erro na análise:', error.message);
    } finally {
      await prisma.$disconnect();
    }

    return this.analysis;
  }

  async analyzeSlowQueries(options) {
    console.log('\n🐌 Analisando queries lentas...');

    try {
      // Buscar queries lentas do log ou performance schema
      const slowQueries = await prisma.$queryRaw`
        SELECT
          sql_text,
          exec_count,
          avg_timer_wait / 1000000000 as avg_time_sec,
          max_timer_wait / 1000000000 as max_time_sec,
          sum_timer_wait / 1000000000 as total_time_sec,
          digest_text
        FROM performance_schema.events_statements_summary_by_digest
        WHERE avg_timer_wait > 1000000000  -- Mais de 1 segundo
        AND last_seen > DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY avg_timer_wait DESC
        LIMIT 20
      `;

      this.analysis.slowQueries = slowQueries.map(query => ({
        sql: query.sql_text || query.digest_text,
        executions: query.exec_count,
        avgTime: query.avg_time_sec,
        maxTime: query.max_time_sec,
        totalTime: query.total_time_sec,
        impact: this.calculateQueryImpact(query)
      }));

      console.log(`📊 Encontradas ${slowQueries.length} queries lentas`);

      // Mostrar top 5
      console.log('\n🏆 Top 5 queries mais lentas:');
      this.analysis.slowQueries.slice(0, 5).forEach((query, index) => {
        console.log(`   ${index + 1}. ${query.avgTime.toFixed(2)}s médio - ${query.executions} execuções`);
        console.log(`      Impacto: ${query.impact}`);
      });

    } catch (error) {
      console.error('❌ Erro ao analisar queries lentas:', error.message);
      console.log('💡 Dica: Verifique se performance_schema está habilitado');
    }
  }

  calculateQueryImpact(query) {
    const avgTime = query.avg_time_sec;
    const executions = query.exec_count;

    if (avgTime > 10 && executions > 1000) return 'CRÍTICO';
    if (avgTime > 5 && executions > 500) return 'ALTO';
    if (avgTime > 2 && executions > 100) return 'MÉDIO';
    if (avgTime > 1) return 'BAIXO';
    return 'MINIMO';
  }

  async analyzeTableStatistics() {
    console.log('\n📊 Analisando estatísticas das tabelas...');

    try {
      const tables = await prisma.$queryRaw`
        SELECT
          table_name,
          table_rows,
          data_length / 1024 / 1024 as data_size_mb,
          index_length / 1024 / 1024 as index_size_mb,
          (data_length + index_length) / 1024 / 1024 as total_size_mb,
          auto_increment,
          create_time,
          update_time
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        ORDER BY total_size_mb DESC
      `;

      this.analysis.tableStats = {};

      tables.forEach(table => {
        this.analysis.tableStats[table.table_name] = {
          rows: table.table_rows,
          dataSize: table.data_size_mb,
          indexSize: table.index_size_mb,
          totalSize: table.total_size_mb,
          autoIncrement: table.auto_increment,
          created: table.create_time,
          updated: table.update_time
        };
      });

      console.log(`📋 Analisadas ${tables.length} tabelas`);

      // Identificar tabelas grandes
      const largeTables = tables.filter(t => t.total_size_mb > 100);
      if (largeTables.length > 0) {
        console.log('\n📏 Tabelas grandes (>100MB):');
        largeTables.forEach(table => {
          console.log(`   ${table.table_name}: ${table.total_size_mb.toFixed(2)}MB`);
        });
      }

    } catch (error) {
      console.error('❌ Erro ao analisar estatísticas das tabelas:', error.message);
    }
  }

  async analyzeIndexes() {
    console.log('\n🔍 Analisando índices...');

    try {
      // Obter informações de índices
      const indexes = await prisma.$queryRaw`
        SELECT
          table_name,
          index_name,
          column_name,
          seq_in_index,
          cardinality,
          pages,
          filter_condition
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
        ORDER BY table_name, index_name, seq_in_index
      `;

      // Agrupar por tabela e índice
      const indexMap = {};
      indexes.forEach(idx => {
        if (!indexMap[idx.table_name]) {
          indexMap[idx.table_name] = {};
        }
        if (!indexMap[idx.table_name][idx.index_name]) {
          indexMap[idx.table_name][idx.index_name] = {
            columns: [],
            cardinality: idx.cardinality,
            pages: idx.pages,
            filterCondition: idx.filter_condition
          };
        }
        indexMap[idx.table_name][idx.index_name].columns.push(idx.column_name);
      });

      // Analisar índices
      for (const [tableName, tableIndexes] of Object.entries(indexMap)) {
        for (const [indexName, indexInfo] of Object.entries(tableIndexes)) {
          // Pular PRIMARY KEY
          if (indexName === 'PRIMARY') continue;

          // Verificar cardinalidade baixa
          if (indexInfo.cardinality && indexInfo.cardinality < 100) {
            this.analysis.indexRecommendations.push({
              table: tableName,
              index: indexName,
              type: 'LOW_CARDINALITY',
              message: `Índice com baixa cardinalidade (${indexInfo.cardinality})`,
              suggestion: 'Considerar remover ou combinar com outros índices'
            });
          }

          // Verificar índices não utilizados (se disponível)
          // Nota: Requer monitoramento adicional
        }
      }

      console.log(`🔍 Analisados índices de ${Object.keys(indexMap).length} tabelas`);

      // Mostrar recomendações
      if (this.analysis.indexRecommendations.length > 0) {
        console.log('\n💡 Recomendações de índices:');
        this.analysis.indexRecommendations.forEach(rec => {
          console.log(`   ${rec.table}.${rec.index}: ${rec.message}`);
        });
      }

    } catch (error) {
      console.error('❌ Erro ao analisar índices:', error.message);
    }
  }

  async analyzeQueryPatterns() {
    console.log('\n🔍 Analisando padrões de queries...');

    try {
      // Analisar padrões comuns de queries problemáticas
      const patterns = [
        {
          name: 'SELECT sem WHERE',
          pattern: /^SELECT.*FROM\s+\w+$/i,
          suggestion: 'Adicionar cláusula WHERE ou LIMIT para reduzir resultado'
        },
        {
          name: 'JOIN sem índices',
          pattern: /JOIN\s+\w+\s+ON\s+[^=]*=[^=]*/i,
          suggestion: 'Verificar se colunas de JOIN estão indexadas'
        },
        {
          name: 'LIKE começando com %',
          pattern: /LIKE\s+['"]%[^%]*['"]/i,
          suggestion: 'Evitar LIKE com % no início - não usa índice'
        },
        {
          name: 'ORDER BY sem LIMIT',
          pattern: /ORDER BY.*$/i,
          suggestion: 'Adicionar LIMIT quando usar ORDER BY em tabelas grandes'
        }
      ];

      // Buscar queries recentes para análise
      const recentQueries = await prisma.$queryRaw`
        SELECT sql_text
        FROM performance_schema.events_statements_history
        WHERE sql_text IS NOT NULL
        AND sql_text NOT LIKE 'SELECT 1%'
        ORDER BY timer_start DESC
        LIMIT 100
      `;

      this.analysis.queryPatterns = {};

      patterns.forEach(pattern => {
        const matches = recentQueries.filter(query =>
          pattern.pattern.test(query.sql_text)
        );

        if (matches.length > 0) {
          this.analysis.queryPatterns[pattern.name] = {
            count: matches.length,
            suggestion: pattern.suggestion,
            examples: matches.slice(0, 3).map(q => q.sql_text)
          };
        }
      });

      console.log(`🔍 Analisados ${recentQueries.length} queries recentes`);

      // Mostrar padrões encontrados
      Object.entries(this.analysis.queryPatterns).forEach(([pattern, data]) => {
        console.log(`   ${pattern}: ${data.count} ocorrências`);
      });

    } catch (error) {
      console.error('❌ Erro ao analisar padrões de queries:', error.message);
    }
  }

  async generateOptimizationSuggestions() {
    console.log('\n💡 Gerando sugestões de otimização...');

    // Sugestões baseadas na análise
    this.analysis.optimizationSuggestions = [];

    // Sugestões para queries lentas
    if (this.analysis.slowQueries.length > 0) {
      this.analysis.optimizationSuggestions.push({
        category: 'QUERIES_LENTAS',
        priority: 'HIGH',
        title: 'Otimizar queries lentas',
        description: `${this.analysis.slowQueries.length} queries com tempo médio > 1s`,
        actions: [
          'Adicionar índices apropriados',
          'Revisar estrutura das queries',
          'Considerar cache para queries frequentes',
          'Usar EXPLAIN para analisar plano de execução'
        ]
      });
    }

    // Sugestões para tabelas grandes
    const largeTables = Object.entries(this.analysis.tableStats)
      .filter(([_, stats]) => stats.totalSize > 100)
      .map(([table, stats]) => ({ table, size: stats.totalSize }));

    if (largeTables.length > 0) {
      this.analysis.optimizationSuggestions.push({
        category: 'TABELAS_GRANDES',
        priority: 'MEDIUM',
        title: 'Otimizar tabelas grandes',
        description: `${largeTables.length} tabelas com mais de 100MB`,
        actions: [
          'Considerar particionamento',
          'Arquivar dados antigos',
          'Otimizar estrutura de dados',
          'Revisar estratégia de índices'
        ]
      });
    }

    // Sugestões para padrões de query
    if (Object.keys(this.analysis.queryPatterns).length > 0) {
      this.analysis.optimizationSuggestions.push({
        category: 'PATRÕES_QUERY',
        priority: 'MEDIUM',
        title: 'Corrigir padrões de query problemáticos',
        description: `${Object.keys(this.analysis.queryPatterns).length} padrões identificados`,
        actions: [
          'Evitar SELECT sem WHERE',
          'Garantir índices em colunas de JOIN',
          'Usar LIMIT em ORDER BY',
          'Revisar uso de LIKE com % no início'
        ]
      });
    }

    // Sugestões gerais de configuração
    this.analysis.optimizationSuggestions.push({
      category: 'CONFIGURAÇÃO',
      priority: 'LOW',
      title: 'Revisar configuração do MySQL',
      description: 'Otimização geral do servidor',
      actions: [
        'Ajustar innodb_buffer_pool_size',
        'Configurar query_cache_size',
        'Otimizar max_connections',
        'Habilitar slow_query_log'
      ]
    });

    console.log(`💡 Geradas ${this.analysis.optimizationSuggestions.length} sugestões`);
  }

  generateOptimizationReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportFile = `./optimization_report_${timestamp}.json`;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        slowQueriesCount: this.analysis.slowQueries.length,
        tablesAnalyzed: Object.keys(this.analysis.tableStats).length,
        indexRecommendations: this.analysis.indexRecommendations.length,
        queryPatternsFound: Object.keys(this.analysis.queryPatterns).length,
        optimizationSuggestions: this.analysis.optimizationSuggestions.length
      },
      slowQueries: this.analysis.slowQueries,
      tableStats: this.analysis.tableStats,
      indexRecommendations: this.analysis.indexRecommendations,
      queryPatterns: this.analysis.queryPatterns,
      optimizationSuggestions: this.analysis.optimizationSuggestions
    };

    // Salvar relatório
    const fs = require('fs');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

    console.log('\n📊 RELATÓRIO DE OTIMIZAÇÃO');
    console.log('='.repeat(50));
    console.log(`🐌 Queries lentas: ${report.summary.slowQueriesCount}`);
    console.log(`📋 Tabelas analisadas: ${report.summary.tablesAnalyzed}`);
    console.log(`🔍 Recomendações de índices: ${report.summary.indexRecommendations}`);
    console.log(`🔍 Padrões de query: ${report.summary.queryPatternsFound}`);
    console.log(`💡 Sugestões de otimização: ${report.summary.optimizationSuggestions}`);
    console.log(`📄 Relatório salvo em: ${reportFile}`);

    // Mostrar sugestões prioritárias
    console.log('\n🚀 SUGESTÕES DE OTIMIZAÇÃO:');
    this.analysis.optimizationSuggestions.forEach((suggestion, index) => {
      console.log(`\n${index + 1}. [${suggestion.priority}] ${suggestion.title}`);
      console.log(`   ${suggestion.description}`);
      console.log('   Ações recomendadas:');
      suggestion.actions.forEach(action => {
        console.log(`     • ${action}`);
      });
    });
  }

  // Método para executar otimizações automáticas
  async applyOptimizations(options = {}) {
    console.log('🔧 Aplicando otimizações automáticas...');

    try {
      // Otimizar tabelas
      if (options.optimizeTables) {
        const tables = Object.keys(this.analysis.tableStats);
        for (const table of tables) {
          console.log(`🔧 Otimizando tabela: ${table}`);
          await prisma.$executeRaw`OPTIMIZE TABLE ${prisma.$queryRaw(table)}`;
        }
      }

      // Atualizar estatísticas
      if (options.updateStats) {
        console.log('📊 Atualizando estatísticas...');
        await prisma.$executeRaw`ANALYZE TABLE usuario, empresa, sKU`;
      }

      // Executar outras otimizações...

      console.log('✅ Otimizações aplicadas com sucesso');

    } catch (error) {
      console.error('❌ Erro ao aplicar otimizações:', error.message);
    }
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);

  // Opções padrão
  const options = {
    applyOptimizations: false,
    optimizeTables: false,
    updateStats: false
  };

  // Processar argumentos
  args.forEach(arg => {
    switch (arg) {
      case '--apply':
        options.applyOptimizations = true;
        break;
      case '--optimize-tables':
        options.optimizeTables = true;
        break;
      case '--update-stats':
        options.updateStats = true;
        break;
      case '--help':
        console.log(`
🔍 Análise de Performance MySQL

Uso: node optimize-queries.js [opções]

Opções:
  --apply             Aplicar otimizações automaticamente
  --optimize-tables   Otimizar tabelas automaticamente
  --update-stats      Atualizar estatísticas das tabelas
  --help              Mostrar esta ajuda

Exemplos:
  node optimize-queries.js                    # Apenas análise
  node optimize-queries.js --apply           # Análise + aplicação automática
  node optimize-queries.js --optimize-tables # Análise + otimização de tabelas
`);
        process.exit(0);
    }
  });

  const optimizer = new QueryOptimizer();

  // Executar análise
  await optimizer.analyzePerformance(options);

  // Aplicar otimizações se solicitado
  if (options.applyOptimizations || options.optimizeTables || options.updateStats) {
    await optimizer.applyOptimizations(options);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { QueryOptimizer };