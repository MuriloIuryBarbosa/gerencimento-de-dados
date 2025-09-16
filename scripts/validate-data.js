#!/usr/bin/env node

/**
 * Script de Validação de Dados Extraídos
 * Valida a integridade e consistência dos dados exportados
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class DataValidator {
  constructor() {
    this.results = {
      totalFiles: 0,
      validFiles: 0,
      invalidFiles: 0,
      warnings: [],
      errors: [],
      statistics: {}
    };
  }

  async validateAll(outputDir = './exports') {
    console.log('🔍 Iniciando validação de dados extraídos...');
    console.log(`📁 Diretório: ${outputDir}`);

    try {
      if (!fs.existsSync(outputDir)) {
        throw new Error(`Diretório não existe: ${outputDir}`);
      }

      // Conectar ao banco para comparações
      await prisma.$connect();
      console.log('✅ Conexão com banco estabelecida');

      // Listar todos os arquivos de exportação
      const files = this.getExportFiles(outputDir);
      this.results.totalFiles = files.length;

      console.log(`📄 Encontrados ${files.length} arquivos para validação`);

      // Validar cada arquivo
      for (const file of files) {
        await this.validateFile(file, outputDir);
      }

      // Executar validações cruzadas
      await this.validateCrossReferences(outputDir);

      // Gerar relatório final
      this.generateReport(outputDir);

    } catch (error) {
      console.error('❌ Erro na validação:', error.message);
      this.results.errors.push({
        type: 'fatal',
        message: error.message
      });
    } finally {
      await prisma.$disconnect();
    }

    return this.results;
  }

  getExportFiles(outputDir) {
    const files = [];

    // Função recursiva para buscar arquivos
    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (this.isExportFile(item)) {
          files.push({
            path: fullPath,
            relativePath: path.relative(outputDir, fullPath),
            name: item,
            extension: path.extname(item).toLowerCase(),
            directory: path.dirname(path.relative(outputDir, fullPath))
          });
        }
      }
    };

    scanDir(outputDir);
    return files;
  }

  isExportFile(filename) {
    const exportExtensions = ['.json', '.csv', '.sql'];
    const exportPatterns = [
      /extract.*\.(json|csv|sql)$/i,
      /backup.*\.(json|csv|sql)$/i,
      /usuarios.*\.(json|csv|sql)$/i,
      /skus.*\.(json|csv|sql)$/i,
      /empresas.*\.(json|csv|sql)$/i,
      /.*\d{4}-\d{2}-\d{2}.*\.(json|csv|sql)$/i
    ];

    const ext = path.extname(filename).toLowerCase();
    if (!exportExtensions.includes(ext)) return false;

    return exportPatterns.some(pattern => pattern.test(filename));
  }

  async validateFile(fileInfo, outputDir) {
    console.log(`📄 Validando: ${fileInfo.relativePath}`);

    try {
      const content = fs.readFileSync(fileInfo.path, 'utf8');

      switch (fileInfo.extension) {
        case '.json':
          await this.validateJSONFile(fileInfo, content);
          break;
        case '.csv':
          await this.validateCSVFile(fileInfo, content);
          break;
        case '.sql':
          await this.validateSQLFile(fileInfo, content);
          break;
      }

      this.results.validFiles++;

    } catch (error) {
      console.error(`❌ Erro ao validar ${fileInfo.name}:`, error.message);
      this.results.invalidFiles++;
      this.results.errors.push({
        file: fileInfo.relativePath,
        type: 'validation_error',
        message: error.message
      });
    }
  }

  async validateJSONFile(fileInfo, content) {
    const data = JSON.parse(content);

    if (!Array.isArray(data) && typeof data !== 'object') {
      throw new Error('Arquivo JSON deve conter array ou objeto');
    }

    const items = Array.isArray(data) ? data : [data];
    console.log(`   ✅ JSON válido: ${items.length} itens`);

    // Validações específicas por tipo de arquivo
    if (fileInfo.name.includes('usuarios')) {
      await this.validateUsuariosData(items);
    } else if (fileInfo.name.includes('skus')) {
      await this.validateSKUsData(items);
    } else if (fileInfo.name.includes('empresas')) {
      await this.validateEmpresasData(items);
    }

    // Atualizar estatísticas
    this.updateStatistics(fileInfo.directory, fileInfo.extension, items.length);
  }

  async validateCSVFile(fileInfo, content) {
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error('Arquivo CSV vazio');
    }

    const headers = lines[0].split(';');
    const dataLines = lines.slice(1);

    console.log(`   ✅ CSV válido: ${headers.length} colunas, ${dataLines.length} linhas`);

    // Verificar consistência das linhas
    const invalidLines = dataLines.filter(line => {
      const columns = line.split(';');
      return columns.length !== headers.length;
    });

    if (invalidLines.length > 0) {
      this.results.warnings.push({
        file: fileInfo.relativePath,
        type: 'csv_inconsistency',
        message: `${invalidLines.length} linhas com número incorreto de colunas`
      });
    }

    this.updateStatistics(fileInfo.directory, fileInfo.extension, dataLines.length);
  }

  async validateSQLFile(fileInfo, content) {
    // Validações básicas de SQL
    const hasInsert = /INSERT INTO/i.test(content);
    const hasCreateTable = /CREATE TABLE/i.test(content);
    const hasValidStructure = hasInsert || hasCreateTable;

    if (!hasValidStructure) {
      throw new Error('Arquivo SQL não contém comandos válidos');
    }

    console.log(`   ✅ SQL válido: ${hasInsert ? 'contém INSERTs' : 'contém CREATE TABLE'}`);

    // Contar INSERTs aproximados
    const insertCount = (content.match(/INSERT INTO/gi) || []).length;
    this.updateStatistics(fileInfo.directory, fileInfo.extension, insertCount);
  }

  async validateUsuariosData(usuarios) {
    const issues = [];

    for (const usuario of usuarios) {
      // Verificar campos obrigatórios
      if (!usuario.nome || !usuario.email) {
        issues.push(`Usuário ID ${usuario.id}: campos obrigatórios faltando`);
      }

      // Verificar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (usuario.email && !emailRegex.test(usuario.email)) {
        issues.push(`Usuário ${usuario.email}: formato de email inválido`);
      }

      // Verificar se empresa existe (se informada)
      if (usuario.empresaId) {
        try {
          const empresa = await prisma.empresa.findUnique({
            where: { id: usuario.empresaId }
          });
          if (!empresa) {
            issues.push(`Usuário ${usuario.email}: empresa ID ${usuario.empresaId} não existe`);
          }
        } catch (error) {
          issues.push(`Erro ao verificar empresa para usuário ${usuario.email}`);
        }
      }
    }

    if (issues.length > 0) {
      this.results.warnings.push({
        type: 'data_integrity',
        message: `Problemas encontrados em usuários: ${issues.join('; ')}`
      });
    }
  }

  async validateSKUsData(skus) {
    const issues = [];

    for (const sku of skus) {
      // Verificar campos obrigatórios
      if (!sku.codigo || !sku.nome) {
        issues.push(`SKU ID ${sku.id}: campos obrigatórios faltando`);
      }

      // Verificar unicidade do código
      const duplicateCode = skus.filter(s => s.codigo === sku.codigo && s.id !== sku.id);
      if (duplicateCode.length > 0) {
        issues.push(`SKU código ${sku.codigo}: código duplicado`);
      }

      // Verificar relacionamentos
      const relationships = [
        { field: 'corId', model: 'cor', name: 'cor' },
        { field: 'familiaId', model: 'familia', name: 'família' },
        { field: 'tamanhoId', model: 'tamanho', name: 'tamanho' },
        { field: 'depositoId', model: 'deposito', name: 'depósito' },
        { field: 'unegId', model: 'uNEG', name: 'UNEG' }
      ];

      for (const rel of relationships) {
        if (sku[rel.field]) {
          try {
            const exists = await prisma[rel.model].findUnique({
              where: { id: sku[rel.field] }
            });
            if (!exists) {
              issues.push(`SKU ${sku.codigo}: ${rel.name} ID ${sku[rel.field]} não existe`);
            }
          } catch (error) {
            issues.push(`Erro ao verificar ${rel.name} para SKU ${sku.codigo}`);
          }
        }
      }
    }

    if (issues.length > 0) {
      this.results.warnings.push({
        type: 'data_integrity',
        message: `Problemas encontrados em SKUs: ${issues.join('; ')}`
      });
    }
  }

  async validateEmpresasData(empresas) {
    const issues = [];

    for (const empresa of empresas) {
      // Verificar campos obrigatórios
      if (!empresa.nome) {
        issues.push(`Empresa ID ${empresa.id}: nome obrigatório faltando`);
      }

      // Verificar unicidade do nome
      const duplicateName = empresas.filter(e => e.nome === empresa.nome && e.id !== empresa.id);
      if (duplicateName.length > 0) {
        issues.push(`Empresa ${empresa.nome}: nome duplicado`);
      }

      // Verificar formato de CNPJ (se informado)
      if (empresa.cnpj) {
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!cnpjRegex.test(empresa.cnpj)) {
          issues.push(`Empresa ${empresa.nome}: formato de CNPJ inválido`);
        }
      }
    }

    if (issues.length > 0) {
      this.results.warnings.push({
        type: 'data_integrity',
        message: `Problemas encontrados em empresas: ${issues.join('; ')}`
      });
    }
  }

  async validateCrossReferences(outputDir) {
    console.log('\n🔗 Validando referências cruzadas...');

    try {
      // Carregar dados de diferentes tabelas para validação cruzada
      const usuariosFile = this.findFileByPattern(outputDir, /usuarios.*\.json$/);
      const skusFile = this.findFileByPattern(outputDir, /skus.*\.json$/);

      if (usuariosFile && skusFile) {
        const usuarios = JSON.parse(fs.readFileSync(usuariosFile, 'utf8'));
        const skus = JSON.parse(fs.readFileSync(skusFile, 'utf8'));

        // Verificar se usuários referenciados em SKUs existem
        const usuarioIdsFromDB = usuarios.map(u => u.id);
        const skusWithInvalidUser = skus.filter(sku => sku.usuarioId && !usuarioIdsFromDB.includes(sku.usuarioId));

        if (skusWithInvalidUser.length > 0) {
          this.results.warnings.push({
            type: 'cross_reference',
            message: `${skusWithInvalidUser.length} SKUs referenciam usuários inexistentes`
          });
        }
      }

    } catch (error) {
      console.error('❌ Erro na validação cruzada:', error.message);
    }
  }

  findFileByPattern(outputDir, pattern) {
    const files = this.getExportFiles(outputDir);
    const match = files.find(file => pattern.test(file.name));
    return match ? match.path : null;
  }

  updateStatistics(directory, extension, count) {
    const key = `${directory}_${extension}`;
    if (!this.results.statistics[key]) {
      this.results.statistics[key] = 0;
    }
    this.results.statistics[key] += count;
  }

  generateReport(outputDir) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportFile = path.join(outputDir, `validacao_relatorio_${timestamp}.json`);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_files: this.results.totalFiles,
        valid_files: this.results.validFiles,
        invalid_files: this.results.invalidFiles,
        warnings_count: this.results.warnings.length,
        errors_count: this.results.errors.length
      },
      statistics: this.results.statistics,
      warnings: this.results.warnings,
      errors: this.results.errors,
      status: this.results.invalidFiles === 0 ? 'success' : 'failed'
    };

    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

    console.log('\n📊 RELATÓRIO DE VALIDAÇÃO');
    console.log('='.repeat(50));
    console.log(`📁 Arquivos analisados: ${report.summary.total_files}`);
    console.log(`✅ Arquivos válidos: ${report.summary.valid_files}`);
    console.log(`❌ Arquivos inválidos: ${report.summary.invalid_files}`);
    console.log(`⚠️  Avisos: ${report.summary.warnings_count}`);
    console.log(`🚨 Erros: ${report.summary.errors_count}`);
    console.log(`📄 Relatório salvo em: ${reportFile}`);

    if (report.status === 'success') {
      console.log('\n🎉 Validação concluída com SUCESSO!');
    } else {
      console.log('\n⚠️  Validação concluída com PROBLEMAS!');
      console.log('Verifique o relatório detalhado para mais informações.');
    }
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  const outputDir = args[0] || './exports';

  const validator = new DataValidator();
  await validator.validateAll(outputDir);
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { DataValidator };