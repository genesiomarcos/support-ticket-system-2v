"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"

interface TicketDetailsProps {
  ticket: any
  isAdmin: boolean
}

export function TicketDetails({ ticket, isAdmin }: TicketDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [statuses, setStatuses] = useState<any[]>([])
  const [priorities, setPriorities] = useState<any[]>([])
  const [statusId, setStatusId] = useState(ticket.status.id)
  const [priorityId, setPriorityId] = useState(ticket.priority.id)
  const router = useRouter()
  const { toast } = useToast()

  const loadOptions = async () => {
    // Load statuses
    const statusesResponse = await fetch("/api/statuses")
    const statusesData = await statusesResponse.json()
    setStatuses(statusesData || [])

    // Load priorities
    const prioritiesResponse = await fetch("/api/priorities")
    const prioritiesData = await prioritiesResponse.json()
    setPriorities(prioritiesData || [])
  }

  const updateTicket = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statusId,
          priorityId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update ticket")
      }

      toast({
        title: "Ticket atualizado",
        description: "As informações do ticket foram atualizadas com sucesso",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar ticket",
        description: error.message || "Ocorreu um erro ao atualizar o ticket",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
            <CardDescription>
              Criado por {ticket.createdBy.name}{" "}
              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge style={{ backgroundColor: ticket.category.color }}>{ticket.category.name}</Badge>
            <Badge style={{ backgroundColor: ticket.priority.color }}>{ticket.priority.name}</Badge>
            <Badge style={{ backgroundColor: ticket.status.color }}>{ticket.status.name}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.completedAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>
                Finalizado em {format(new Date(ticket.completedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          )}

          {isAdmin && !ticket.completedAt && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  defaultValue={statusId}
                  onValueChange={(value) => setStatusId(value)}
                  onOpenChange={() => loadOptions()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <Select
                  defaultValue={priorityId}
                  onValueChange={(value) => setPriorityId(value)}
                  onOpenChange={() => loadOptions()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.id} value={priority.id}>
                        {priority.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {isAdmin && !ticket.completedAt && (
        <CardFooter>
          <Button onClick={updateTicket} disabled={isLoading} className="ml-auto">
            {isLoading ? "Atualizando..." : "Atualizar ticket"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
