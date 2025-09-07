-- Script SQL para popular permissões iniciais do sistema
-- Execute este script após aplicar as migrações do admin

USE datalake;

-- Inserir permissões básicas do sistema apenas se não existirem
INSERT IGNORE INTO permissoes (nome, descricao, categoria, ativo, createdAt) VALUES
-- Sistema
('admin.full_access', 'Acesso completo ao sistema administrativo', 'Sistema', 1, NOW()),
('system.view_logs', 'Visualizar logs do sistema', 'Sistema', 1, NOW()),
('system.manage_settings', 'Gerenciar configurações do sistema', 'Sistema', 1, NOW()),

-- Usuários
('users.view', 'Visualizar usuários', 'Usuários', 1, NOW()),
('users.create', 'Criar novos usuários', 'Usuários', 1, NOW()),
('users.edit', 'Editar usuários existentes', 'Usuários', 1, NOW()),
('users.delete', 'Excluir usuários', 'Usuários', 1, NOW()),
('users.manage_permissions', 'Gerenciar permissões de usuários', 'Usuários', 1, NOW()),

-- Empresas
('companies.view', 'Visualizar empresas', 'Empresas', 1, NOW()),
('companies.create', 'Criar novas empresas', 'Empresas', 1, NOW()),
('companies.edit', 'Editar empresas existentes', 'Empresas', 1, NOW()),
('companies.delete', 'Excluir empresas', 'Empresas', 1, NOW()),

-- Tabelas Dinâmicas
('tables.view', 'Visualizar tabelas dinâmicas', 'Tabelas', 1, NOW()),
('tables.create', 'Criar novas tabelas dinâmicas', 'Tabelas', 1, NOW()),
('tables.edit', 'Editar tabelas dinâmicas', 'Tabelas', 1, NOW()),
('tables.delete', 'Excluir tabelas dinâmicas', 'Tabelas', 1, NOW()),
('tables.manage_data', 'Gerenciar dados das tabelas', 'Tabelas', 1, NOW()),

-- Relatórios
('reports.view', 'Visualizar relatórios', 'Relatórios', 1, NOW()),
('reports.create', 'Criar novos relatórios', 'Relatórios', 1, NOW()),
('reports.export', 'Exportar relatórios', 'Relatórios', 1, NOW()),

-- Requisições
('requests.view', 'Visualizar requisições', 'Requisições', 1, NOW()),
('requests.create', 'Criar novas requisições', 'Requisições', 1, NOW()),
('requests.approve', 'Aprovar requisições', 'Requisições', 1, NOW()),
('requests.reject', 'Rejeitar requisições', 'Requisições', 1, NOW()),

-- Ordens de Compra
('orders.view', 'Visualizar ordens de compra', 'Ordens', 1, NOW()),
('orders.create', 'Criar novas ordens de compra', 'Ordens', 1, NOW()),
('orders.edit', 'Editar ordens de compra', 'Ordens', 1, NOW()),
('orders.approve', 'Aprovar ordens de compra', 'Ordens', 1, NOW()),

-- Estoque
('inventory.view', 'Visualizar estoque', 'Estoque', 1, NOW()),
('inventory.manage', 'Gerenciar movimentações de estoque', 'Estoque', 1, NOW()),
('inventory.adjust', 'Ajustar níveis de estoque', 'Estoque', 1, NOW()),

-- Proformas
('proformas.view', 'Visualizar proformas', 'Proformas', 1, NOW()),
('proformas.create', 'Criar novas proformas', 'Proformas', 1, NOW()),
('proformas.edit', 'Editar proformas', 'Proformas', 1, NOW()),
('proformas.approve', 'Aprovar proformas', 'Proformas', 1, NOW());

COMMIT;
