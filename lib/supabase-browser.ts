"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let supabaseClient: ReturnType<typeof createClient> | null = null

export const createBrowserClient = () => {
  if (supabaseClient) {
    return supabaseClient
  }

  // Certifique-se de que as variáveis de ambiente estão definidas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL and Anon Key must be defined in environment variables")
    throw new Error("Supabase URL and Anon Key must be defined in environment variables")
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}
