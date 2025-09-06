-- Script completo para criação do banco de dados DATALAKE
-- Sistema de Gerenciamento de Dados
-- Data: 2025-09-05

-- =====================================================
-- CRIAÇÃO DO SCHEMA
-- =====================================================

CREATE DATABASE IF NOT EXISTS datalake
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE datalake;

-- =====================================================
-- TABELA DE USUÁRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_acesso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE FORNECEDORES
-- =====================================================

CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    contato_principal VARCHAR(255),
    condicoes_pagamento VARCHAR(255),
    prazo_entrega_padrao INT, -- em dias
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE ORDENS DE COMPRA
-- =====================================================

CREATE TABLE IF NOT EXISTS ordens_compra (
    id VARCHAR(20) PRIMARY KEY,
    fornecedor_id INT,
    usuario_criador_id INT,
    data_emissao DATE DEFAULT (CURDATE()),
    prazo_entrega DATE,
    condicao_pagamento VARCHAR(255),
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'Pendente Aprovação',
    prioridade VARCHAR(20) DEFAULT 'Média',
    valor_total DECIMAL(15,2) DEFAULT 0.00,
    data_aprovacao TIMESTAMP NULL,
    usuario_aprovador_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (usuario_criador_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_aprovador_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE ITENS DA ORDEM DE COMPRA
-- =====================================================

CREATE TABLE IF NOT EXISTS itens_ordem_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id VARCHAR(20) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    unidade VARCHAR(10) DEFAULT 'un',
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    sku VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ordem_id) REFERENCES ordens_compra(id) ON DELETE CASCADE
);

-- =====================================================
-- TABELA DE SKUs
-- =====================================================

CREATE TABLE IF NOT EXISTS skus (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    unidade_medida VARCHAR(10) DEFAULT 'un',
    peso DECIMAL(10,3),
    dimensoes VARCHAR(100), -- formato: LxAxP
    cor VARCHAR(50),
    tamanho VARCHAR(50),
    material VARCHAR(100),
    fornecedor_principal_id INT,
    custo_unitario DECIMAL(10,2),
    preco_venda DECIMAL(10,2),
    margem_lucro DECIMAL(5,2),
    estoque_minimo INT DEFAULT 0,
    estoque_maximo INT,
    localizacao_estoque VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_principal_id) REFERENCES fornecedores(id)
);

-- =====================================================
-- TABELA DE PREÇOS
-- =====================================================

CREATE TABLE IF NOT EXISTS precos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku_id VARCHAR(50) NOT NULL,
    preco_custo DECIMAL(10,2),
    preco_venda DECIMAL(10,2),
    margem_lucro DECIMAL(5,2),
    moeda VARCHAR(3) DEFAULT 'BRL',
    data_inicio_vigencia DATE DEFAULT (CURDATE()),
    data_fim_vigencia DATE,
    tipo_preco VARCHAR(50) DEFAULT 'Padrão', -- Padrão, Promocional, etc.
    usuario_alteracao_id INT,
    motivo_alteracao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (usuario_alteracao_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE ESTOQUE
-- =====================================================

CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku_id VARCHAR(50) NOT NULL,
    quantidade_atual INT DEFAULT 0,
    quantidade_reservada INT DEFAULT 0,
    quantidade_disponivel INT DEFAULT 0,
    localizacao VARCHAR(100),
    lote VARCHAR(50),
    data_validade DATE,
    data_ultima_entrada TIMESTAMP,
    data_ultima_saida TIMESTAMP,
    custo_medio DECIMAL(10,2),
    valor_total_estoque DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'Disponível', -- Disponível, Reservado, Bloqueado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    UNIQUE KEY unique_sku_local (sku_id, localizacao)
);

-- =====================================================
-- TABELA DE MOVIMENTAÇÕES DE ESTOQUE
-- =====================================================

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku_id VARCHAR(50) NOT NULL,
    tipo_movimentacao VARCHAR(20) NOT NULL, -- Entrada, Saída, Ajuste
    quantidade INT NOT NULL,
    quantidade_anterior INT,
    quantidade_atual INT,
    localizacao VARCHAR(100),
    lote VARCHAR(50),
    documento_referencia VARCHAR(50), -- OC-2025-001, REQ-2025-001, etc.
    custo_unitario DECIMAL(10,2),
    valor_total DECIMAL(15,2),
    motivo TEXT,
    usuario_id INT,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE CORES
-- =====================================================

CREATE TABLE IF NOT EXISTS cores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo_hex VARCHAR(7),
    codigo_pantone VARCHAR(20),
    descricao TEXT,
    categoria VARCHAR(50), -- Básica, Especial, etc.
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE PROFORMAS
-- =====================================================

CREATE TABLE IF NOT EXISTS proformas (
    id VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    cliente VARCHAR(255),
    fornecedor_id INT,
    data_emissao DATE DEFAULT (CURDATE()),
    data_validade DATE,
    moeda VARCHAR(3) DEFAULT 'BRL',
    valor_total DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Rascunho',
    observacoes TEXT,
    usuario_criador_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (usuario_criador_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE ITENS DA PROFORMA
-- =====================================================

CREATE TABLE IF NOT EXISTS itens_proforma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proforma_id VARCHAR(20) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    unidade VARCHAR(10) DEFAULT 'un',
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    sku_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proforma_id) REFERENCES proformas(id) ON DELETE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES skus(id)
);

-- =====================================================
-- TABELA DE REQUISIÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS requisicoes (
    id VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) DEFAULT 'Material', -- Material, Serviço, etc.
    prioridade VARCHAR(20) DEFAULT 'Média',
    status VARCHAR(50) DEFAULT 'Pendente',
    departamento_solicitante VARCHAR(100),
    usuario_solicitante_id INT,
    data_necessidade DATE,
    data_aprovacao TIMESTAMP NULL,
    usuario_aprovador_id INT,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_solicitante_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_aprovador_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE ITENS DA REQUISIÇÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS itens_requisicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requisicao_id VARCHAR(20) NOT NULL,
    sku_id VARCHAR(50),
    descricao VARCHAR(255) NOT NULL,
    quantidade_solicitada INT NOT NULL,
    quantidade_aprovada INT,
    unidade VARCHAR(10) DEFAULT 'un',
    justificativa TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requisicao_id) REFERENCES requisicoes(id) ON DELETE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES skus(id)
);

-- =====================================================
-- TABELA DE CONTÊINERES
-- =====================================================

CREATE TABLE IF NOT EXISTS containers (
    id VARCHAR(20) PRIMARY KEY,
    numero_container VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(50), -- 20ft, 40ft, etc.
    status VARCHAR(50) DEFAULT 'Aguardando Carga',
    origem VARCHAR(100),
    destino VARCHAR(100),
    data_embarque DATE,
    data_chegada_prevista DATE,
    data_chegada_real DATE,
    navio VARCHAR(100),
    booking_number VARCHAR(50),
    valor_frete DECIMAL(10,2),
    moeda_frete VARCHAR(3) DEFAULT 'USD',
    observacoes TEXT,
    usuario_responsavel_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_responsavel_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE FOLLOW-UP LOGÍSTICO
-- =====================================================

CREATE TABLE IF NOT EXISTS follow_up (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referencia VARCHAR(50) NOT NULL, -- OC-2025-001, REQ-2025-001, etc.
    tipo_referencia VARCHAR(20) NOT NULL, -- OrdemCompra, Requisicao, etc.
    status_atual VARCHAR(100),
    proxima_acao VARCHAR(255),
    responsavel VARCHAR(255),
    data_prevista DATE,
    data_conclusao DATE,
    prioridade VARCHAR(20) DEFAULT 'Média',
    observacoes TEXT,
    usuario_atualizacao_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_atualizacao_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE LOGS DE ATIVIDADE
-- =====================================================

CREATE TABLE IF NOT EXISTS logs_atividade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao VARCHAR(255) NOT NULL,
    entidade VARCHAR(50), -- usuarios, ordens_compra, etc.
    entidade_id VARCHAR(50),
    descricao TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para ordens_compra
CREATE INDEX idx_ordens_status ON ordens_compra(status);
CREATE INDEX idx_ordens_fornecedor ON ordens_compra(fornecedor_id);
CREATE INDEX idx_ordens_data_emissao ON ordens_compra(data_emissao);
CREATE INDEX idx_ordens_prioridade ON ordens_compra(prioridade);

-- Índices para itens_ordem_compra
CREATE INDEX idx_itens_ordem ON itens_ordem_compra(ordem_id);
CREATE INDEX idx_itens_sku ON itens_ordem_compra(sku);

-- Índices para skus
CREATE INDEX idx_skus_categoria ON skus(categoria);
CREATE INDEX idx_skus_fornecedor ON skus(fornecedor_principal_id);
CREATE INDEX idx_skus_ativo ON skus(ativo);

-- Índices para precos
CREATE INDEX idx_precos_sku ON precos(sku_id);
CREATE INDEX idx_precos_vigencia ON precos(data_inicio_vigencia, data_fim_vigencia);

-- Índices para estoque
CREATE INDEX idx_estoque_sku ON estoque(sku_id);
CREATE INDEX idx_estoque_status ON estoque(status);
CREATE INDEX idx_estoque_localizacao ON estoque(localizacao);

-- Índices para movimentacoes_estoque
CREATE INDEX idx_mov_data ON movimentacoes_estoque(data_movimentacao);
CREATE INDEX idx_mov_tipo ON movimentacoes_estoque(tipo_movimentacao);
CREATE INDEX idx_mov_documento ON movimentacoes_estoque(documento_referencia);

-- Índices para requisicoes
CREATE INDEX idx_requisicoes_status ON requisicoes(status);
CREATE INDEX idx_requisicoes_tipo ON requisicoes(tipo);
CREATE INDEX idx_requisicoes_solicitante ON requisicoes(usuario_solicitante_id);

-- Índices para containers
CREATE INDEX idx_containers_status ON containers(status);
CREATE INDEX idx_containers_destino ON containers(destino);

-- Índices para follow_up
CREATE INDEX idx_follow_referencia ON follow_up(referencia, tipo_referencia);
CREATE INDEX idx_follow_status ON follow_up(status_atual);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir usuário administrador
INSERT IGNORE INTO usuarios (nome, email, senha, cargo, departamento, ativo)
VALUES ('Administrador', 'admin@sistema.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'TI', TRUE);
-- Senha: password (bcrypt hash)

-- Inserir algumas cores básicas
INSERT IGNORE INTO cores (nome, codigo_hex, categoria) VALUES
('Branco', '#FFFFFF', 'Básica'),
('Preto', '#000000', 'Básica'),
('Vermelho', '#FF0000', 'Básica'),
('Azul', '#0000FF', 'Básica'),
('Verde', '#00FF00', 'Básica'),
('Amarelo', '#FFFF00', 'Básica');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para dashboard de ordens
CREATE OR REPLACE VIEW vw_dashboard_ordens AS
SELECT
    COUNT(*) as total_ordens,
    SUM(CASE WHEN status = 'Pendente Aprovação' THEN 1 ELSE 0 END) as pendentes_aprovacao,
    SUM(CASE WHEN status = 'Aprovada' THEN 1 ELSE 0 END) as aprovadas,
    SUM(CASE WHEN status = 'Prazo Estourado' THEN 1 ELSE 0 END) as prazo_estourado,
    SUM(valor_total) as valor_total_ordens
FROM ordens_compra
WHERE MONTH(created_at) = MONTH(CURDATE())
  AND YEAR(created_at) = YEAR(CURDATE());

-- View para dashboard de estoque
CREATE OR REPLACE VIEW vw_dashboard_estoque AS
SELECT
    COUNT(DISTINCT sku_id) as total_skus,
    SUM(quantidade_atual) as quantidade_total,
    SUM(valor_total_estoque) as valor_total_estoque,
    SUM(CASE WHEN quantidade_atual <= estoque_minimo THEN 1 ELSE 0 END) as skus_baixo_estoque
FROM estoque e
JOIN skus s ON e.sku_id = s.id
WHERE s.ativo = TRUE;

-- =====================================================
-- TRIGGERS PARA MANUTENÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para atualizar valor_total da ordem quando itens são modificados
DELIMITER //

CREATE TRIGGER IF NOT EXISTS trg_update_ordem_total
AFTER INSERT ON itens_ordem_compra
FOR EACH ROW
BEGIN
    UPDATE ordens_compra
    SET valor_total = (
        SELECT SUM(valor_total)
        FROM itens_ordem_compra
        WHERE ordem_id = NEW.ordem_id
    )
    WHERE id = NEW.ordem_id;
END//

CREATE TRIGGER IF NOT EXISTS trg_update_ordem_total_update
AFTER UPDATE ON itens_ordem_compra
FOR EACH ROW
BEGIN
    UPDATE ordens_compra
    SET valor_total = (
        SELECT SUM(valor_total)
        FROM itens_ordem_compra
        WHERE ordem_id = NEW.ordem_id
    )
    WHERE id = NEW.ordem_id;
END//

-- Trigger para atualizar quantidade disponível no estoque
CREATE TRIGGER IF NOT EXISTS trg_update_estoque_disponivel
AFTER UPDATE ON estoque
FOR EACH ROW
BEGIN
    UPDATE estoque
    SET quantidade_disponivel = quantidade_atual - quantidade_reservada
    WHERE id = NEW.id;
END//

DELIMITER ;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 'Database DATALAKE criado com sucesso!' as status;
