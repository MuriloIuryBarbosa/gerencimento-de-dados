# Sistema de Gerenciamento de Dados

Este é um sistema web para gerenciamento de dados com governança, desenvolvido em Next.js.

## Funcionalidades

- Cadastro de usuários
- Login com validação
- Painel de controle
- Painel de configurações para administradores (configurar logo da empresa, etc.)
- Design minimalista com Tailwind CSS

## Estrutura do Projeto

- `app/`: Páginas do Next.js App Router
- `components/`: Componentes reutilizáveis
- `lib/`: Utilitários e configurações
- `types/`: Definições de tipos TypeScript

## Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o banco de dados:
   - Este projeto usa Prisma para ORM e PostgreSQL.
   - Configure a conexão com o schema "datalake" no arquivo `lib/prisma.ts`.

3. Execute as migrações do banco:
   ```bash
   npx prisma migrate dev
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Próximos Passos

- Implementar autenticação completa com next-auth
- Conectar ao banco de dados local
- Adicionar validação de formulários
- Implementar lógica de negócio para gerenciamento de dados
- Adicionar mais funcionalidades ao painel de controle

## Tecnologias Utilizadas

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma (para banco de dados)
- NextAuth.js (para autenticação)
