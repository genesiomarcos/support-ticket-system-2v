import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface DashboardStatsProps {
  isAdmin: boolean
  userId: string
}

export async function DashboardStats({ isAdmin, userId }: DashboardStatsProps) {
  let totalTickets = 0
  let openTickets = 0
  let resolvedTickets = 0
  let highPriorityTickets = 0

  if (isAdmin) {
    // Get all tickets stats for admin
    totalTickets = await prisma.ticket.count()

    const finishedStatus = await prisma.status.findUnique({
      where: { name: "Finalizado" },
    })

    openTickets = await prisma.ticket.count({
      where: {
        NOT: {
          statusId: finishedStatus?.id,
        },
      },
    })

    resolvedTickets = await prisma.ticket.count({
      where: {
        statusId: finishedStatus?.id,
      },
    })

    const highPriority = await prisma.priority.findUnique({
      where: { name: "Alta" },
    })

    highPriorityTickets = await prisma.ticket.count({
      where: {
        priorityId: highPriority?.id,
        NOT: {
          statusId: finishedStatus?.id,
        },
      },
    })
  } else {
    // Get user's tickets stats
    totalTickets = await prisma.ticket.count({
      where: {
        createdById: userId,
      },
    })

    const finishedStatus = await prisma.status.findUnique({
      where: { name: "Finalizado" },
    })

    openTickets = await prisma.ticket.count({
      where: {
        createdById: userId,
        NOT: {
          statusId: finishedStatus?.id,
        },
      },
    })

    resolvedTickets = await prisma.ticket.count({
      where: {
        createdById: userId,
        statusId: finishedStatus?.id,
      },
    })

    const highPriority = await prisma.priority.findUnique({
      where: { name: "Alta" },
    })

    highPriorityTickets = await prisma.ticket.count({
      where: {
        createdById: userId,
        priorityId: highPriority?.id,
      },
    })
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
