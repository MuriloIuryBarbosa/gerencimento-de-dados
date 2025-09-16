#!/usr/bin/env node

/**
 * Script Principal de Extração de Dados MySQL
 * Sistema de Gerenciamento de Dados
 *
 * Este script permite extrair dados de todas as tabelas do banco MySQL
 * em diferentes formatos (JSON, CSV, SQL) para backup e análise.
 *
 * Uso:
 * node extract-data.js [opções]
 *
 * Opções:
 * --table <tabela>     Extrair apenas uma tabela específica
 * --format <formato>   Formato de saída (json, csv, sql) - padrão: json
 * --output <diretório> Diretório de saída - padrão: ./exports
 * --all                Extrair todas as tabelas (padrão)
 * --backup             Criar backup completo em SQL
 * --validate           Validar dados após extração
 * --help               Mostrar ajuda
 *
 * Exemplos:
 * node extract-data.js --all --format json
 * node extract-data.js --table usuarios --format csv
 * node extract-data.js --backup
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configurações
const CONFIG = {
  outputDir: './exports',
  formats: ['json', 'csv', 'sql'],
  batchSize: 1000, // Processar em lotes para performance
  maxRetries: 3
};

// Lista de todas as tabelas disponíveis
const TABLES = [
  'usuarios',
  'empresas',
  'usuario_permissoes',
  'password_reset_tokens',
  'sessao_usuarios',
  'cores',
  'familia',
  'tamanhos',
  'depositos',
  'unegs',
  'skus',
  'representantes',
  'clientes',
  'fornecedores',
  'transportadoras',
  'tabelas_dinamicas'
];

// Mapeamento de tabelas para modelos Prisma
const TABLE_MODELS = {
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

// Função para criar diretório se não existir
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Diretório criado: ${dirPath}`);
  }
}

// Função para formatar data
function formatDate(date) {
  return new Date(date).toISOString().replace('T', ' ').substring(0, 19);
}

// Função para escapar valores SQL
function escapeSqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
  if (value instanceof Date) return `'${formatDate(value)}'`;
  return value.toString();
}

// Função para converter dados para CSV
function convertToCSV(data, tableName) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Adicionar cabeçalhos
  csvRows.push(headers.join(';'));

  // Adicionar dados
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && value.includes(';')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value.toString();
    });
    csvRows.push(values.join(';'));
  });

  return csvRows.join('\n');
}

// Função para converter dados para SQL INSERT
function convertToSQL(data, tableName) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const sqlStatements = [];

  // Adicionar comando TRUNCATE para limpar tabela
  sqlStatements.push(`-- Limpar tabela ${tableName}`);
  sqlStatements.push(`TRUNCATE TABLE \`${tableName}\`;`);
  sqlStatements.push('');

  // Adicionar comando SET para desabilitar verificações
  sqlStatements.push(`-- Desabilitar verificações para importação`);
  sqlStatements.push(`SET FOREIGN_KEY_CHECKS = 0;`);
  sqlStatements.push(`SET AUTOCOMMIT = 0;`);
  sqlStatements.push('');

  // Processar dados em lotes
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch.map(row => {
      const rowValues = headers.map(header => escapeSqlValue(row[header]));
      return `(${rowValues.join(', ')})`;
    });

    sqlStatements.push(`INSERT INTO \`${tableName}\` (\`${headers.join('`, `')}\`) VALUES`);
    sqlStatements.push(values.join(',\n'));
    sqlStatements.push(';');
    sqlStatements.push('');
  }

  // Reabilitar verificações
  sqlStatements.push(`-- Reabilitar verificações`);
  sqlStatements.push(`SET FOREIGN_KEY_CHECKS = 1;`);
  sqlStatements.push(`SET AUTOCOMMIT = 1;`);
  sqlStatements.push(`COMMIT;`);

  return sqlStatements.join('\n');
}

// Função para extrair dados de uma tabela
async function extractTableData(tableName, format = 'json', outputDir = CONFIG.outputDir) {
  console.log(`\n📊 Extraindo dados da tabela: ${tableName}`);

  try {
    const modelName = TABLE_MODELS[tableName];
    if (!modelName) {
      throw new Error(`Modelo não encontrado para tabela: ${tableName}`);
    }

    // Obter contagem total
    const totalCount = await prisma[modelName].count();
    console.log(`📈 Total de registros: ${totalCount}`);

    if (totalCount === 0) {
      console.log(`⚠️  Tabela ${tableName} está vazia`);
      return { tableName, count: 0, data: [] };
    }

    // Extrair dados em lotes para performance
    const allData = [];
    const batchSize = CONFIG.batchSize;

    for (let offset = 0; offset < totalCount; offset += batchSize) {
      const batch = await prisma[modelName].findMany({
        skip: offset,
        take: batchSize,
        orderBy: { id: 'asc' }
      });

      allData.push(...batch);

      const progress = Math.round(((offset + batch.length) / totalCount) * 100);
      console.log(`⏳ Progresso: ${progress}% (${offset + batch.length}/${totalCount})`);
    }

    // Salvar dados no formato especificado
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const fileName = `${tableName}_${timestamp}`;

    ensureDirectoryExists(outputDir);

    let filePath, content;

    switch (format.toLowerCase()) {
      case 'csv':
        filePath = path.join(outputDir, `${fileName}.csv`);
        content = convertToCSV(allData, tableName);
        break;

      case 'sql':
        filePath = path.join(outputDir, `${fileName}.sql`);
        content = convertToSQL(allData, tableName);
        break;

      case 'json':
      default:
        filePath = path.join(outputDir, `${fileName}.json`);
        content = JSON.stringify(allData, null, 2);
        break;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Arquivo salvo: ${filePath}`);

    return {
      tableName,
      count: allData.length,
      filePath,
      format
    };

  } catch (error) {
    console.error(`❌ Erro ao extrair dados da tabela ${tableName}:`, error.message);
    throw error;
  }
}

// Função para criar backup completo
async function createFullBackup(outputDir = CONFIG.outputDir) {
  console.log('\n🔄 Criando backup completo do banco de dados...');

  const backupDir = path.join(outputDir, 'backup_completo');
  ensureDirectoryExists(backupDir);

  const results = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

  try {
    // Extrair todas as tabelas em SQL
    for (const tableName of TABLES) {
      console.log(`\n📋 Processando tabela: ${tableName}`);
      const result = await extractTableData(tableName, 'sql', backupDir);
      results.push(result);
    }

    // Criar arquivo de metadados
    const metadata = {
      backup_date: new Date().toISOString(),
      database_url: process.env.DATABASE_URL?.replace(/:[^:]+@/, ':***@'), // Ocultar senha
      total_tables: results.length,
      tables: results.map(r => ({
        name: r.tableName,
        records: r.count,
        file: path.basename(r.filePath)
      })),
      total_records: results.reduce((sum, r) => sum + r.count, 0)
    };

    const metadataPath = path.join(backupDir, `backup_metadata_${timestamp}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');

    // Criar script de restauração
    const restoreScript = `# Script de Restauração - Backup ${timestamp}
# Execute este script no MySQL para restaurar o backup

echo "Iniciando restauração do backup..."

# Lista de arquivos SQL na ordem correta (considerando dependências)
RESTORE_ORDER=(
  "empresas"
  "usuarios"
  "usuario_permissoes"
  "password_reset_tokens"
  "sessao_usuarios"
  "cores"
  "familia"
  "tamanhos"
  "depositos"
  "unegs"
  "representantes"
  "clientes"
  "fornecedores"
  "transportadoras"
  "tabelas_dinamicas"
  "skus"
)

# Restaurar cada tabela
for table in "\${RESTORE_ORDER[@]}"; do
  sql_file="${table}_${timestamp}.sql"
  if [ -f "$sql_file" ]; then
    echo "Restaurando tabela: $table"
    mysql -u root -p datalake < "$sql_file"
    if [ $? -eq 0 ]; then
      echo "✅ Tabela $table restaurada com sucesso"
    else
      echo "❌ Erro ao restaurar tabela $table"
    fi
  else
    echo "⚠️  Arquivo não encontrado: $sql_file"
  fi
done

echo "Restauração concluída!"
`;

    const restoreScriptPath = path.join(backupDir, `restore_backup_${timestamp}.sh`);
    fs.writeFileSync(restoreScriptPath, restoreScript, 'utf8');

    // Tornar script executável (no Windows, isso pode não funcionar perfeitamente)
    try {
      fs.chmodSync(restoreScriptPath, '755');
    } catch (e) {
      // Ignorar erro no Windows
    }

    console.log(`\n✅ Backup completo criado em: ${backupDir}`);
    console.log(`📊 Total de tabelas: ${results.length}`);
    console.log(`📈 Total de registros: ${metadata.total_records}`);
    console.log(`📄 Arquivo de metadados: ${metadataPath}`);
    console.log(`🔧 Script de restauração: ${restoreScriptPath}`);

    return {
      backupDir,
      metadata,
      results
    };

  } catch (error) {
    console.error('❌ Erro ao criar backup completo:', error.message);
    throw error;
  }
}

// Função para validar dados extraídos
async function validateExtractedData(outputDir = CONFIG.outputDir) {
  console.log('\n🔍 Validando dados extraídos...');

  const validationResults = {
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    errors: []
  };

  try {
    // Verificar se diretório existe
    if (!fs.existsSync(outputDir)) {
      throw new Error(`Diretório de saída não existe: ${outputDir}`);
    }

    // Listar arquivos de extração
    const files = fs.readdirSync(outputDir)
      .filter(file => file.endsWith('.json') || file.endsWith('.csv') || file.endsWith('.sql'))
      .filter(file => !file.includes('metadata') && !file.includes('backup'));

    validationResults.totalFiles = files.length;

    for (const file of files) {
      const filePath = path.join(outputDir, file);
      console.log(`📄 Validando: ${file}`);

      try {
        const content = fs.readFileSync(filePath, 'utf8');

        if (file.endsWith('.json')) {
          // Validar JSON
          JSON.parse(content);
          console.log(`✅ JSON válido: ${file}`);
          validationResults.validFiles++;

        } else if (file.endsWith('.csv')) {
          // Validar CSV básico
          const lines = content.split('\n').filter(line => line.trim());
          if (lines.length > 0) {
            console.log(`✅ CSV válido: ${file} (${lines.length} linhas)`);
            validationResults.validFiles++;
          } else {
            throw new Error('Arquivo CSV vazio');
          }

        } else if (file.endsWith('.sql')) {
          // Validar SQL básico
          if (content.includes('INSERT INTO') && content.includes('VALUES')) {
            console.log(`✅ SQL válido: ${file}`);
            validationResults.validFiles++;
          } else {
            throw new Error('Arquivo SQL não contém comandos INSERT válidos');
          }
        }

      } catch (error) {
        console.error(`❌ Arquivo inválido: ${file} - ${error.message}`);
        validationResults.invalidFiles++;
        validationResults.errors.push({
          file,
          error: error.message
        });
      }
    }

    // Resultado da validação
    console.log('\n📊 Resultado da validação:');
    console.log(`📁 Total de arquivos: ${validationResults.totalFiles}`);
    console.log(`✅ Arquivos válidos: ${validationResults.validFiles}`);
    console.log(`❌ Arquivos inválidos: ${validationResults.invalidFiles}`);

    if (validationResults.errors.length > 0) {
      console.log('\n🚨 Erros encontrados:');
      validationResults.errors.forEach(err => {
        console.log(`  - ${err.file}: ${err.error}`);
      });
    }

    return validationResults;

  } catch (error) {
    console.error('❌ Erro na validação:', error.message);
    throw error;
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  let options = {
    table: null,
    format: 'json',
    outputDir: CONFIG.outputDir,
    all: true,
    backup: false,
    validate: false,
    help: false
  };

  // Processar argumentos
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--table':
        options.table = args[++i];
        options.all = false;
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--output':
        options.outputDir = args[++i];
        break;
      case '--all':
        options.all = true;
        break;
      case '--backup':
        options.backup = true;
        break;
      case '--validate':
        options.validate = true;
        break;
      case '--help':
        options.help = true;
        break;
    }
  }

  // Mostrar ajuda
  if (options.help) {
    console.log(`
🚀 Sistema de Extração de Dados MySQL

Uso: node extract-data.js [opções]

Opções:
  --table <tabela>     Extrair apenas uma tabela específica
  --format <formato>   Formato de saída (json, csv, sql) - padrão: json
  --output <diretório> Diretório de saída - padrão: ./exports
  --all                Extrair todas as tabelas (padrão)
  --backup             Criar backup completo em SQL
  --validate           Validar dados após extração
  --help               Mostrar esta ajuda

Exemplos:
  node extract-data.js --all --format json
  node extract-data.js --table usuarios --format csv
  node extract-data.js --backup
  node extract-data.js --validate

Tabelas disponíveis:
${TABLES.map(t => `  - ${t}`).join('\n')}
`);
    return;
  }

  // Validar formato
  if (!CONFIG.formats.includes(options.format)) {
    console.error(`❌ Formato inválido: ${options.format}`);
    console.log(`📋 Formatos suportados: ${CONFIG.formats.join(', ')}`);
    process.exit(1);
  }

  // Validar tabela se especificada
  if (options.table && !TABLES.includes(options.table)) {
    console.error(`❌ Tabela inválida: ${options.table}`);
    console.log(`📋 Tabelas disponíveis: ${TABLES.join(', ')}`);
    process.exit(1);
  }

  console.log('🚀 Iniciando extração de dados MySQL...');
  console.log(`📁 Diretório de saída: ${options.outputDir}`);
  console.log(`📋 Formato: ${options.format.toUpperCase()}`);

  try {
    // Conectar ao banco
    console.log('\n🔌 Conectando ao banco de dados...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    const results = [];

    if (options.backup) {
      // Criar backup completo
      const backupResult = await createFullBackup(options.outputDir);
      results.push(backupResult);

    } else if (options.table) {
      // Extrair tabela específica
      const result = await extractTableData(options.table, options.format, options.outputDir);
      results.push(result);

    } else if (options.all) {
      // Extrair todas as tabelas
      console.log('\n📊 Extraindo todas as tabelas...');

      for (const tableName of TABLES) {
        try {
          const result = await extractTableData(tableName, options.format, options.outputDir);
          results.push(result);
        } catch (error) {
          console.error(`❌ Erro ao processar tabela ${tableName}:`, error.message);
          // Continuar com outras tabelas
        }
      }
    }

    // Validar se solicitado
    if (options.validate) {
      await validateExtractedData(options.outputDir);
    }

    // Resumo final
    console.log('\n🎉 Extração concluída com sucesso!');
    console.log(`📊 Total de operações: ${results.length}`);

    if (results.length > 0 && !options.backup) {
      const totalRecords = results.reduce((sum, r) => sum + r.count, 0);
      console.log(`📈 Total de registros extraídos: ${totalRecords}`);
    }

  } catch (error) {
    console.error('\n❌ Erro durante a extração:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão com banco fechada.');
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = {
  extractTableData,
  createFullBackup,
  validateExtractedData,
  TABLES,
  CONFIG
};