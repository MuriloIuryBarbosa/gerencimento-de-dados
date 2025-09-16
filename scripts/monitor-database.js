#!/usr/bin/env node

/**
 * Script de Monitoramento e Alertas do Banco MySQL
 * Monitora performance, conexões e saúde do banco de dados
 */

const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const prisma = new PrismaClient();

class DatabaseMonitor {
  constructor() {
    this.alerts = [];
    this.metrics = {};
    this.thresholds = {
      maxConnections: 100,
      slowQueryTime: 1000, // ms
      maxTableSize: 100 * 1024 * 1024, // 100MB
      minFreeSpace: 1024 * 1024 * 1024, // 1GB
      maxLockWaitTime: 5000 // ms
    };
  }

  async runMonitoring(options = {}) {
    console.log('📊 Iniciando monitoramento do banco de dados...');

    try {
      await prisma.$connect();
      console.log('✅ Conexão estabelecida');

      // Executar verificações
      await this.checkConnections();
      await this.checkPerformance();
      await this.checkStorage();
      await this.checkTableHealth();
      await this.checkSlowQueries();
      await this.checkReplicationStatus();

      // Gerar relatório
      this.generateReport();

      // Enviar alertas se necessário
      if (options.sendAlerts !== false && this.alerts.length > 0) {
        await this.sendAlerts();
      }

    } catch (error) {
      console.error('❌ Erro no monitoramento:', error.message);
      this.alerts.push({
        level: 'CRITICAL',
        message: `Erro no monitoramento: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      await prisma.$disconnect();
    }

    return {
      metrics: this.metrics,
      alerts: this.alerts,
      status: this.alerts.some(a => a.level === 'CRITICAL') ? 'critical' : 'ok'
    };
  }

  async checkConnections() {
    console.log('\n🔗 Verificando conexões...');

    try {
      // Verificar conexões ativas
      const connectionStats = await prisma.$queryRaw`
        SHOW PROCESSLIST
      `;

      const activeConnections = Array.isArray(connectionStats) ? connectionStats.length : 0;

      this.metrics.connections = {
        active: activeConnections,
        max: this.thresholds.maxConnections,
        timestamp: new Date().toISOString()
      };

      console.log(`📈 Conexões ativas: ${activeConnections}/${this.thresholds.maxConnections}`);

      // Verificar se está próximo do limite
      if (activeConnections > this.thresholds.maxConnections * 0.8) {
        this.alerts.push({
          level: 'WARNING',
          message: `Conexões ativas próximas do limite: ${activeConnections}/${this.thresholds.maxConnections}`,
          timestamp: new Date().toISOString()
        });
      }

      // Verificar conexões idle há muito tempo
      const idleConnections = connectionStats.filter(conn =>
        conn.Command === 'Sleep' &&
        conn.Time > 300 // 5 minutos
      );

      if (idleConnections.length > 10) {
        this.alerts.push({
          level: 'WARNING',
          message: `${idleConnections.length} conexões idle há mais de 5 minutos`,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('❌ Erro ao verificar conexões:', error.message);
      this.alerts.push({
        level: 'ERROR',
        message: `Erro ao verificar conexões: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async checkPerformance() {
    console.log('\n⚡ Verificando performance...');

    try {
      // Verificar status do MySQL
      const statusVars = await prisma.$queryRaw`
        SHOW GLOBAL STATUS WHERE Variable_name IN (
          'Queries', 'Slow_queries', 'Threads_connected', 'Threads_running',
          'Innodb_buffer_pool_hit_rate', 'Innodb_buffer_pool_reads',
          'Innodb_buffer_pool_read_requests'
        )
      `;

      const statusMap = {};
      statusVars.forEach(row => {
        statusMap[row.Variable_name] = parseInt(row.Value);
      });

      // Calcular taxa de hit do buffer pool
      const bufferPoolHitRate = statusMap.Innodb_buffer_pool_read_requests > 0
        ? ((statusMap.Innodb_buffer_pool_read_requests - statusMap.Innodb_buffer_pool_reads) /
           statusMap.Innodb_buffer_pool_read_requests * 100).toFixed(2)
        : 100;

      this.metrics.performance = {
        queries: statusMap.Queries || 0,
        slowQueries: statusMap.Slow_queries || 0,
        threadsConnected: statusMap.Threads_connected || 0,
        threadsRunning: statusMap.Threads_running || 0,
        bufferPoolHitRate: parseFloat(bufferPoolHitRate),
        timestamp: new Date().toISOString()
      };

      console.log(`📊 Queries totais: ${this.metrics.performance.queries}`);
      console.log(`🐌 Queries lentas: ${this.metrics.performance.slowQueries}`);
      console.log(`💾 Buffer Pool Hit Rate: ${this.metrics.performance.bufferPoolHitRate}%`);

      // Alertas de performance
      if (this.metrics.performance.slowQueries > 100) {
        this.alerts.push({
          level: 'WARNING',
          message: `Alto número de queries lentas: ${this.metrics.performance.slowQueries}`,
          timestamp: new Date().toISOString()
        });
      }

      if (this.metrics.performance.bufferPoolHitRate < 95) {
        this.alerts.push({
          level: 'WARNING',
          message: `Buffer Pool Hit Rate baixa: ${this.metrics.performance.bufferPoolHitRate}%`,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('❌ Erro ao verificar performance:', error.message);
      this.alerts.push({
        level: 'ERROR',
        message: `Erro ao verificar performance: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async checkStorage() {
    console.log('\n💾 Verificando armazenamento...');

    try {
      // Verificar tamanho das tabelas
      const tableSizes = await prisma.$queryRaw`
        SELECT
          table_name,
          ROUND(data_length / 1024 / 1024, 2) as data_size_mb,
          ROUND(index_length / 1024 / 1024, 2) as index_size_mb,
          ROUND((data_length + index_length) / 1024 / 1024, 2) as total_size_mb
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        ORDER BY total_size_mb DESC
        LIMIT 10
      `;

      this.metrics.storage = {
        tables: tableSizes,
        timestamp: new Date().toISOString()
      };

      console.log('📏 Top 10 tabelas por tamanho:');
      tableSizes.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.table_name}: ${table.total_size_mb}MB`);

        // Verificar tabelas muito grandes
        if (table.total_size_mb > this.thresholds.maxTableSize / (1024 * 1024)) {
          this.alerts.push({
            level: 'WARNING',
            message: `Tabela muito grande: ${table.table_name} (${table.total_size_mb}MB)`,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Verificar espaço livre (se disponível)
      try {
        const diskSpace = await execAsync('df -h /var/lib/mysql 2>/dev/null || echo "N/A"');
        if (diskSpace.stdout !== 'N/A') {
          console.log(`💿 Espaço em disco:\n${diskSpace.stdout}`);
        }
      } catch (error) {
        // Ignorar erro de espaço em disco
      }

    } catch (error) {
      console.error('❌ Erro ao verificar armazenamento:', error.message);
      this.alerts.push({
        level: 'ERROR',
        message: `Erro ao verificar armazenamento: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async checkTableHealth() {
    console.log('\n🏥 Verificando saúde das tabelas...');

    try {
      // Verificar tabelas corrompidas
      const corruptedTables = await prisma.$queryRaw`
        CHECK TABLE usuario, empresa, sKU, deposito
      `;

      const corrupted = corruptedTables.filter(table =>
        table.Msg_type === 'error' || table.Msg_text.includes('corrupt')
      );

      if (corrupted.length > 0) {
        this.alerts.push({
          level: 'CRITICAL',
          message: `Tabelas corrompidas encontradas: ${corrupted.map(t => t.Table).join(', ')}`,
          timestamp: new Date().toISOString()
        });
      }

      // Verificar locks
      const lockInfo = await prisma.$queryRaw`
        SHOW OPEN TABLES WHERE In_use > 0
      `;

      if (lockInfo.length > 0) {
        console.log(`🔒 Tabelas com locks: ${lockInfo.length}`);
        lockInfo.forEach(table => {
          console.log(`   ${table.Table} - Locks: ${table.In_use}`);
        });
      }

      this.metrics.health = {
        corruptedTables: corrupted.length,
        lockedTables: lockInfo.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro ao verificar saúde das tabelas:', error.message);
      this.alerts.push({
        level: 'ERROR',
        message: `Erro ao verificar saúde das tabelas: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async checkSlowQueries() {
    console.log('\n🐌 Verificando queries lentas...');

    try {
      // Buscar queries lentas recentes (últimas 24 horas)
      const slowQueries = await prisma.$queryRaw`
        SELECT
          sql_text,
          exec_count,
          avg_timer_wait / 1000000000 as avg_time_sec,
          max_timer_wait / 1000000000 as max_time_sec
        FROM performance_schema.events_statements_summary_by_digest
        WHERE avg_timer_wait > ? * 1000000000
        AND last_seen > DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY avg_timer_wait DESC
        LIMIT 5
      `;

      this.metrics.slowQueries = slowQueries;

      if (slowQueries.length > 0) {
        console.log('📋 Top 5 queries lentas (últimas 24h):');
        slowQueries.forEach((query, index) => {
          console.log(`   ${index + 1}. Tempo médio: ${query.avg_time_sec.toFixed(2)}s`);
          console.log(`      Execuções: ${query.exec_count}`);

          if (query.avg_time_sec > this.thresholds.slowQueryTime / 1000) {
            this.alerts.push({
              level: 'WARNING',
              message: `Query muito lenta detectada: ${query.avg_time_sec.toFixed(2)}s médio`,
              timestamp: new Date().toISOString()
            });
          }
        });
      }

    } catch (error) {
      console.error('❌ Erro ao verificar queries lentas:', error.message);
      // Não adicionar alerta para erro em performance schema (pode não estar habilitado)
    }
  }

  async checkReplicationStatus() {
    console.log('\n🔄 Verificando status de replicação...');

    try {
      // Verificar se é um slave
      const slaveStatus = await prisma.$queryRaw`
        SHOW SLAVE STATUS
      `;

      if (slaveStatus.length > 0) {
        const status = slaveStatus[0];

        this.metrics.replication = {
          ioRunning: status.Slave_IO_Running,
          sqlRunning: status.Slave_SQL_Running,
          lastError: status.Last_Error,
          secondsBehindMaster: status.Seconds_Behind_Master,
          timestamp: new Date().toISOString()
        };

        console.log(`🔗 Replicação IO: ${status.Slave_IO_Running}`);
        console.log(`🔗 Replicação SQL: ${status.Slave_SQL_Running}`);
        console.log(`⏰ Atraso: ${status.Seconds_Behind_Master || 0} segundos`);

        // Alertas de replicação
        if (status.Slave_IO_Running !== 'Yes' || status.Slave_SQL_Running !== 'Yes') {
          this.alerts.push({
            level: 'CRITICAL',
            message: 'Replicação MySQL com problemas',
            timestamp: new Date().toISOString()
          });
        }

        if (status.Seconds_Behind_Master > 300) { // 5 minutos
          this.alerts.push({
            level: 'WARNING',
            message: `Replicação atrasada: ${status.Seconds_Behind_Master} segundos`,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        console.log('ℹ️  Não é um servidor slave ou replicação não configurada');
      }

    } catch (error) {
      console.error('❌ Erro ao verificar replicação:', error.message);
      // Não adicionar alerta para erro de replicação (pode não estar configurada)
    }
  }

  generateReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportFile = `./monitoring_report_${timestamp}.json`;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalAlerts: this.alerts.length,
        criticalAlerts: this.alerts.filter(a => a.level === 'CRITICAL').length,
        warningAlerts: this.alerts.filter(a => a.level === 'WARNING').length,
        errorAlerts: this.alerts.filter(a => a.level === 'ERROR').length,
        status: this.alerts.some(a => a.level === 'CRITICAL') ? 'critical' : 'healthy'
      },
      metrics: this.metrics,
      alerts: this.alerts
    };

    // Salvar relatório
    const fs = require('fs');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

    console.log('\n📊 RELATÓRIO DE MONITORAMENTO');
    console.log('='.repeat(50));
    console.log(`🚨 Alertas críticos: ${report.summary.criticalAlerts}`);
    console.log(`⚠️  Alertas de aviso: ${report.summary.warningAlerts}`);
    console.log(`❌ Erros: ${report.summary.errorAlerts}`);
    console.log(`📄 Relatório salvo em: ${reportFile}`);

    if (report.summary.status === 'healthy') {
      console.log('\n✅ Sistema saudável!');
    } else {
      console.log('\n🚨 Sistema com problemas críticos!');
      console.log('Verifique os alertas acima.');
    }

    // Mostrar alertas
    if (this.alerts.length > 0) {
      console.log('\n🚨 ALERTAS DETECTADOS:');
      this.alerts.forEach((alert, index) => {
        console.log(`   ${index + 1}. [${alert.level}] ${alert.message}`);
      });
    }
  }

  async sendAlerts() {
    console.log('\n📧 Enviando alertas...');

    // Aqui você pode implementar envio de email, Slack, etc.
    // Por enquanto, apenas log
    console.log(`📧 ${this.alerts.length} alertas enviados (simulado)`);

    // Exemplo de implementação de email (comentado)
    /*
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.ALERT_FROM,
      to: process.env.ALERT_TO,
      subject: 'Alertas do Monitoramento MySQL',
      html: this.generateAlertEmail()
    };

    await transporter.sendMail(mailOptions);
    */
  }

  generateAlertEmail() {
    // Implementar template de email HTML
    return `
      <h1>Alertas do Monitoramento MySQL</h1>
      <p>Foram detectados ${this.alerts.length} alertas:</p>
      <ul>
        ${this.alerts.map(alert => `<li><strong>${alert.level}:</strong> ${alert.message}</li>`).join('')}
      </ul>
    `;
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);

  // Opções padrão
  const options = {
    sendAlerts: false
  };

  // Processar argumentos
  args.forEach(arg => {
    switch (arg) {
      case '--send-alerts':
        options.sendAlerts = true;
        break;
      case '--help':
        console.log(`
📊 Monitoramento do Banco de Dados MySQL

Uso: node monitor-database.js [opções]

Opções:
  --send-alerts    Enviar alertas por email/Slack
  --help           Mostrar esta ajuda

Exemplos:
  node monitor-database.js                    # Monitoramento básico
  node monitor-database.js --send-alerts     # Com envio de alertas
`);
        process.exit(0);
    }
  });

  const monitor = new DatabaseMonitor();
  const result = await monitor.runMonitoring(options);

  // Exit code baseado no status
  process.exit(result.status === 'critical' ? 1 : 0);
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { DatabaseMonitor };