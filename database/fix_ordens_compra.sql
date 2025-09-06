-- Script SQL correto para criar tabela ordens_compra compatível com MySQL
-- Este script usa CURDATE() em vez de CURRENT_DATE para compatibilidade

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

-- Adicionar índices para melhor performance
CREATE INDEX idx_ordens_status ON ordens_compra(status);
CREATE INDEX idx_ordens_fornecedor ON ordens_compra(fornecedor);
CREATE INDEX idx_ordens_data_emissao ON ordens_compra(data_emissao);

SELECT 'Tabela ordens_compra criada com sucesso!' as status;
