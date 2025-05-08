import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const createServerClient = () => {
  const cookieStore = cookies()

  // Configurações adicionais para ambiente local
  const options = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  return createServerComponentClient<Database>(
    {
      cookies: () => cookieStore,
    },
    options,
  )
}
