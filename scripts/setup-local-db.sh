#!/bin/bash

# Verifica se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI não encontrado. Instalando..."
    npm install -g supabase
fi

# Inicializa o projeto Supabase se necessário
if [ ! -d ".supabase" ]; then
    echo "Inicializando projeto Supabase..."
    supabase init
fi

# Inicia os serviços locais do Supabase
echo "Iniciando serviços locais do Supabase..."
supabase start

# Aplica as migrações
echo "Aplicando migrações..."
supabase db push

# Executa o seed se existir
if [ -f "supabase/seed.sql" ]; then
    echo "Executando seed..."
    supabase db execute --file supabase/seed.sql
fi

echo "Configuração concluída! O banco de dados local está pronto."
echo "URL do Supabase: http://localhost:54321"
echo "URL do Studio: http://localhost:54323"
