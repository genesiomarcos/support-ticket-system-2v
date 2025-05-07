"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase-browser"
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
  const [statusId, setStatusId] = useState(ticket.status_id)
  const [priorityId, setPriorityId] = useState(ticket.priority_id)
  const router = useRouter()
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const loadOptions = async () => {
    // Load statuses
    const { data: statusesData } = await supabase.from("statuses").select("id, name").order("name")

    setStatuses(statusesData || [])

    // Load priorities
    const { data: prioritiesData } = await supabase.from("priorities").select("id, name").order("name")

    setPriorities(prioritiesData || [])
  }

  const updateTicket = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("tickets")
        .update({
          status_id: statusId,
          priority_id: priorityId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticket.id)

      if (error) {
        throw error
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
              Criado por {ticket.profile.name}{" "}
              {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ptBR })}
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

          {ticket.completed_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>
                Finalizado em {format(new Date(ticket.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          )}

          {isAdmin && !ticket.completed_at && (
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
      {isAdmin && !ticket.completed_at && (
        <CardFooter>
          <Button onClick={updateTicket} disabled={isLoading} className="ml-auto">
            {isLoading ? "Atualizando..." : "Atualizar ticket"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
