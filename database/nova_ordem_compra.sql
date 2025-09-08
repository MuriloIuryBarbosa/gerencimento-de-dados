-- =====================================================
-- NOVA TABELA ORDEM_COMPRA COM CAMPOS COMPLETOS
-- =====================================================

-- Dropar tabelas existentes se existirem
DROP TABLE IF EXISTS itens_ordem_compra;
DROP TABLE IF EXISTS ordens_compra;

-- Tabela principal para Ordens de Compra
CREATE TABLE ordens_compra (
    id VARCHAR(20) PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'Rascunho',
    status_pi VARCHAR(50) DEFAULT 'Pendente',

    -- Informações da Empresa
    empresa_id INT,
    empresa_nome VARCHAR(255),

    -- Informações do Produto
    uneg VARCHAR(100),
    familia_codigo VARCHAR(50),
    familia_nome VARCHAR(255),
    produto_descricao TEXT,
    cod_tamanho VARCHAR(50),

    -- Informações da OC
    observacao TEXT,
    capacidade_container VARCHAR(100),
    planejado_compra INT,
    etd_target DATE,
    week_etd VARCHAR(20),
    transit_time INT,
    lead_time INT,
    factory_date DATE,
    week_factory VARCHAR(20),
    date_of_sale DATE,
    prop_cont VARCHAR(100),
    original_total_value DECIMAL(15,2),
    cost_in_dollars DECIMAL(15,2),
    total_value_dollars_item DECIMAL(15,2),
    total_value_dollars_uc DECIMAL(15,2),

    -- Informações da Proforma Invoice (PI)
    pi_numero VARCHAR(50),
    pi_date DATE,
    pi_country VARCHAR(100),
    pi_supplier VARCHAR(255),
    pi_obs TEXT,
    pi_original_currency VARCHAR(10),
    pi_original_cost DECIMAL(15,2),

    -- Totais e Quantidades
    total_containers INT DEFAULT 0,

    -- Informações do Usuário
    usuario_criador_id INT,
    usuario_criador_nome VARCHAR(255),
    compartilhado_com TEXT, -- JSON array com IDs dos usuários que podem ver

    -- Controle de Versão
    versao INT DEFAULT 1,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,

    -- Índices para performance
    INDEX idx_status (status),
    INDEX idx_empresa (empresa_id),
    INDEX idx_usuario (usuario_criador_id),
    INDEX idx_data_criacao (data_criacao),
    INDEX idx_deleted (deleted)
);

-- Tabela para Itens da Ordem de Compra (se necessário para múltiplos itens)
CREATE TABLE IF NOT EXISTS itens_ordem_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id VARCHAR(20) NOT NULL,
    sku VARCHAR(100),
    cor_nome VARCHAR(100),
    cor_hex VARCHAR(7),
    quantidade INT NOT NULL DEFAULT 1,
    valor_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ordem_id) REFERENCES ordens_compra(id) ON DELETE CASCADE,
    INDEX idx_ordem (ordem_id),
    INDEX idx_sku (sku)
);

-- Tabela para histórico de alterações
CREATE TABLE IF NOT EXISTS ordens_compra_historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id VARCHAR(20) NOT NULL,
    usuario_id INT,
    usuario_nome VARCHAR(255),
    acao VARCHAR(100), -- 'criado', 'atualizado', 'aprovado', 'compartilhado', etc.
    campo_alterado VARCHAR(100),
    valor_anterior TEXT,
    valor_novo TEXT,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ordem_id) REFERENCES ordens_compra(id) ON DELETE CASCADE,
    INDEX idx_ordem_historico (ordem_id),
    INDEX idx_usuario_historico (usuario_id),
    INDEX idx_data_historico (data_alteracao)
);

-- =====================================================
-- INSERIR DADOS DE TESTE
-- =====================================================

INSERT INTO ordens_compra (
    id, status, empresa_nome, uneg, familia_codigo, produto_descricao,
    planejado_compra, etd_target, pi_numero, pi_date, pi_country,
    usuario_criador_nome, data_criacao
) VALUES
('OC-2025-001', 'Rascunho', 'Empresa ABC Ltda', 'UNEG001', 'FAM001', 'Produto de Teste',
 1000, '2025-02-15', 'PI-2025-001', '2025-01-20', 'China',
 'Administrador', NOW()),

('OC-2025-002', 'Aprovado', 'Empresa XYZ S.A.', 'UNEG002', 'FAM002', 'Outro Produto',
 500, '2025-03-01', 'PI-2025-002', '2025-01-25', 'Vietnã',
 'João Silva', NOW());

-- =====================================================
-- COMENTÁRIOS SOBRE OS CAMPOS
-- =====================================================
/*
Campos de OC (Ordem de Compra):
- empresa_id/empresa_nome: Empresa solicitante
- uneg: Unidade de Negócio
- familia_codigo/familia_nome: Família do produto
- produto_descricao: Descrição completa
- cod_tamanho: Código do tamanho
- observacao: Observações da OC
- capacidade_container: Capacidade do container
- planejado_compra: Quantidade planejada
- etd_target: Data alvo ETD
- week_etd: Semana ETD
- transit_time: Tempo de trânsito
- lead_time: Tempo de lead
- factory_date: Data da fábrica
- week_factory: Semana da fábrica
- date_of_sale: Data de venda
- prop_cont: Proposta de container
- original_total_value: Valor total original
- cost_in_dollars: Custo em dólares
- total_value_dollars_item: Valor total em dólares por item
- total_value_dollars_uc: Valor total em dólares da UC

Campos de PI (Proforma Invoice):
- pi_numero: Número da PI
- pi_date: Data da PI
- pi_country: País da PI
- pi_supplier: Fornecedor da PI
- pi_obs: Observações da PI
- pi_original_currency: Moeda original da PI
- pi_original_cost: Custo original da PI

Campos de Controle:
- status: Status da OC (Rascunho, Aprovado, etc.)
- status_pi: Status da PI
- usuario_criador_id/nome: Quem criou
- compartilhado_com: JSON com usuários que podem ver
- versao: Controle de versão
- deleted: Soft delete
*/
