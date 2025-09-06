-- Script para popular o banco de dados com dados de exemplo
-- Execute após o setup_complete_database.sql

USE datalake;

-- =====================================================
-- INSERIR DADOS DE EXEMPLO
-- =====================================================

-- Inserir fornecedores de exemplo
INSERT IGNORE INTO fornecedores (nome, cnpj, endereco, telefone, email, contato_principal, condicoes_pagamento, prazo_entrega_padrao) VALUES
('Fornecedor ABC Ltda', '12.345.678/0001-90', 'Rua das Flores, 123 - Centro, São Paulo - SP', '(11) 3456-7890', 'contato@abc.com.br', 'João Silva', '30 dias', 15),
('Empresa XYZ S.A.', '98.765.432/0001-10', 'Av. Paulista, 456 - Bela Vista, São Paulo - SP', '(11) 9876-5432', 'vendas@xyz.com.br', 'Maria Santos', '45 dias', 20),
('Comércio Geral Ltda', '45.678.901/0001-23', 'Rua do Comércio, 789 - Centro, Rio de Janeiro - RJ', '(21) 2345-6789', 'pedidos@comercio.com.br', 'Pedro Oliveira', '60 dias', 25);

-- Inserir SKUs de exemplo
INSERT IGNORE INTO skus (id, nome, descricao, categoria, subcategoria, marca, unidade_medida, peso, cor, fornecedor_principal_id, custo_unitario, preco_venda, estoque_minimo) VALUES
('SKU001', 'Notebook Dell Inspiron', 'Notebook para uso corporativo', 'Eletrônicos', 'Computadores', 'Dell', 'un', 2.5, 'Preto', 1, 2500.00, 3200.00, 5),
('SKU002', 'Mouse Óptico Logitech', 'Mouse óptico USB', 'Eletrônicos', 'Periféricos', 'Logitech', 'un', 0.1, 'Preto', 2, 25.00, 45.00, 10),
('SKU003', 'Teclado Mecânico RGB', 'Teclado mecânico com iluminação RGB', 'Eletrônicos', 'Periféricos', 'Redragon', 'un', 0.8, 'Preto', 3, 180.00, 280.00, 8),
('SKU004', 'Monitor 24" Full HD', 'Monitor LED 24 polegadas Full HD', 'Eletrônicos', 'Monitores', 'Samsung', 'un', 3.2, 'Preto', 1, 450.00, 650.00, 3),
('SKU005', 'Cadeira Ergonômica', 'Cadeira de escritório ergonômica', 'Móveis', 'Escritório', 'Fortex', 'un', 15.0, 'Preto', 2, 320.00, 480.00, 2);

-- Inserir dados de estoque
INSERT IGNORE INTO estoque (sku_id, quantidade_atual, localizacao, lote) VALUES
('SKU001', 12, 'Depósito A - Prateleira 1', 'LOTE2025001'),
('SKU002', 45, 'Depósito A - Prateleira 2', 'LOTE2025002'),
('SKU003', 18, 'Depósito A - Prateleira 3', 'LOTE2025003'),
('SKU004', 7, 'Depósito B - Prateleira 1', 'LOTE2025004'),
('SKU005', 5, 'Depósito B - Prateleira 2', 'LOTE2025005');

-- Inserir preços
INSERT IGNORE INTO precos (sku_id, preco_custo, preco_venda, margem_lucro, tipo_preco) VALUES
('SKU001', 2500.00, 3200.00, 28.00, 'Padrão'),
('SKU002', 25.00, 45.00, 80.00, 'Padrão'),
('SKU003', 180.00, 280.00, 55.56, 'Padrão'),
('SKU004', 450.00, 650.00, 44.44, 'Padrão'),
('SKU005', 320.00, 480.00, 50.00, 'Padrão');

-- Inserir ordens de compra de exemplo
INSERT IGNORE INTO ordens_compra (id, fornecedor_id, usuario_criador_id, data_emissao, prazo_entrega, condicao_pagamento, status, prioridade, valor_total) VALUES
('OC-2025-001', 1, 1, '2025-09-01', '2025-09-16', '30 dias', 'Aprovada', 'Alta', 3200.00),
('OC-2025-002', 2, 1, '2025-09-02', '2025-09-22', '45 dias', 'Pendente Aprovação', 'Média', 1575.00),
('OC-2025-003', 3, 1, '2025-09-03', '2025-09-28', '60 dias', 'Rascunho', 'Baixa', 280.00);

-- Inserir itens das ordens
INSERT IGNORE INTO itens_ordem_compra (ordem_id, descricao, quantidade, unidade, valor_unitario, valor_total, sku) VALUES
('OC-2025-001', 'Notebook Dell Inspiron', 1, 'un', 2500.00, 2500.00, 'SKU001'),
('OC-2025-002', 'Mouse Óptico Logitech', 15, 'un', 25.00, 375.00, 'SKU002'),
('OC-2025-002', 'Teclado Mecânico RGB', 4, 'un', 180.00, 720.00, 'SKU003'),
('OC-2025-002', 'Monitor 24" Full HD', 2, 'un', 450.00, 900.00, 'SKU004'),
('OC-2025-003', 'Teclado Mecânico RGB', 1, 'un', 180.00, 280.00, 'SKU003');

-- Inserir requisições de exemplo
INSERT IGNORE INTO requisicoes (id, titulo, descricao, tipo, prioridade, status, departamento_solicitante, usuario_solicitante_id, data_necessidade) VALUES
('REQ-2025-001', 'Material para novo projeto', 'Materiais necessários para o projeto XYZ', 'Material', 'Alta', 'Aprovada', 'TI', 1, '2025-09-15'),
('REQ-2025-002', 'Suprimentos escritório', 'Canetas, papel e materiais de escritório', 'Material', 'Média', 'Pendente', 'Administrativo', 1, '2025-09-20');

-- Inserir itens das requisições
INSERT IGNORE INTO itens_requisicao (requisicao_id, sku_id, descricao, quantidade_solicitada, unidade, justificativa) VALUES
('REQ-2025-001', 'SKU001', 'Notebook Dell Inspiron', 2, 'un', 'Desenvolvimento do projeto XYZ'),
('REQ-2025-001', 'SKU004', 'Monitor 24" Full HD', 2, 'un', 'Monitores para equipe de desenvolvimento'),
('REQ-2025-002', 'SKU002', 'Mouse Óptico Logitech', 10, 'un', 'Reposicao do estoque de escritório');

-- Inserir proformas de exemplo
INSERT IGNORE INTO proformas (id, titulo, cliente, fornecedor_id, data_emissao, data_validade, valor_total, status, usuario_criador_id) VALUES
('PROF-2025-001', 'Proposta para Empresa ABC', 'Empresa ABC Ltda', 1, '2025-09-01', '2025-09-30', 12800.00, 'Enviada', 1),
('PROF-2025-002', 'Cotação Sistema ERP', 'Empresa XYZ S.A.', 2, '2025-09-03', '2025-10-03', 9450.00, 'Aprovada', 1);

-- Inserir itens das proformas
INSERT IGNORE INTO itens_proforma (proforma_id, descricao, quantidade, unidade, valor_unitario, valor_total, sku_id) VALUES
('PROF-2025-001', 'Notebook Dell Inspiron', 4, 'un', 3200.00, 12800.00, 'SKU001'),
('PROF-2025-002', 'Mouse Óptico Logitech', 30, 'un', 45.00, 1350.00, 'SKU002'),
('PROF-2025-002', 'Teclado Mecânico RGB', 10, 'un', 280.00, 2800.00, 'SKU003'),
('PROF-2025-002', 'Monitor 24" Full HD', 5, 'un', 650.00, 3250.00, 'SKU004'),
('PROF-2025-002', 'Cadeira Ergonômica', 8, 'un', 480.00, 3840.00, 'SKU005');

-- Inserir containers de exemplo
INSERT IGNORE INTO containers (id, numero_container, tipo, status, origem, destino, data_embarque, data_chegada_prevista, navio, booking_number, valor_frete, usuario_responsavel_id) VALUES
('CONT-2025-001', 'MSKU1234567', '40ft', 'Em Trânsito', 'Shanghai, China', 'Santos, Brasil', '2025-08-15', '2025-09-20', 'MSC Isabella', 'MSC123456', 2500.00, 1),
('CONT-2025-002', 'OOLU9876543', '20ft', 'Aguardando Carga', 'Rotterdam, Holanda', 'Rio de Janeiro, Brasil', '2025-09-10', '2025-10-05', 'OOCL Europe', 'OOCL789012', 1800.00, 1);

-- Inserir follow-up de exemplo
INSERT IGNORE INTO follow_up (referencia, tipo_referencia, status_atual, proxima_acao, responsavel, data_prevista, prioridade, usuario_atualizacao_id) VALUES
('OC-2025-001', 'OrdemCompra', 'Aguardando entrega', 'Acompanhar transporte', 'João Silva', '2025-09-16', 'Alta', 1),
('REQ-2025-001', 'Requisicao', 'Aprovada - aguardando compra', 'Emitir ordem de compra', 'Maria Santos', '2025-09-10', 'Alta', 1),
('CONT-2025-001', 'Container', 'Em trânsito', 'Acompanhar documentação de importação', 'Pedro Oliveira', '2025-09-18', 'Média', 1);

-- =====================================================
-- ATUALIZAR VALORES CALCULADOS
-- =====================================================

-- Atualizar quantidades disponíveis no estoque
UPDATE estoque SET quantidade_disponivel = quantidade_atual - quantidade_reservada;

-- Atualizar valores totais das ordens (os triggers devem fazer isso, mas vamos garantir)
UPDATE ordens_compra SET valor_total = (
    SELECT COALESCE(SUM(valor_total), 0)
    FROM itens_ordem_compra
    WHERE ordem_id = ordens_compra.id
);

-- Atualizar valores totais das proformas
UPDATE proformas SET valor_total = (
    SELECT COALESCE(SUM(valor_total), 0)
    FROM itens_proforma
    WHERE proforma_id = proformas.id
);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'Dados de exemplo inseridos com sucesso!' as status;
SELECT
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM fornecedores) as fornecedores,
    (SELECT COUNT(*) FROM skus) as skus,
    (SELECT COUNT(*) FROM ordens_compra) as ordens_compra,
    (SELECT COUNT(*) FROM requisicoes) as requisicoes,
    (SELECT COUNT(*) FROM proformas) as proformas,
    (SELECT COUNT(*) FROM containers) as containers;
