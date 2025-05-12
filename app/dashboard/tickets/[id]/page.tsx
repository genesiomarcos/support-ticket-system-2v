import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { TicketDetails } from "@/components/tickets/ticket-details"
import { TicketComments } from "@/components/tickets/ticket-comments"
import { TicketOperations } from "@/components/tickets/ticket-operations"
import prisma from "@/lib/prisma"

export default async function TicketPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      status: true,
      priority: true,
      createdBy: true,
    },
  })

  if (!ticket) {
    notFound()
  }

  // Check if user has access to this ticket
  if (!userProfile?.isAdmin && ticket.createdById !== session.user.id) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <TicketDetails ticket={ticket} isAdmin={userProfile?.isAdmin || false} />

      {userProfile?.isAdmin && <TicketOperations ticketId={params.id} />}

      <TicketComments ticketId={params.id} userId={session.user.id} />
    </div>
  )
}
