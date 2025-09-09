# Sistema de Gerenciamento de Dados

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescript.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.15.0-2D3748)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)](https://www.mysql.com/)

Sistema web moderno para gerenciamento de dados empresariais com foco em SKUs, ordens de compra e controle de acesso.

## 📁 Estrutura do Projeto

```
gerenciamento-de-dados/
├── app/                    # Páginas Next.js App Router
├── components/             # Componentes reutilizáveis
├── database/               # Scripts SQL para configuração
├── docs/                   # Documentação e lembretes
├── lib/                    # Utilitários e configurações
├── prisma/                 # Schema e migrações do banco
├── public/                 # Arquivos estáticos
├── scripts/                # Scripts de automação
├── .env                    # Variáveis de ambiente
└── README.md
```

## 🚀 Funcionalidades

### 👤 Gestão de Usuários
- Sistema de autenticação completo
- Controle de permissões por usuário
- Perfis administrativos e comuns

### 📦 Gestão de SKUs
- Cadastro e edição de produtos
- Controle de estoque
- Categorização e famílias de produtos

### 🛒 Ordens de Compra
- Criação e gerenciamento de ordens
- Controle de fornecedores
- Aprovações e status de pedidos

### 📊 Dashboards
- Métricas em tempo real
- Relatórios visuais
- Interface responsiva

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- Git

### Passos
1. **Clone o repositório**
   ```bash
   git clone https://github.com/MuriloIuryBarbosa/gerenciamento-de-dados.git
   cd gerenciamento-de-dados
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env

   # Edite com suas credenciais MySQL
   # DATABASE_URL="mysql://root:password@localhost:3306/datalake"
   ```

4. **Execute as migrações**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Inicie o servidor**
   ```bash
   npm run dev
   ```

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Executar ESLint

## 📚 Documentação

- `docs/README.md` - Visão geral da documentação
- `docs/lembretes.txt` - Funcionalidades pendentes
- `docs/lembretes_2.txt` - Requisitos de UX/UI
- `docs/mysql-setup.md` - Configuração do MySQL

## 🗄️ Banco de Dados

Scripts SQL disponíveis em `database/`:
- `setup_complete_database.sql` - Criação completa
- `sample_data.sql` - Dados de exemplo
- `verify_database.sql` - Verificação da estrutura

## 🔧 Configuração

### Variáveis de Ambiente
```env
DATABASE_URL="mysql://root:password@localhost:3306/datalake"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### MySQL Setup
Consulte `docs/mysql-setup.md` para instruções completas de configuração do banco de dados.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autor

**Murilo Iury Barbosa** - Desenvolvimento
