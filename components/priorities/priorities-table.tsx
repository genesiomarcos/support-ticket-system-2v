"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { EditPriorityDialog } from "./edit-priority-dialog"
import { Trash2 } from "lucide-react"

export function PrioritiesTable() {
  const [priorities, setPriorities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const loadPriorities = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("priorities").select("*").order("name")

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar prioridades",
        description: error.message,
      })
    } else {
      setPriorities(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadPriorities()
  }, [])

  const deletePriority = async (id: string) => {
    // Check if priority is used in any ticket
    const { count } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("priority_id", id)

    if (count && count > 0) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Esta prioridade está sendo usada em tickets e não pode ser excluída",
      })
      return
    }

    const { error } = await supabase.from("priorities").delete().eq("id", id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir prioridade",
        description: error.message,
      })
    } else {
      toast({
        title: "Prioridade excluída",
        description: "A prioridade foi excluída com sucesso",
      })
      loadPriorities()
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : priorities.length > 0 ? (
            priorities.map((priority) => (
              <TableRow key={priority.id}>
                <TableCell className="font-medium">{priority.name}</TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: priority.color }}>{priority.color}</Badge>
                </TableCell>
                <TableCell>{format(new Date(priority.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>
                  {priority.updated_at
                    ? format(new Date(priority.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditPriorityDialog priority={priority} onSuccess={loadPriorities} />
                    <Button variant="ghost" size="icon" onClick={() => deletePriority(priority.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhuma prioridade encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
