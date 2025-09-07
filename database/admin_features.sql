-- Script para adicionar funcionalidades de administração avançada
-- Este script adiciona as novas tabelas sem afetar as existentes

USE datalake;

-- =====================================================
-- TABELA DE EMPRESAS
-- =====================================================

CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    dominio VARCHAR(255),
    logo VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_nome (nome),
    UNIQUE KEY unique_cnpj (cnpj),
    UNIQUE KEY unique_dominio (dominio)
);

-- =====================================================
-- TABELA DE PERMISSÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE USUÁRIOS PERMISSÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios_permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    permissao_id INT NOT NULL,
    concedido_por INT NOT NULL,
    data_concessao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (permissao_id) REFERENCES permissoes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_permissao (usuario_id, permissao_id)
);

-- =====================================================
-- TABELA DE PERMISSÕES POR EMPRESA
-- =====================================================

CREATE TABLE IF NOT EXISTS permissoes_empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    permissao_id INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (permissao_id) REFERENCES permissoes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_empresa_permissao (empresa_id, permissao_id)
);

-- =====================================================
-- TABELA DE TABELAS DINÂMICAS
-- =====================================================

CREATE TABLE IF NOT EXISTS tabelas_dinamicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    empresa_id INT NOT NULL,
    criado_por INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE CAMPOS DINÂMICOS
-- =====================================================

CREATE TABLE IF NOT EXISTS campos_dinamicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabela_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    tamanho INT,
    obrigatorio BOOLEAN DEFAULT FALSE,
    unico BOOLEAN DEFAULT FALSE,
    valor_padrao VARCHAR(500),
    opcoes TEXT, -- JSON para opções de SELECT
    ordem INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tabela_id) REFERENCES tabelas_dinamicas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tabela_campo (tabela_id, nome)
);

-- =====================================================
-- TABELA DE REGISTROS DINÂMICOS
-- =====================================================

CREATE TABLE IF NOT EXISTS registros_dinamicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabela_id INT NOT NULL,
    dados LONGTEXT NOT NULL, -- JSON com os valores dos campos
    criado_por INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tabela_id) REFERENCES tabelas_dinamicas(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA DE LOGS DO SISTEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS logs_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao VARCHAR(50) NOT NULL,
    entidade VARCHAR(100) NOT NULL,
    entidade_id INT,
    descricao TEXT,
    dados_antes LONGTEXT, -- JSON
    dados_depois LONGTEXT, -- JSON
    ip VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =====================================================
-- INSERIR PERMISSÕES PADRÃO
-- =====================================================

INSERT IGNORE INTO permissoes (nome, descricao, categoria) VALUES
('admin.usuarios', 'Gerenciar usuários do sistema', 'Sistema'),
('admin.empresas', 'Gerenciar empresas', 'Sistema'),
('admin.permissoes', 'Gerenciar permissões', 'Sistema'),
('admin.tabelas', 'Criar e gerenciar tabelas dinâmicas', 'Sistema'),
('admin.logs', 'Visualizar logs do sistema', 'Sistema'),
('admin.config', 'Configurações avançadas do sistema', 'Sistema'),
('cadastro.fornecedores', 'Gerenciar fornecedores', 'Cadastro'),
('cadastro.clientes', 'Gerenciar clientes', 'Cadastro'),
('cadastro.transportadoras', 'Gerenciar transportadoras', 'Cadastro'),
('cadastro.cores', 'Gerenciar cores', 'Cadastro'),
('cadastro.skus', 'Gerenciar SKUs', 'Cadastro'),
('cadastro.representantes', 'Gerenciar representantes', 'Cadastro'),
('ordens.compra', 'Gerenciar ordens de compra', 'Ordens'),
('ordens.proformas', 'Gerenciar proformas', 'Ordens'),
('ordens.requisicoes', 'Gerenciar requisições', 'Ordens'),
('relatorios.view', 'Visualizar relatórios', 'Relatórios'),
('relatorios.export', 'Exportar relatórios', 'Relatórios'),
('dashboard.view', 'Visualizar dashboard', 'Dashboard');

-- =====================================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para logs_sistema
CREATE INDEX idx_logs_sistema_usuario ON logs_sistema(usuario_id);
CREATE INDEX idx_logs_sistema_acao ON logs_sistema(acao);
CREATE INDEX idx_logs_sistema_entidade ON logs_sistema(entidade, entidade_id);
CREATE INDEX idx_logs_sistema_data ON logs_sistema(created_at);

-- Índices para tabelas dinâmicas
CREATE INDEX idx_tabelas_dinamicas_empresa ON tabelas_dinamicas(empresa_id);
CREATE INDEX idx_campos_dinamicos_tabela ON campos_dinamicos(tabela_id);
CREATE INDEX idx_registros_dinamicos_tabela ON registros_dinamicos(tabela_id);

-- =====================================================
-- EMPRESA PADRÃO (PARA SISTEMAS EXISTENTES)
-- =====================================================

INSERT IGNORE INTO empresas (id, nome, cnpj, dominio) VALUES
(1, 'Empresa Padrão', NULL, NULL);

-- Atualizar usuários existentes para pertencer à empresa padrão
UPDATE usuarios SET empresa_id = 1 WHERE empresa_id IS NULL;

COMMIT;
