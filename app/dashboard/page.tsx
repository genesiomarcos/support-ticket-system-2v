import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentTickets } from "@/components/recent-tickets"
import { getUserProfile } from "@/lib/user-service"

export default async function Dashboard() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  const userProfile = await getUserProfile(session.user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats isAdmin={userProfile?.is_admin || false} userId={session.user.id} />
      <RecentTickets isAdmin={userProfile?.is_admin || false} userId={session.user.id} />
    </div>
  )
}
