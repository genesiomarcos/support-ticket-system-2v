import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Não definido",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Definido" : "Não definido",
    postgresUrl: process.env.POSTGRES_URL || "Não definido",
    environment: process.env.NODE_ENV || "Não definido",
  })
}
