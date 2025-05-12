import Link from "next/link"
import prisma from "@/lib/prisma"
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
  let tickets = []

  if (isAdmin) {
    // Get all tickets for admin
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
        category: {
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
    })

    tickets = data || []
  } else {
    // Get user's tickets
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
        category: {
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
    })

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
                  <Badge style={{ backgroundColor: ticket.category.color }}>{ticket.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: ticket.priority.color }}>{ticket.priority.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: ticket.status.color }}>{ticket.status.name}</Badge>
                </TableCell>
                <TableCell>{ticket.createdBy.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
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
