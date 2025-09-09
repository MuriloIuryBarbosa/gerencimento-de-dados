# Sistema de Gerenciamento de Dados

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescript.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.15.0-2D3748)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)](https://www.mysql.com/)

Um sistema web moderno e robusto para gerenciamento de dados empresariais com foco em governança, controle de acesso e personalização. Desenvolvido com Next.js 15, TypeScript e Prisma ORM, oferecendo uma interface minimalista e responsiva para usuários e administradores.

## 🚨 Status Atual - Problema de Login

**⚠️ ATENÇÃO**: O sistema de login está apresentando problemas críticos que impedem o acesso completo à aplicação.

### Problemas Identificados
- ❌ **Página de login carrega em branco** após tentativa de autenticação
- ❌ **Loop de redirecionamento** entre login e dashboard
- ❌ **Estado de autenticação instável** após login bem-sucedido
- ❌ **Possível conflito** entre contexto de autenticação e localStorage

### Soluções Implementadas
- ✅ **Logs de debug adicionados** em AuthContext e API de login
- ✅ **API de login testada** - funcionando corretamente (retorna usuário válido)
- ✅ **Estrutura de autenticação verificada** - componentes corretamente integrados
- ✅ **Sidebar condicional implementado** - não aparece na página de login

### Próximos Passos
1. **Debug do fluxo de autenticação** no navegador (console logs)
2. **Verificação de conflitos** entre AuthContext e localStorage
3. **Teste do redirecionamento** após login bem-sucedido
4. **Correção do loop de redirecionamento** identificado

### Como Testar
```bash
# 1. Iniciar servidor
npm run dev

# 2. Testar API diretamente
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'

# 3. Verificar logs no console do navegador
# Abrir http://localhost:3000/login e tentar fazer login
```

### Credenciais de Teste
- **Email**: `admin@example.com`
- **Senha**: `123456`

**Issue relacionada**: [#LOGIN-001 - Problema crítico no sistema de login](https://github.com/MuriloIuryBarbosa/gerenciamento-de-dados/issues/LOGIN-001)

---

## 🚀 Funcionalidades

### 👤 Gestão de Usuários
- **Cadastro de usuários**: Formulário seguro com validação de dados
- **Login com autenticação**: Sistema de login protegido com hash de senhas
- **Controle de acesso**: Diferenciação entre usuários comuns e administradores
- **Perfil de usuário**: Gerenciamento de informações pessoais

### 📊 Painel de Controle
- **Dashboard interativo**: Métricas em tempo real (total de usuários, dados gerenciados, relatórios)
- **Navegação intuitiva**: Menu lateral expansível com acesso rápido às funcionalidades
- **Visual responsivo**: Design adaptável para desktop e mobile

### 📋 Funcionalidades do Sistema
- **Proforma Control**: Gerenciamento de proformas
- **Ordem de Compra**: Controle completo de ordens de compra com dashboard, métricas e formulários
- **Requisições**: Gerenciamento de requisições

### ⚙️ Configurações Administrativas
- **Configuração da empresa**: Nome da empresa e upload de logo
- **Painel exclusivo para admins**: Acesso restrito às configurações do sistema
- **Personalização**: Interface para customizar elementos visuais

### 🔒 Segurança e Governança
- **Hash de senhas**: Utilização de bcrypt para proteção de credenciais
- **Validação de formulários**: Prevenção de dados inválidos no frontend e backend
- **Controle de permissões**: Restrição de acesso baseada em roles
- **Sistema de Controle de Acesso ao Menu Admin**: Menu administrativo exibido apenas para usuários autorizados

### 🛡️ Sistema de Controle de Acesso ao Menu Admin

#### Visão Geral
Sistema inteligente que controla dinamicamente a exibição do menu de administração no sidebar baseado nas permissões do usuário, garantindo que apenas usuários autorizados tenham acesso às funcionalidades administrativas.

#### Funcionalidades Implementadas

##### 🔧 Componentes do Sistema
- **Hook de Permissões** (`useUserPermissions`): Hook personalizado para verificação de permissões
- **Sidebar Condicional**: Menu lateral que se adapta às permissões do usuário
- **API de Verificação**: Endpoint `/api/admin/check-access` para validação server-side
- **Controle de Expiração**: Suporte a permissões com data de validade

##### 🎯 Critérios de Acesso
O menu de administração será exibido quando o usuário possuir:
- ✅ **Super Admin**: `isSuperAdmin = true` (acesso total ao sistema)
- ✅ **Admin**: `isAdmin = true` (acesso administrativo)
- ✅ **Permissão Específica**: `admin.full_access` ou qualquer permissão começando com `admin.`

##### 📊 Estrutura do Menu Admin
```
📊 Administração
├── 📈 Dashboard Admin (/admin)
├── 👥 Gerenciar Usuários (/admin/usuarios)
├── 🛡️ Gerenciar Permissões (/admin/permissoes)
└── 📦 Tabelas Dinâmicas (/admin/tabelas)
```

##### 🔄 Fluxo de Funcionamento
1. **Carregamento**: Hook `useUserPermissions` é executado na inicialização
2. **Verificação**: API consulta permissões do usuário no banco de dados
3. **Avaliação**: Sistema verifica se usuário tem acesso administrativo
4. **Renderização**: Menu admin aparece apenas se autorizado

##### 🛡️ Recursos de Segurança
- **Verificação Server-side**: Validação de permissões no backend
- **Controle de Estado**: Apenas permissões ativas são consideradas
- **Expiração Automática**: Permissões com data limite são respeitadas
- **Fallback Seguro**: Usuários não autorizados não visualizam o menu

##### 🚀 Como Utilizar
1. **Para Administradores**: Usuários com `isAdmin: true` ou `isSuperAdmin: true` veem automaticamente o menu
2. **Para Usuários Específicos**: Conceda a permissão `admin.full_access` via painel de permissões
3. **Verificação**: O menu aparecerá automaticamente após concessão da permissão

##### 📋 Endpoints da API Administrativa

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/admin/check-access` | GET | Verifica se o usuário atual tem acesso administrativo |
| `/api/admin/stats` | GET | Retorna estatísticas gerais do sistema |
| `/api/admin/usuarios` | GET/POST | Lista/cria usuários do sistema |
| `/api/admin/permissoes` | GET/POST | Lista/cria permissões do sistema |
| `/api/admin/usuarios-permissoes` | GET/POST | Lista/concede permissões a usuários |
| `/api/admin/usuarios-permissoes/[id]` | DELETE | Revoga permissão específica |
| `/api/admin/tabelas` | GET/POST | Lista/cria tabelas dinâmicas |
| `/api/admin/ddl` | POST | Executa operações DDL no banco |

##### 🔐 Resposta da API de Verificação
```json
{
  "canAccessAdmin": true,
  "isAdmin": true,
  "isSuperAdmin": false,
  "permissions": ["admin.full_access", "users.view", "users.create"]
}
```

##### 🚀 Próximos Passos para Produção
1. **Integração com Sistema de Autenticação**: Substituir simulação por autenticação real (JWT/Session)
2. **Cache de Permissões**: Implementar cache Redis para melhorar performance
3. **Logs de Auditoria**: Registrar todas as tentativas de acesso administrativo
4. **Rate Limiting**: Implementar limite de tentativas para endpoints sensíveis
5. **Testes Automatizados**: Criar suíte completa de testes para o sistema de permissões

## 🗄️ Migração para MySQL

### Status Atual: SQLite → MySQL

O projeto foi **configurado para usar MySQL** ao invés de SQLite. A migração já foi parcialmente implementada:

#### ✅ Configurações Realizadas
- **Schema Prisma**: Atualizado para MySQL (`provider = "mysql"`)
- **Variáveis de Ambiente**: `.env` configurado com URL MySQL
- **Dependências**: `mysql2` já instalado no `package.json`
- **Scripts de Setup**: Criados arquivos `mysql-setup.md` e `migrate-to-mysql.bat`

#### 🔄 Próximos Passos para Migração Completa

##### 1. Instalar MySQL
Escolha uma das opções:

**Opção A - Docker (Recomendado):**
```bash
docker run --name mysql-datalake -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=datalake -p 3306:3306 -d mysql:8.0
```

**Opção B - Instalador Oficial:**
1. Baixe: https://dev.mysql.com/downloads/mysql/
2. Instale e configure senha como `password`
3. Crie banco `datalake`

**Opção C - XAMPP:**
1. Baixe XAMPP: https://www.apachefriends.org/
2. Instale e inicie MySQL via painel de controle

##### 2. Executar Migração
Após instalar MySQL, execute o script automático:

```bash
# Windows
.\migrate-to-mysql.bat

# Linux/Mac
chmod +x migrate-to-mysql.sh
./migrate-to-mysql.sh
```

Ou execute manualmente:
```bash
# 1. Criar banco
mysql -u root -ppassword -e "CREATE DATABASE IF NOT EXISTS datalake;"

# 2. Gerar cliente Prisma
npx prisma generate

# 3. Criar migrações
npx prisma migrate dev --name init_mysql

# 4. Aplicar schema
npx prisma db push

# 5. Verificar tabelas
mysql -u root -ppassword datalake -e "SHOW TABLES;"
```

##### 3. Testar Aplicação
```bash
npm run dev
```

#### 📋 Configurações do MySQL

**Arquivo `.env`:**
```env
DATABASE_URL="mysql://root:password@localhost:3306/datalake"
```

**Credenciais Padrão:**
- **Host**: `localhost`
- **Porta**: `3306`
- **Usuário**: `root`
- **Senha**: `password`
- **Banco**: `datalake`

#### 🛠️ Comandos Úteis

```bash
# Verificar conexão
mysql -u root -ppassword -e "SELECT VERSION();"

# Listar bancos
mysql -u root -ppassword -e "SHOW DATABASES;"

# Listar tabelas
mysql -u root -ppassword datalake -e "SHOW TABLES;"

# Backup
mysqldump -u root -ppassword datalake > backup.sql

# Restore
mysql -u root -ppassword datalake < backup.sql
```

#### ⚠️ Importante
- **Senha**: Configure como `password` ou ajuste no `.env`
- **Porta**: Certifique-se de que a porta 3306 não está bloqueada
- **Firewall**: Permita conexões na porta 3306 se necessário
- **Charset**: O banco será criado com `utf8mb4` para suporte Unicode completo

#### 🔍 Troubleshooting MySQL

**Erro: "Access denied"**
```bash
# Reset senha root
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```

**Erro: "Port already in use"**
```bash
# Verificar processos na porta 3306
netstat -ano | findstr :3306
# Ou no Linux: lsof -i :3306
```

**Erro: "Can't connect to MySQL server"**
- Verifique se MySQL está rodando
- Confirme host e porta no `.env`
- Teste conexão: `mysql -u root -ppassword -h localhost -P 3306`

---

```
gerenciamento-de-dados/
├── app/                          # Páginas do Next.js App Router
│   ├── api/                      # Endpoints da API
│   │   ├── login/                # Rota de login
│   │   ├── register/             # Rota de cadastro
│   │   ├── settings/             # Rota de configurações
│   │   └── admin/                # Endpoints administrativos
│   │       ├── check-access/     # Verificação de permissões de acesso
│   │       ├── stats/           # Estatísticas do sistema
│   │       ├── usuarios/        # Gerenciamento de usuários
│   │       ├── permissoes/      # Gerenciamento de permissões
│   │       ├── usuarios-permissoes/ # Controle de permissões por usuário
│   │       └── ddl/             # Operações DDL no banco
│   ├── dashboard/                # Página do painel de controle
│   ├── login/                    # Página de login
│   ├── register/                 # Página de cadastro
│   ├── settings/                 # Página de configurações
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── components/                   # Componentes reutilizáveis
│   ├── AuthContext.tsx          # Contexto de autenticação (em desenvolvimento)
│   ├── LanguageContext.tsx      # Contexto de internacionalização
│   ├── ProtectedRoute.tsx       # Proteção de rotas (em desenvolvimento)
│   ├── Sidebar.tsx              # Menu lateral com controle de permissões
│   ├── useUserPermissions.ts    # Hook para verificação de permissões
│   └── ...                      # Outros componentes
├── lib/                          # Utilitários e configurações
│   ├── prisma.ts                 # Configuração do Prisma Client
│   └── auth.ts                   # Configurações de autenticação
├── prisma/                       # Configurações do Prisma
│   ├── schema.prisma             # Esquema do banco de dados
│   ├── migrations/               # Migrações do banco
│   └── dev.db                    # Banco SQLite para desenvolvimento
├── types/                        # Definições de tipos TypeScript
├── public/                       # Arquivos estáticos
├── database/                     # Scripts SQL auxiliares
│   ├── admin_features.sql        # Script completo para recursos admin
│   ├── admin_simple.sql          # Script simplificado para admin
│   └── permissoes_iniciais.sql   # Script para popular permissões
├── .env                          # Variáveis de ambiente
├── .env.example                  # Exemplo de variáveis de ambiente
├── package.json                  # Dependências e scripts
├── tailwind.config.ts            # Configuração do Tailwind CSS
├── tsconfig.json                 # Configuração do TypeScript
└── README.md                     # Este arquivo
```

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.0 ou superior) - [Download](https://nodejs.org/)
- **MySQL** (versão 8.0 ou superior) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/MuriloIuryBarbosa/gerenciamento-de-dados.git
cd gerenciamento-de-dados
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados MySQL
1. Crie um banco de dados chamado `datalake` no MySQL:
   ```sql
   CREATE DATABASE datalake;
   ```

2. Copie o arquivo de exemplo das variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

3. Edite o arquivo `.env` com suas credenciais do MySQL:
   ```env
   DATABASE_URL="mysql://root:Mu3040@#@localhost:3306/datalake"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### 4. Execute as migrações do banco
```bash
npx prisma migrate dev --name init
```

### 5. Gere o cliente Prisma
```bash
npx prisma generate
```

### 6. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`.

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter ESLint

## 🔧 Configuração Avançada

### Variáveis de Ambiente
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão com o MySQL | `mysql://user:pass@localhost:3306/datalake` |
| `NEXTAUTH_SECRET` | Chave secreta para NextAuth | `your-secret-key-here` |
| `NEXTAUTH_URL` | URL base da aplicação | `http://localhost:3000` |

### Personalização do Tema
O projeto utiliza Tailwind CSS para estilização. As cores principais estão definidas em `app/globals.css`:
- **Background**: Cinza claro (#f9fafb)
- **Texto**: Cinza escuro (#111827)
- **Accent**: Azul (#3b82f6)

Para alterar cores, edite as variáveis CSS ou o arquivo `tailwind.config.ts`.

### Scripts SQL Administrativos
A pasta `database/` contém scripts SQL para configuração das funcionalidades administrativas:

#### `admin_features.sql`
- Script completo com todas as tabelas e funcionalidades administrativas
- Inclui: usuários, permissões, tabelas dinâmicas, logs do sistema
- Ideal para nova instalação com recursos completos

#### `admin_simple.sql`
- Versão simplificada do script administrativo
- Contém apenas as funcionalidades essenciais
- Recomendado para ambientes de desenvolvimento rápido

#### `permissoes_iniciais.sql`
- Popula o sistema com permissões pré-definidas
- Cria 25 permissões organizadas por categoria
- Concede automaticamente permissões para usuários admin
- Suporte a `INSERT IGNORE` para evitar duplicatas

**Como executar os scripts:**
```bash
mysql -u root -p datalake < database/permissoes_iniciais.sql
```

## � Ordem de Compra

### Dashboard de Ordens
- **Métricas em Tempo Real**:
  - Total de ordens registradas
  - Ordens pendentes de aprovação
  - Ordens pendentes de informações
  - Ordens com prazo estourado
- **Tabela Interativa**: Lista todas as ordens com filtros e paginação
- **Ações Rápidas**: Visualizar detalhes e editar ordens existentes

### Criação de Nova Ordem
- **Dados do Fornecedor**: Cadastro completo de informações do fornecedor
- **Condições Comerciais**: Pagamento e prazo de entrega
- **Itens Dinâmicos**: Adicionar/remover múltiplos itens com cálculo automático
- **Cálculo de Totais**: Valor total por item e total geral da ordem
- **Validação**: Campos obrigatórios e formatação adequada

### Funcionalidades Implementadas
- ✅ Dashboard com métricas visuais
- ✅ Tabela responsiva com dados mockados
- ✅ Formulário completo para nova ordem
- ✅ Cálculo automático de valores
- ✅ Interface minimalista e intuitiva
- 🔄 Backend e persistência no banco (próxima etapa)

## 🧪 Testes

### Testes Unitários
```bash
npm run test
```

### Testes de Integração
```bash
npm run test:integration
```

## 🔍 Troubleshooting

### Erro: "Cannot find module 'next/server'"
- Reinicie o servidor TypeScript no VS Code: `Ctrl+Shift+P` > "TypeScript: Restart TS Server"

### Erro: "Connection refused" no banco
- Verifique se o MySQL está rodando: `sudo systemctl status mysql`
- Confirme as credenciais no `.env`

### Erro: "Migration failed"
- Certifique-se de que o banco `datalake` existe
- Execute `npx prisma migrate reset` para resetar as migrações

### Problemas com Sistema de Permissões
- **Menu admin não aparece**: Verifique se o usuário tem `isAdmin: true` ou `isSuperAdmin: true`
- **API retorna erro 500**: Execute `npx prisma generate` para regenerar o cliente
- **Permissões não funcionam**: Execute o script `database/permissoes_iniciais.sql`
- **Hook não carrega**: Verifique se o servidor está rodando na porta correta

### Performance
- Para otimização em produção, use `npm run build` e `npm run start`
- Configure variáveis de ambiente para produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes de Contribuição
- Siga os padrões de código TypeScript
- Adicione testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Use commits descritivos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Murilo Iury Barbosa** - Desenvolvimento inicial

## 🙏 Agradecimentos

- Next.js Team pela excelente framework
- Prisma Team pelo ORM poderoso
- Tailwind CSS pela estilização utilitária
- Comunidade open-source

---

**Nota**: Este projeto está em desenvolvimento ativo. Funcionalidades podem ser adicionadas ou modificadas conforme as necessidades do negócio.

**Sistema de Controle de Acesso**: Implementado sistema completo de permissões com menu administrativo condicional. Usuários com permissões administrativas terão acesso automático ao painel de administração no menu lateral.

**Última atualização**: Sistema de permissões implementado (Setembro 2025)

## 🆕 Melhorias Recentes

### ✅ Melhorias Implementadas
- **Sistema de Autenticação Completo**: AuthContext com localStorage para persistência
- **Sidebar Condicional**: Menu lateral não aparece na página de login
- **Informações do Usuário**: Sidebar exibe nome e email do usuário logado
- **Menu Reordenado**: Organização lógica (Cadastro → Executivo → Planejamento)
- **Logs de Debug**: Sistema de logs adicionado para troubleshooting
- **API de Login Funcional**: Endpoint testado e funcionando corretamente

### 🔧 Componentes Atualizados
- `AuthContext.tsx` - Contexto de autenticação com logs de debug
- `Sidebar.tsx` - Menu lateral com informações do usuário
- `app/login/page.tsx` - Página de login com validação e redirecionamento
- `app/api/login/route.ts` - API de login com autenticação mockada
- `app/layout.tsx` - Layout principal com sidebar condicional

### 📊 Status dos Componentes
| Componente | Status | Descrição |
|------------|--------|-----------|
| AuthContext | ✅ Funcional | Contexto de autenticação com localStorage |
| Sidebar | ✅ Funcional | Menu lateral condicional com user info |
| Login Page | ⚠️ Debug | Página com logs, mas com problema de loop |
| API Login | ✅ Funcional | Endpoint retorna usuário corretamente |
| Layout | ✅ Funcional | Sidebar condicional implementada |

---
