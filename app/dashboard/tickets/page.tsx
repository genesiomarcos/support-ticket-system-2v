import { createServerClient } from "@/lib/supabase-server"
import { TicketsTable } from "@/components/tickets/tickets-table"
import { getUserProfile } from "@/lib/user-service"
import { CreateTicketButton } from "@/components/tickets/create-ticket-button"

export default async function TicketsPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const userProfile = await getUserProfile(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tickets</h1>
        {!userProfile?.is_admin && <CreateTicketButton />}
      </div>
      <TicketsTable isAdmin={userProfile?.is_admin || false} userId={session.user.id} />
    </div>
  )
}
