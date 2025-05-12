import Link from "next/link"
import prisma from "@/lib/prisma"
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
  let tickets = []

  if (isAdmin) {
    // Get recent tickets for admin
    const data = await prisma.ticket.findMany({
      select: {
        id: true,
        subject: true,
        createdAt: true,
        status: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        priority: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    tickets = data || []
  } else {
    // Get user's recent tickets
    const data = await prisma.ticket.findMany({
      where: {
        createdById: userId,
      },
      select: {
        id: true,
        subject: true,
        createdAt: true,
        status: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        priority: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

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
                    <span>Por {ticket.createdBy.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge style={{ backgroundColor: ticket.priority.color }}>{ticket.priority.name}</Badge>
                  <Badge style={{ backgroundColor: ticket.status.color }}>{ticket.status.name}</Badge>
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
