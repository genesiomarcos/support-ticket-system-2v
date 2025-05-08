# Sistema de Suporte - Gerenciamento de Tickets

Sistema de gerenciamento de tickets de suporte desenvolvido com Next.js e Supabase.

## Configuração do Ambiente

1. Clone o repositório
2. Copie o arquivo `.env.example` para `.env.local`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
3. Crie um projeto no [Supabase](https://supabase.com)
4. Atualize as variáveis de ambiente no arquivo `.env.local` com as credenciais do seu projeto Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do seu projeto Supabase
   - `SUPABASE_JWT_SECRET`: JWT Secret do seu projeto Supabase

5. Execute as migrações do banco de dados:
   \`\`\`bash
   npx supabase db push
   \`\`\`

6. Instale as dependências:
   \`\`\`bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   \`\`\`

7. Execute o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   \`\`\`

8. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de tickets
- Categorias, prioridades e status personalizáveis
- Comentários e operações em tickets
- Painel administrativo
- Estatísticas e relatórios

## Estrutura do Projeto

- `/app`: Rotas e páginas da aplicação (Next.js App Router)
- `/components`: Componentes React reutilizáveis
- `/lib`: Utilitários e serviços
- `/types`: Definições de tipos TypeScript
- `/supabase`: Migrações e configurações do Supabase

## Usuários e Permissões

O sistema possui dois tipos de usuários:

1. **Usuários comuns**: Podem criar e gerenciar seus próprios tickets
2. **Administradores**: Podem gerenciar todos os tickets, categorias, prioridades, status e usuários

Para criar um administrador, registre um usuário normal e depois atualize o campo `is_admin` para `true` no banco de dados.
