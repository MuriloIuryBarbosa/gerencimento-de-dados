-- Script simplificado para adicionar funcionalidades de administração
USE datalake;

-- Verificar se as tabelas existem e criar apenas se necessário
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'datalake' AND table_name = 'empresas');

-- Criar tabelas apenas se não existirem
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

CREATE TABLE IF NOT EXISTS permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Inserir permissões padrão apenas se não existirem
INSERT IGNORE INTO permissoes (nome, descricao, categoria) VALUES
('admin.usuarios', 'Gerenciar usuários do sistema', 'Sistema'),
('admin.tabelas', 'Criar e gerenciar tabelas dinâmicas', 'Sistema'),
('cadastro.fornecedores', 'Gerenciar fornecedores', 'Cadastro'),
('cadastro.clientes', 'Gerenciar clientes', 'Cadastro'),
('ordens.compra', 'Gerenciar ordens de compra', 'Ordens');

-- Empresa padrão
INSERT IGNORE INTO empresas (id, nome) VALUES (1, 'Empresa Padrão');

COMMIT;
