import { createServerClient } from "./supabase-server"

export async function getTicketById(ticketId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      category:categories(*),
      status:statuses(*),
      priority:priorities(*),
      profile:profiles(*)
    `)
    .eq("id", ticketId)
    .single()

  if (error) {
    console.error("Error fetching ticket:", error)
    return null
  }

  return data
}
