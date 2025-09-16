#!/usr/bin/env node

/**
 * Script de Extração de Dados - Usuários
 * Extrai todos os dados da tabela usuarios do MySQL
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function extractUsuarios() {
  console.log('👥 Extraindo dados de usuários...');

  try {
    // Conectar ao banco
    await prisma.$connect();
    console.log('✅ Conexão estabelecida');

    // Extrair dados com relacionamentos
    const usuarios = await prisma.usuario.findMany({
      include: {
        empresa: true,
        permissoes: true,
        sessoes: {
          take: 5, // Últimas 5 sessões
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Encontrados ${usuarios.length} usuários`);

    // Estatísticas
    const stats = {
      total: usuarios.length,
      ativos: usuarios.filter(u => u.ativo).length,
      inativos: usuarios.filter(u => !u.ativo).length,
      admins: usuarios.filter(u => u.isAdmin).length,
      superAdmins: usuarios.filter(u => u.isSuperAdmin).length,
      comEmpresa: usuarios.filter(u => u.empresaId).length,
      semEmpresa: usuarios.filter(u => !u.empresaId).length,
      ultimoAcesso: usuarios
        .filter(u => u.ultimoAcesso)
        .sort((a, b) => new Date(b.ultimoAcesso) - new Date(a.ultimoAcesso))[0]?.ultimoAcesso
    };

    // Criar diretório se não existir
    const outputDir = './exports/usuarios';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Salvar dados completos
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const dataFile = path.join(outputDir, `usuarios_completos_${timestamp}.json`);
    fs.writeFileSync(dataFile, JSON.stringify(usuarios, null, 2), 'utf8');

    // Salvar apenas dados essenciais (sem senhas)
    const usuariosEssenciais = usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      cargo: u.cargo,
      departamento: u.departamento,
      empresa: u.empresa?.nome,
      isAdmin: u.isAdmin,
      isSuperAdmin: u.isSuperAdmin,
      ativo: u.ativo,
      ultimoAcesso: u.ultimoAcesso,
      createdAt: u.createdAt,
      permissoesCount: u.permissoes.length,
      sessoesCount: u.sessoes.length
    }));

    const essenciaisFile = path.join(outputDir, `usuarios_essenciais_${timestamp}.json`);
    fs.writeFileSync(essenciaisFile, JSON.stringify(usuariosEssenciais, null, 2), 'utf8');

    // Salvar estatísticas
    const statsFile = path.join(outputDir, `usuarios_estatisticas_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf8');

    // Salvar em CSV para análise
    const csvData = usuariosEssenciais.map(u => ({
      ID: u.id,
      Nome: u.nome,
      Email: u.email,
      Cargo: u.cargo || '',
      Departamento: u.departamento || '',
      Empresa: u.empresa || '',
      Admin: u.isAdmin ? 'Sim' : 'Não',
      SuperAdmin: u.isSuperAdmin ? 'Sim' : 'Não',
      Ativo: u.ativo ? 'Sim' : 'Não',
      UltimoAcesso: u.ultimoAcesso ? new Date(u.ultimoAcesso).toLocaleString('pt-BR') : '',
      CriadoEm: new Date(u.createdAt).toLocaleString('pt-BR'),
      Permissoes: u.permissoesCount,
      Sessoes: u.sessoesCount
    }));

    const csvHeaders = Object.keys(csvData[0]).join(';');
    const csvRows = csvData.map(row => Object.values(row).join(';'));
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    const csvFile = path.join(outputDir, `usuarios_${timestamp}.csv`);
    fs.writeFileSync(csvFile, csvContent, 'utf8');

    console.log('\n✅ Extração concluída!');
    console.log(`📁 Arquivos salvos em: ${outputDir}`);
    console.log(`📄 Dados completos: ${dataFile}`);
    console.log(`📄 Dados essenciais: ${essenciaisFile}`);
    console.log(`📄 Estatísticas: ${statsFile}`);
    console.log(`📄 CSV: ${csvFile}`);

    console.log('\n📊 Estatísticas:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Ativos: ${stats.ativos}`);
    console.log(`   Inativos: ${stats.inativos}`);
    console.log(`   Admins: ${stats.admins}`);
    console.log(`   Super Admins: ${stats.superAdmins}`);
    console.log(`   Com empresa: ${stats.comEmpresa}`);
    console.log(`   Sem empresa: ${stats.semEmpresa}`);

    if (stats.ultimoAcesso) {
      console.log(`   Último acesso: ${new Date(stats.ultimoAcesso).toLocaleString('pt-BR')}`);
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
  extractUsuarios().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { extractUsuarios };