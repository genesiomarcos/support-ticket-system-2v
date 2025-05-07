import Link from "next/link"
import { createServerClient } from "@/lib/supabase-server"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TicketsTableProps {
  isAdmin: boolean
  userId: string
}

export async function TicketsTable({ isAdmin, userId }: TicketsTableProps) {
  const supabase = createServerClient()

  let tickets = []

  if (isAdmin) {
    // Get all tickets for admin
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
        categories (
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

    tickets = data || []
  } else {
    // Get user's tickets
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
        categories (
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

    tickets = data || []
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assunto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado por</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length > 0 ? (
            tickets.map((ticket: any) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.subject}</TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: ticket.categories.color }}>{ticket.categories.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: ticket.priorities.color }}>{ticket.priorities.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: ticket.statuses.color }}>{ticket.statuses.name}</Badge>
                </TableCell>
                <TableCell>{ticket.profiles.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/tickets/${ticket.id}`}>Visualizar</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum ticket encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
