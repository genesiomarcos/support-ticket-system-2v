import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface DashboardStatsProps {
  isAdmin: boolean
  userId: string
}

export async function DashboardStats({ isAdmin, userId }: DashboardStatsProps) {
  const supabase = createServerClient()

  let totalTickets = 0
  let openTickets = 0
  let resolvedTickets = 0
  let highPriorityTickets = 0

  if (isAdmin) {
    // Get all tickets stats for admin
    const { count: total } = await supabase.from("tickets").select("*", { count: "exact", head: true })

    const { count: open } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .neq("status_id", (await supabase.from("statuses").select("id").eq("name", "Finalizado").single()).data?.id || 0)

    const { count: resolved } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("status_id", (await supabase.from("statuses").select("id").eq("name", "Finalizado").single()).data?.id || 0)

    const { count: highPriority } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("priority_id", (await supabase.from("priorities").select("id").eq("name", "Alta").single()).data?.id || 0)
      .neq("status_id", (await supabase.from("statuses").select("id").eq("name", "Finalizado").single()).data?.id || 0)

    totalTickets = total || 0
    openTickets = open || 0
    resolvedTickets = resolved || 0
    highPriorityTickets = highPriority || 0
  } else {
    // Get user's tickets stats
    const { count: total } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("created_by", userId)

    const { count: open } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("created_by", userId)
      .neq("status_id", (await supabase.from("statuses").select("id").eq("name", "Finalizado").single()).data?.id || 0)

    const { count: resolved } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("created_by", userId)
      .eq("status_id", (await supabase.from("statuses").select("id").eq("name", "Finalizado").single()).data?.id || 0)

    const { count: highPriority } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("created_by", userId)
      .eq("priority_id", (await supabase.from("priorities").select("id").eq("name", "Alta").single()).data?.id || 0)

    totalTickets = total || 0
    openTickets = open || 0
    resolvedTickets = resolved || 0
    highPriorityTickets = highPriority || 0
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
          <TicketIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTickets}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tickets Abertos</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openTickets}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tickets Resolvidos</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedTickets}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityTickets}</div>
        </CardContent>
      </Card>
    </div>
  )
}
