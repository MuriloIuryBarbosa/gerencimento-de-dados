#!/usr/bin/env node

/**
 * Script de Backup Completo do Banco MySQL
 * Cria backup completo de todas as tabelas em formato SQL
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function createFullBackup() {
  console.log('🔄 Iniciando backup completo do banco MySQL...');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const backupDir = `./backups/backup_${timestamp}`;

  try {
    // Criar diretório de backup
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`📁 Diretório de backup criado: ${backupDir}`);
    }

    // Arquivo de backup principal
    const backupFile = path.join(backupDir, `backup_completo_${timestamp}.sql`);

    console.log('📦 Criando dump do banco de dados...');

    // Comando mysqldump (ajuste as credenciais conforme necessário)
    const dumpCommand = `mysqldump -u root -p123456789 datalake --routines --triggers --single-transaction > "${backupFile}"`;

    try {
      await execAsync(dumpCommand);
      console.log('✅ Dump do banco criado com sucesso!');
    } catch (error) {
      console.error('❌ Erro no mysqldump:', error.message);
      console.log('💡 Tentando método alternativo com Prisma...');

      // Método alternativo usando Prisma
      await createBackupWithPrisma(backupDir, timestamp);
      return;
    }

    // Verificar tamanho do arquivo
    const stats = fs.statSync(backupFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`📊 Tamanho do backup: ${fileSizeMB} MB`);

    // Criar arquivo de compressão (opcional)
    const compressedFile = path.join(backupDir, `backup_completo_${timestamp}.sql.gz`);
    try {
      // No Windows, podemos usar 7zip ou similar
      const compressCommand = `powershell "Compress-Archive -Path '${backupFile}' -DestinationPath '${compressedFile}' -Force"`;
      await execAsync(compressCommand);
      console.log('✅ Arquivo comprimido criado!');
    } catch (compressError) {
      console.log('⚠️  Compressão não disponível, mantendo arquivo original');
    }

    // Criar arquivo de metadados
    const metadata = {
      backup_type: 'full_mysql_dump',
      timestamp: new Date().toISOString(),
      database: 'datalake',
      file: path.basename(backupFile),
      size_bytes: stats.size,
      size_mb: fileSizeMB,
      compressed: fs.existsSync(compressedFile),
      compressed_file: fs.existsSync(compressedFile) ? path.basename(compressedFile) : null
    };

    const metadataFile = path.join(backupDir, 'backup_metadata.json');
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');

    // Criar script de restauração
    const restoreScript = `@echo off
echo ========================================
echo     RESTAURACAO DO BACKUP MYSQL
echo     Data: ${timestamp}
echo ========================================
echo.

echo Este script ira restaurar o backup completo do banco de dados.
echo ATENCAO: Isso ira SUBSTITUIR todos os dados atuais!
echo.

set /p confirm="Deseja continuar? (s/n): "
if /i not "%confirm%"=="s" (
    echo Operacao cancelada pelo usuario.
    pause
    exit /b 1
)

echo.
echo Criando backup de seguranca dos dados atuais...

mysqldump -u root -p123456789 datalake > "backup_seguranca_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.sql"

if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar backup de seguranca!
    pause
    exit /b 1
)

echo Backup de seguranca criado com sucesso.
echo.

echo Restaurando backup...
mysql -u root -p123456789 datalake < "${path.basename(backupFile)}"

if %errorlevel% neq 0 (
    echo ERRO: Falha na restauracao!
    echo Seus dados originais estao no arquivo de backup de seguranca.
    pause
    exit /b 1
)

echo.
echo ========================================
echo     RESTAURACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Backup restaurado: ${path.basename(backupFile)}
echo Backup de seguranca: backup_seguranca_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.sql
echo.

pause
`;

    const restoreScriptPath = path.join(backupDir, 'restore_backup.bat');
    fs.writeFileSync(restoreScriptPath, restoreScript, 'utf8');

    console.log('\n✅ Backup completo criado com sucesso!');
    console.log(`📁 Local: ${backupDir}`);
    console.log(`📄 Arquivo principal: ${path.basename(backupFile)}`);
    if (fs.existsSync(compressedFile)) {
      console.log(`📦 Arquivo comprimido: ${path.basename(compressedFile)}`);
    }
    console.log(`📋 Metadados: backup_metadata.json`);
    console.log(`🔧 Script de restauração: restore_backup.bat`);

    console.log('\n📝 Instruções de restauração:');
    console.log('1. Execute o arquivo restore_backup.bat como administrador');
    console.log('2. Confirme a operação quando solicitado');
    console.log('3. O script criará um backup de segurança antes de restaurar');

  } catch (error) {
    console.error('❌ Erro no backup:', error.message);
    throw error;
  }
}

async function createBackupWithPrisma(backupDir, timestamp) {
  console.log('🔄 Criando backup usando Prisma...');

  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();

    // Lista de tabelas na ordem correta (considerando dependências)
    const tables = [
      'empresas',
      'usuarios',
      'usuario_permissoes',
      'password_reset_tokens',
      'sessao_usuarios',
      'cores',
      'familia',
      'tamanhos',
      'depositos',
      'unegs',
      'representantes',
      'clientes',
      'fornecedores',
      'transportadoras',
      'tabelas_dinamicas',
      'skus'
    ];

    const backupFile = path.join(backupDir, `backup_prisma_${timestamp}.sql`);
    let sqlContent = `-- Backup criado com Prisma - ${new Date().toISOString()}
-- Base de dados: datalake
-- Data: ${timestamp}

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

`;

    let totalRecords = 0;

    for (const tableName of tables) {
      console.log(`📋 Processando tabela: ${tableName}`);

      const modelName = getModelName(tableName);
      const records = await prisma[modelName].findMany({
        orderBy: { id: 'asc' }
      });

      if (records.length > 0) {
        sqlContent += `\n-- Tabela: ${tableName} (${records.length} registros)\n`;
        sqlContent += `TRUNCATE TABLE \`${tableName}\`;\n\n`;

        // Processar em lotes para INSERT
        const batchSize = 100;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          const values = batch.map(record => formatRecordForSQL(record)).join(',\n');
          const columns = Object.keys(batch[0]).join('`, `');

          sqlContent += `INSERT INTO \`${tableName}\` (\`${columns}\`) VALUES\n${values};\n\n`;
        }

        totalRecords += records.length;
        console.log(`✅ ${tableName}: ${records.length} registros`);
      } else {
        console.log(`⚠️  ${tableName}: tabela vazia`);
      }
    }

    // Finalizar SQL
    sqlContent += `
SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;
COMMIT;

-- Backup concluído em ${new Date().toISOString()}
`;

    // Salvar arquivo
    fs.writeFileSync(backupFile, sqlContent, 'utf8');

    // Criar metadados
    const metadata = {
      backup_type: 'prisma_backup',
      timestamp: new Date().toISOString(),
      database: 'datalake',
      file: path.basename(backupFile),
      total_records: totalRecords,
      tables_count: tables.length
    };

    const metadataFile = path.join(backupDir, 'backup_metadata.json');
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');

    console.log(`\n✅ Backup Prisma criado com sucesso!`);
    console.log(`📄 Arquivo: ${backupFile}`);
    console.log(`📊 Total de registros: ${totalRecords}`);

  } catch (error) {
    console.error('❌ Erro no backup Prisma:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function getModelName(tableName) {
  const mapping = {
    'usuarios': 'usuario',
    'empresas': 'empresa',
    'usuario_permissoes': 'usuarioPermissao',
    'password_reset_tokens': 'passwordResetToken',
    'sessao_usuarios': 'sessaoUsuario',
    'cores': 'cor',
    'familia': 'familia',
    'tamanhos': 'tamanho',
    'depositos': 'deposito',
    'unegs': 'uNEG',
    'skus': 'sKU',
    'representantes': 'representante',
    'clientes': 'cliente',
    'fornecedores': 'fornecedor',
    'transportadoras': 'transportadora',
    'tabelas_dinamicas': 'tabelaDinamica'
  };

  return mapping[tableName] || tableName;
}

function formatRecordForSQL(record) {
  const values = Object.values(record).map(value => {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'boolean') return value ? '1' : '0';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
    return value.toString();
  });

  return `(${values.join(', ')})`;
}

// Executar se chamado diretamente
if (require.main === module) {
  createFullBackup().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { createFullBackup, createBackupWithPrisma };