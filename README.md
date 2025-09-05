# Sistema de Gerenciamento de Dados

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.15.0-2D3748)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)](https://www.mysql.com/)

Um sistema web moderno e robusto para gerenciamento de dados empresariais com foco em governança, controle de acesso e personalização. Desenvolvido com Next.js 15, TypeScript e Prisma ORM, oferecendo uma interface minimalista e responsiva para usuários e administradores.

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

## 🏗️ Estrutura do Projeto

```
gerenciamento-de-dados/
├── app/                          # Páginas do Next.js App Router
│   ├── api/                      # Endpoints da API
│   │   ├── login/                # Rota de login
│   │   ├── register/             # Rota de cadastro
│   │   └── settings/             # Rota de configurações
│   ├── dashboard/                # Página do painel de controle
│   ├── login/                    # Página de login
│   ├── register/                 # Página de cadastro
│   ├── settings/                 # Página de configurações
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── components/                   # Componentes reutilizáveis
├── lib/                          # Utilitários e configurações
│   ├── prisma.ts                 # Configuração do Prisma Client
│   └── auth.ts                   # Configurações de autenticação
├── prisma/                       # Configurações do Prisma
│   ├── schema.prisma             # Esquema do banco de dados
│   └── migrations/               # Migrações do banco
├── types/                        # Definições de tipos TypeScript
├── public/                       # Arquivos estáticos
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
