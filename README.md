# Sistema de Suporte - Gerenciamento de Tickets

Sistema de gerenciamento de tickets de suporte desenvolvido com Next.js e Supabase.

## Configuração do Ambiente Local

### Pré-requisitos

- Node.js 16+ instalado
- PostgreSQL instalado localmente (ou Docker)
- Supabase CLI instalado (`npm install -g supabase`)

### Passos para Configuração

1. Clone o repositório
   \`\`\`bash
   git clone https://github.com/seu-usuario/support-ticket-system.git
   cd support-ticket-system
   \`\`\`

2. Copie o arquivo `.env.example` para `.env.local`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Instale as dependências:
   \`\`\`bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   \`\`\`

4. Configure o banco de dados local:
   \`\`\`bash
   # Dê permissão de execução ao script
   chmod +x scripts/setup-local-db.sh
   
   # Execute o script
   ./scripts/setup-local-db.sh
   \`\`\`

   Ou manualmente:
   \`\`\`bash
   # Inicialize o projeto Supabase
   supabase init
   
   # Inicie os serviços locais
   supabase start
   
   # Aplique as migrações
   supabase db push
   
   # Execute o seed
   supabase db execute --file supabase/seed.sql
   \`\`\`

5. Execute o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   \`\`\`

6. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

### Credenciais de Administrador Padrão

Após executar o seed, você pode fazer login com as seguintes credenciais:

- **Email**: admin@example.com
- **Senha**: admin123

## Comandos Úteis

- **Iniciar Supabase**: `supabase start`
- **Parar Supabase**: `supabase stop`
- **Status do Supabase**: `supabase status`
- **Resetar Banco de Dados**: `supabase db reset`
- **Aplicar Migrações**: `supabase db push`
- **Executar Seed**: `supabase db execute --file supabase/seed.sql`

## Acessando o Supabase Studio Local

O Supabase Studio local está disponível em [http://localhost:54323](http://localhost:54323)

## Estrutura do Projeto

- `/app`: Rotas e páginas da aplicação (Next.js App Router)
- `/components`: Componentes React reutilizáveis
- `/lib`: Utilitários e serviços
- `/types`: Definições de tipos TypeScript
- `/supabase`: Migrações e configurações do Supabase

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de tickets
- Categorias, prioridades e status personalizáveis
- Comentários e operações em tickets
- Painel administrativo
- Estatísticas e relatórios
\`\`\`

Vamos adicionar um script para verificar as variáveis de ambiente:
