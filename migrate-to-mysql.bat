@echo off
echo === VERIFICANDO MYSQL ===
mysql --version
if %errorlevel% neq 0 (
    echo ERRO: MySQL não está instalado ou não está no PATH
    echo Execute o arquivo mysql-setup.md para instruções de instalação
    pause
    exit /b 1
)

echo === TESTANDO CONEXÃO MYSQL ===
mysql -u root -ppassword -e "SELECT 'MySQL OK' as status;"
if %errorlevel% neq 0 (
    echo ERRO: Não foi possível conectar ao MySQL
    echo Verifique se o MySQL está rodando e as credenciais estão corretas
    pause
    exit /b 1
)

echo === CRIANDO BANCO DE DADOS ===
mysql -u root -ppassword -e "CREATE DATABASE IF NOT EXISTS datalake CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar banco de dados
    pause
    exit /b 1
)

echo === GERANDO CLIENTE PRISMA ===
npx prisma generate
if %errorlevel% neq 0 (
    echo ERRO: Falha ao gerar cliente Prisma
    pause
    exit /b 1
)

echo === CRIANDO MIGRAÇÕES ===
npx prisma migrate dev --name init_mysql
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar migrações
    pause
    exit /b 1
)

echo === APLICANDO SCHEMA ===
npx prisma db push
if %errorlevel% neq 0 (
    echo ERRO: Falha ao aplicar schema
    pause
    exit /b 1
)

echo === VERIFICANDO TABELAS ===
mysql -u root -ppassword datalake -e "SHOW TABLES;"
if %errorlevel% neq 0 (
    echo ERRO: Falha ao verificar tabelas
    pause
    exit /b 1
)

echo.
echo === MIGRAÇÃO CONCLUÍDA COM SUCESSO! ===
echo.
echo Agora você pode executar: npm run dev
echo.
pause
