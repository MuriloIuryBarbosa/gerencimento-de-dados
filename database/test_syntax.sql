-- Script de teste de sintaxe SQL
-- Este script testa apenas a sintaxe básica dos comandos mais importantes

-- Teste de criação de tabelas básicas
CREATE TABLE IF NOT EXISTS test_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    ativo BOOLEAN DEFAULT TRUE
);

-- Teste de criação de views
CREATE OR REPLACE VIEW vw_test_dashboard AS
SELECT
    COUNT(*) as total_registros,
    CURDATE() as data_atual
FROM test_usuarios;

-- Teste de triggers
DELIMITER //

CREATE TRIGGER IF NOT EXISTS trg_test_update
AFTER INSERT ON test_usuarios
FOR EACH ROW
BEGIN
    UPDATE test_fornecedores SET ativo = TRUE WHERE id = 1;
END//

DELIMITER ;

-- Limpeza
DROP TABLE IF EXISTS test_usuarios;
DROP TABLE IF EXISTS test_fornecedores;
DROP VIEW IF EXISTS vw_test_dashboard;

SELECT 'Sintaxe SQL validada com sucesso!' as resultado;
