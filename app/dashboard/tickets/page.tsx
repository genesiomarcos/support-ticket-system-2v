import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { TicketsTable } from "@/components/tickets/tickets-table"
import { CreateTicketButton } from "@/components/tickets/create-ticket-button"
import prisma from "@/lib/prisma"

export default async function TicketsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tickets</h1>
        {!userProfile?.isAdmin && <CreateTicketButton />}
      </div>
      <TicketsTable isAdmin={userProfile?.isAdmin || false} userId={session.user.id} />
    </div>
  )
}
