# Sistema de Suporte - Gerenciamento de Tickets

Sistema completo de gerenciamento de tickets de suporte desenvolvido com Next.js, Prisma e SQLite. Esta aplicação permite gerenciar tickets de suporte, usuários, categorias, prioridades e status, tudo funcionando localmente sem dependências externas.

![Sistema de Suporte](https://via.placeholder.com/800x400?text=Sistema+de+Suporte)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Requisitos de Sistema](#requisitos-de-sistema)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Uso](#uso)
- [Testes](#testes)
- [Solução de Problemas](#solução-de-problemas)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🔍 Visão Geral

Este sistema de gerenciamento de tickets foi desenvolvido para permitir que organizações gerenciem solicitações de suporte de forma eficiente. O sistema inclui autenticação de usuários, diferentes níveis de acesso (administrador e usuário comum), e um fluxo completo de gerenciamento de tickets.

### 🌟 Tecnologias Utilizadas

- **Next.js 14**: Framework React com App Router
- **Prisma**: ORM para interação com banco de dados
- **SQLite**: Banco de dados local
- **NextAuth.js**: Sistema de autenticação
- **TailwindCSS**: Framework CSS
- **shadcn/ui**: Componentes de UI
- **Jest & React Testing Library**: Testes unitários
- **Playwright**: Testes de feature/e2e

## ✨ Funcionalidades

- **Autenticação**
  - Login e registro de usuários
  - Proteção de rotas
  - Diferentes níveis de acesso (admin/usuário)

- **Gerenciamento de Tickets**
  - Criação, visualização, atualização e exclusão de tickets
  - Atribuição de categorias, prioridades e status
  - Comentários em tickets
  - Registro de operações

- **Administração**
  - Gerenciamento de usuários
  - Configuração de categorias
  - Configuração de prioridades
  - Configuração de status

- **Dashboard**
  - Estatísticas de tickets
  - Visualização de tickets recentes
  - Filtros e pesquisa

## 💻 Requisitos de Sistema

- Node.js 16.x ou superior
- npm 7.x ou superior (ou yarn/pnpm)
- Git

## 🚀 Instalação

Siga estes passos para instalar e configurar o projeto localmente:

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/seu-usuario/support-ticket-system.git
cd support-ticket-system
\`\`\`

### 2. Instale as dependências

\`\`\`bash
# Usando npm
npm install

# Usando yarn
yarn

# Usando pnpm
pnpm install
\`\`\`

## ⚙️ Configuração

### 1. Configure as variáveis de ambiente

Copie o arquivo de exemplo de variáveis de ambiente:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite o arquivo `.env.local` e configure as seguintes variáveis:

\`\`\`
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-com-pelo-menos-32-caracteres

# Configurações da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

> **Importante**: Substitua `sua-chave-secreta-com-pelo-menos-32-caracteres` por uma string aleatória segura. Você pode gerar uma usando:
> \`\`\`bash
> openssl rand -base64 32
> \`\`\`

### 2. Configure o banco de dados

Execute os seguintes comandos para configurar o banco de dados SQLite:

\`\`\`bash
# Cria o banco de dados e aplica o schema
npm run db:push

# Popula o banco de dados com dados iniciais
npm run db:seed
\`\`\`

## 🔧 Ambientes

O projeto suporta diferentes ambientes de execução:

### Ambiente de Desenvolvimento

O ambiente de desenvolvimento usa o arquivo `.env` e é configurado para desenvolvimento local.

### Ambiente de Teste

O ambiente de teste usa o arquivo `.env.testing` e é configurado especificamente para execução de testes.

Para executar os testes no ambiente de teste:

\`\`\`bash
# Configurar o banco de dados de teste
npm run prisma:test:setup

# Executar testes unitários no ambiente de teste
npm run test:ci

# Executar testes E2E no ambiente de teste
npm run test:e2e:ci
\`\`\`

Os testes usam um banco de dados SQLite separado (`test.db`) para evitar interferir com o banco de dados de desenvolvimento.

## 🗂️ Estrutura do Projeto

\`\`\`
support-ticket-system/
├── app/                    # Rotas e páginas (Next.js App Router)
│   ├── api/                # Endpoints da API
│   ├── dashboard/          # Páginas do dashboard
│   └── ...
├── components/             # Componentes React reutilizáveis
├── lib/                    # Utilitários e serviços
├── prisma/                 # Schema e configurações do Prisma
│   ├── schema.prisma       # Definição do schema do banco de dados
│   └── seed.ts             # Script para popular o banco de dados
├── public/                 # Arquivos estáticos
├── tests/                  # Testes
│   ├── unit/               # Testes unitários
│   ├── integration/        # Testes de integração
│   └── e2e/                # Testes end-to-end
├── types/                  # Definições de tipos TypeScript
├── .env.example            # Exemplo de variáveis de ambiente
├── jest.config.js          # Configuração do Jest
├── next.config.js          # Configuração do Next.js
├── package.json            # Dependências e scripts
├── playwright.config.ts    # Configuração do Playwright
├── tailwind.config.js      # Configuração do Tailwind CSS
└── tsconfig.json           # Configuração do TypeScript
\`\`\`

## 🚦 Uso

### Iniciar o servidor de desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

### Credenciais de Administrador Padrão

Após executar o seed, você pode fazer login com as seguintes credenciais:

- **Email**: admin@example.com
- **Senha**: admin123

### Comandos Úteis

- **Iniciar servidor de desenvolvimento**: `npm run dev`
- **Construir para produção**: `npm run build`
- **Iniciar servidor de produção**: `npm run start`
- **Aplicar schema do Prisma**: `npm run db:push`
- **Executar seed**: `npm run db:seed`
- **Abrir Prisma Studio**: `npm run db:studio`
- **Configuração completa**: `npm run setup`
- **Executar testes unitários**: `npm run test`
- **Executar testes e2e**: `npm run test:e2e`

### Acessando o Prisma Studio

O Prisma Studio é uma interface visual para gerenciar seu banco de dados. Para acessá-lo, execute:

\`\`\`bash
npm run db:studio
\`\`\`

Isso abrirá o Prisma Studio em [http://localhost:5555](http://localhost:5555)

## 🧪 Testes

O projeto inclui testes unitários, de integração e end-to-end.

### Executar testes unitários

\`\`\`bash
# Executar todos os testes unitários
npm run test

# Executar testes com watch mode
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
\`\`\`

### Executar testes end-to-end

\`\`\`bash
# Executar testes e2e
npm run test:e2e

# Executar testes e2e em modo UI
npm run test:e2e:ui
\`\`\`

## 🔧 Solução de Problemas

### Problemas comuns

#### Erro de conexão com o banco de dados

Se você encontrar erros relacionados ao Prisma ou à conexão com o banco de dados:

1. Verifique se o arquivo do banco de dados SQLite foi criado em `prisma/dev.db`
2. Tente resetar o banco de dados:
   \`\`\`bash
   npx prisma migrate reset --force
   npm run db:seed
   \`\`\`

#### Erro de autenticação

Se você encontrar problemas com a autenticação:

1. Verifique se a variável `NEXTAUTH_SECRET` está definida corretamente
2. Limpe os cookies do navegador
3. Verifique se o usuário existe no banco de dados usando o Prisma Studio

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar um Pull Request.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
