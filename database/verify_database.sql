-- Script de verificação do banco de dados DATALAKE
-- Execute após a criação para verificar se tudo foi configurado corretamente

USE datalake;

-- =====================================================
-- VERIFICAÇÃO GERAL
-- =====================================================

SELECT '=== VERIFICAÇÃO DO BANCO DATALAKE ===' as verificacao;

-- Verificar se o banco existe e está sendo usado
SELECT DATABASE() as banco_atual;

-- Listar todas as tabelas criadas
SELECT '=== TABELAS CRIADAS ===' as secao;
SHOW TABLES;

-- =====================================================
-- CONTAGEM DE REGISTROS POR TABELA
-- =====================================================

SELECT '=== CONTAGEM DE REGISTROS ===' as secao;

SELECT 'usuarios' as tabela, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'fornecedores', COUNT(*) FROM fornecedores
UNION ALL
SELECT 'ordens_compra', COUNT(*) FROM ordens_compra
UNION ALL
SELECT 'itens_ordem_compra', COUNT(*) FROM itens_ordem_compra
UNION ALL
SELECT 'skus', COUNT(*) FROM skus
UNION ALL
SELECT 'precos', COUNT(*) FROM precos
UNION ALL
SELECT 'estoque', COUNT(*) FROM estoque
UNION ALL
SELECT 'movimentacoes_estoque', COUNT(*) FROM movimentacoes_estoque
UNION ALL
SELECT 'cores', COUNT(*) FROM cores
UNION ALL
SELECT 'proformas', COUNT(*) FROM proformas
UNION ALL
SELECT 'itens_proforma', COUNT(*) FROM itens_proforma
UNION ALL
SELECT 'requisicoes', COUNT(*) FROM requisicoes
UNION ALL
SELECT 'itens_requisicao', COUNT(*) FROM itens_requisicao
UNION ALL
SELECT 'containers', COUNT(*) FROM containers
UNION ALL
SELECT 'follow_up', COUNT(*) FROM follow_up
UNION ALL
SELECT 'logs_atividade', COUNT(*) FROM logs_atividade;

-- =====================================================
-- VERIFICAÇÃO DE ÍNDICES
-- =====================================================

SELECT '=== ÍNDICES CRIADOS ===' as secao;

SELECT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'datalake'
ORDER BY TABLE_NAME, SEQ_IN_INDEX;

-- =====================================================
-- VERIFICAÇÃO DE VIEWS
-- =====================================================

SELECT '=== VIEWS CRIADAS ===' as secao;

SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';

-- =====================================================
-- VERIFICAÇÃO DE TRIGGERS
-- =====================================================

SELECT '=== TRIGGERS CRIADOS ===' as secao;

SHOW TRIGGERS;

-- =====================================================
-- TESTE DAS VIEWS
-- =====================================================

SELECT '=== TESTE DAS VIEWS ===' as secao;

-- Testar view de dashboard de ordens
SELECT 'Dashboard Ordens:' as teste;
SELECT * FROM vw_dashboard_ordens;

-- Testar view de dashboard de estoque
SELECT 'Dashboard Estoque:' as teste;
SELECT * FROM vw_dashboard_estoque;

-- =====================================================
-- VERIFICAÇÃO DE RELACIONAMENTOS
-- =====================================================

SELECT '=== VERIFICAÇÃO DE CHAVES ESTRANGEIRAS ===' as secao;

SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'datalake'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;

-- =====================================================
-- DADOS DE EXEMPLO INSERIDOS
-- =====================================================

SELECT '=== DADOS DE EXEMPLO ===' as secao;

-- Verificar usuários
SELECT 'Usuários:' as tabela;
SELECT id, nome, email, cargo FROM usuarios;

-- Verificar fornecedores
SELECT 'Fornecedores:' as tabela;
SELECT id, nome, cnpj, contato_principal FROM fornecedores LIMIT 3;

-- Verificar SKUs
SELECT 'SKUs:' as tabela;
SELECT id, nome, categoria, preco_venda FROM skus LIMIT 5;

-- Verificar ordens de compra
SELECT 'Ordens de Compra:' as tabela;
SELECT id, fornecedor_id, status, valor_total FROM ordens_compra;

-- Verificar requisições
SELECT 'Requisições:' as tabela;
SELECT id, titulo, status, prioridade FROM requisicoes;

-- =====================================================
-- TESTE DE INTEGRIDADE REFERENCIAL
-- =====================================================

SELECT '=== TESTE DE INTEGRIDADE ===' as secao;

-- Verificar se todas as ordens têm fornecedor válido
SELECT 'Ordens sem fornecedor válido:' as teste;
SELECT oc.id, oc.fornecedor_id
FROM ordens_compra oc
LEFT JOIN fornecedores f ON oc.fornecedor_id = f.id
WHERE f.id IS NULL;

-- Verificar se todos os itens de ordem têm SKU válido (se informado)
SELECT 'Itens de ordem com SKU inválido:' as teste;
SELECT ioc.id, ioc.sku
FROM itens_ordem_compra ioc
LEFT JOIN skus s ON ioc.sku = s.id
WHERE ioc.sku IS NOT NULL AND s.id IS NULL;

-- =====================================================
-- RELATÓRIO FINAL
-- =====================================================

SELECT '=== RELATÓRIO FINAL ===' as secao;

SELECT
    'Banco de dados criado com sucesso!' as status,
    NOW() as data_verificacao,
    VERSION() as versao_mysql;

-- Verificar espaço utilizado
SELECT
    'Espaço utilizado pelo banco:' as info,
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as tamanho_mb
FROM information_schema.tables
WHERE table_schema = 'datalake';

SELECT 'Verificação concluída!' as status;
