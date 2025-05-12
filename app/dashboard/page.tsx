import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentTickets } from "@/components/recent-tickets"
import prisma from "@/lib/prisma"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats isAdmin={userProfile?.isAdmin || false} userId={session.user.id} />
      <RecentTickets isAdmin={userProfile?.isAdmin || false} userId={session.user.id} />
    </div>
  )
}
