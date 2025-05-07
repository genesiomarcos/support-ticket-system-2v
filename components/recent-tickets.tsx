import Link from "next/link"
import { createServerClient } from "@/lib/supabase-server"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentTicketsProps {
  isAdmin: boolean
  userId: string
}

export async function RecentTickets({ isAdmin, userId }: RecentTicketsProps) {
  const supabase = createServerClient()

  let tickets = []

  if (isAdmin) {
    // Get recent tickets for admin
    const { data } = await supabase
      .from("tickets")
      .select(`
        id,
        subject,
        created_at,
        statuses (
          id,
          name,
          color
        ),
        priorities (
          id,
          name,
          color
        ),
        profiles (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    tickets = data || []
  } else {
    // Get user's recent tickets
    const { data } = await supabase
      .from("tickets")
      .select(`
        id,
        subject,
        created_at,
        statuses (
          id,
          name,
          color
        ),
        priorities (
          id,
          name,
          color
        ),
        profiles (
          id,
          name
        )
      `)
      .eq("created_by", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    tickets = data || []
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets Recentes</CardTitle>
        <CardDescription>{isAdmin ? "Tickets mais recentes no sistema" : "Seus tickets mais recentes"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map((ticket: any) => (
              <div key={ticket.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium hover:underline">
                    {ticket.subject}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Por {ticket.profiles.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ptBR })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge style={{ backgroundColor: ticket.priorities.color }}>{ticket.priorities.name}</Badge>
                  <Badge style={{ backgroundColor: ticket.statuses.color }}>{ticket.statuses.name}</Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">Nenhum ticket encontrado</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard/tickets">Ver todos os tickets</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
