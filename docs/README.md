# Documentação do Projeto

Esta pasta contém toda a documentação relacionada ao projeto de gerenciamento de dados.

## Arquivos

### `lembretes.txt`
- Lista de funcionalidades a serem implementadas
- Roadmap de desenvolvimento
- Ideias e melhorias pendentes

### `lembretes_2.txt`
- Especificações detalhadas de UX/UI
- Requisitos funcionais por módulo
- Fluxos de trabalho e processos

### `mysql-setup.md`
- Instruções de configuração do MySQL
- Scripts de migração
- Configuração do ambiente de banco de dados

## Scripts

Os scripts de automação estão localizados na pasta `scripts/`:
- `migrate-to-mysql.bat` - Script de migração para MySQL

## Banco de Dados

Scripts SQL estão na pasta `database/`:
- `setup_complete_database.sql` - Criação completa do banco
- `sample_data.sql` - Dados de exemplo
- `verify_database.sql` - Verificação da estrutura

## Como Usar

1. Para configurar o ambiente, consulte `mysql-setup.md`
2. Para executar migrações, use `scripts/migrate-to-mysql.bat`
3. Para dados de exemplo, execute `database/sample_data.sql`
4. Para verificar a integridade, use `database/verify_database.sql`
