-- Tabela para Ordens de Compra
CREATE TABLE IF NOT EXISTS ordens_compra (
    id VARCHAR(20) PRIMARY KEY,
    fornecedor VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    condicao_pagamento VARCHAR(255),
    prazo_entrega DATE,
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'Pendente Aprovação',
    prioridade VARCHAR(20) DEFAULT 'Média',
    data_emissao DATE DEFAULT (CURDATE()),
    valor_total DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para Itens da Ordem de Compra
CREATE TABLE IF NOT EXISTS itens_ordem_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id VARCHAR(20) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    unidade VARCHAR(10) DEFAULT 'un',
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ordem_id) REFERENCES ordens_compra(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_ordens_status ON ordens_compra(status);
CREATE INDEX idx_ordens_fornecedor ON ordens_compra(fornecedor);
CREATE INDEX idx_ordens_data_emissao ON ordens_compra(data_emissao);
CREATE INDEX idx_itens_ordem ON itens_ordem_compra(ordem_id);
