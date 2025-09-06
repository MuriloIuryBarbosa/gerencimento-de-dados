# Database Scripts

Esta pasta contém todos os scripts SQL necessários para criar e configurar o banco de dados do sistema de gerenciamento de dados.

## Scripts Disponíveis

### 1. `setup_complete_database.sql` - Script Completo
**Propósito**: Cria todo o ambiente do banco de dados de uma vez
**Conteúdo**:
- Criação do schema `datalake`
- Todas as tabelas do sistema
- Índices para performance
- Dados iniciais (usuário admin, cores básicas)
- Views para dashboards
- Triggers para manutenção automática

### 2. `sample_data.sql` - Dados de Exemplo
**Propósito**: Popula o banco com dados fictícios para testes
**Conteúdo**:
- Fornecedores, SKUs, preços e estoques
- Ordens de compra, requisições e proformas
- Containers e follow-up logístico
- Valores calculados automaticamente

### 3. `create_ordens_compra.sql` - Módulo Específico
**Propósito**: Cria apenas as tabelas relacionadas a ordens de compra
**Uso**: Para implementações parciais ou testes específicos

### 4. `database_config.env` - Configuração de Conexão
**Propósito**: Arquivo de configuração com parâmetros de conexão
**Conteúdo**:
- Configurações de host, porta, usuário e senha
- Exemplos de conexão em diferentes linguagens
- Comandos de backup e monitoramento

### 5. `verify_database.sql` - Script de Verificação
**Propósito**: Verifica se o banco foi criado corretamente
**Conteúdo**:
- Contagem de registros por tabela
- Verificação de índices e views
- Teste de integridade referencial
- Relatório final de status

## Como Executar

### Opção 1: Ambiente Completo (Recomendado)
```bash
# 1. Criar estrutura completa
mysql -u root -p < setup_complete_database.sql

# 2. Opcional: Inserir dados de exemplo
mysql -u root -p < sample_data.sql

# 3. Verificar se tudo foi criado corretamente
mysql -u root -p < verify_database.sql
```

### Opção 2: Scripts Individuais
```bash
mysql -u root -p < create_ordens_compra.sql
# Execute outros scripts conforme necessário
```

### Verificação
Após executar, você pode verificar se tudo foi criado:
```sql
USE datalake;
SHOW TABLES;
SELECT COUNT(*) as total_skus FROM skus;
SELECT COUNT(*) as total_ordens FROM ordens_compra;
```

## Estrutura das Tabelas Criadas

### Tabelas Principais
- **usuarios**: Controle de usuários do sistema
- **fornecedores**: Cadastro de fornecedores
- **ordens_compra**: Ordens de compra
- **itens_ordem_compra**: Itens das ordens
- **skus**: Gestão de SKUs
- **precos**: Controle de preços
- **estoque**: Controle de estoque
- **movimentacoes_estoque**: Histórico de movimentações
- **cores**: Cadastro de cores
- **proformas**: Proformas comerciais
- **itens_proforma**: Itens das proformas
- **requisicoes**: Requisições internas
- **itens_requisicao**: Itens das requisições
- **containers**: Controle de contêineres
- **follow_up**: Acompanhamento logístico
- **logs_atividade**: Auditoria do sistema

### Views
- **vw_dashboard_ordens**: Dados para dashboard de ordens
- **vw_dashboard_estoque**: Dados para dashboard de estoque

### Índices
- Índices otimizados para as consultas mais comuns
- Índices compostos para filtros complexos

## Dados Iniciais

### Usuário Administrador
- **Email**: admin@sistema.com
- **Senha**: password
- **Cargo**: Administrador

### Cores Básicas
- Branco, Preto, Vermelho, Azul, Verde, Amarelo

## Triggers Implementados

1. **trg_update_ordem_total**: Atualiza valor total da ordem quando itens são modificados
2. **trg_update_ordem_total_update**: Mantém consistência do valor total
3. **trg_update_estoque_disponivel**: Calcula quantidade disponível automaticamente

## Configurações do Banco

- **Charset**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Engine**: InnoDB (padrão)

## Próximos Passos

1. Execute o script no servidor MySQL/MariaDB
2. Configure as conexões nas aplicações
3. Teste as funcionalidades
4. Ajuste permissões conforme necessário

## Suporte

Para dúvidas sobre a estrutura do banco, consulte este documento ou os comentários no código SQL.
