import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { TicketDetails } from "@/components/tickets/ticket-details"
import { TicketComments } from "@/components/tickets/ticket-comments"
import { TicketOperations } from "@/components/tickets/ticket-operations"
import { getUserProfile } from "@/lib/user-service"
import { getTicketById } from "@/lib/ticket-service"

export default async function TicketPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const userProfile = await getUserProfile(session.user.id)
  const ticket = await getTicketById(params.id)

  if (!ticket) {
    notFound()
  }

  // Check if user has access to this ticket
  if (!userProfile?.is_admin && ticket.created_by !== session.user.id) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <TicketDetails ticket={ticket} isAdmin={userProfile?.is_admin || false} />

      {userProfile?.is_admin && <TicketOperations ticketId={params.id} />}

      <TicketComments ticketId={params.id} userId={session.user.id} />
    </div>
  )
}
