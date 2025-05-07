"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { EditStatusDialog } from "./edit-status-dialog"
import { Trash2 } from "lucide-react"

export function StatusesTable() {
  const [statuses, setStatuses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const loadStatuses = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("statuses").select("*").order("name")

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar status",
        description: error.message,
      })
    } else {
      setStatuses(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadStatuses()
  }, [])

  const deleteStatus = async (id: string) => {
    // Check if status is used in any ticket
    const { count } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status_id", id)

    if (count && count > 0) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Este status está sendo usado em tickets e não pode ser excluído",
      })
      return
    }

    const { error } = await supabase.from("statuses").delete().eq("id", id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir status",
        description: error.message,
      })
    } else {
      toast({
        title: "Status excluído",
        description: "O status foi excluído com sucesso",
      })
      loadStatuses()
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
          ) : statuses.length > 0 ? (
            statuses.map((status) => (
              <TableRow key={status.id}>
                <TableCell className="font-medium">{status.name}</TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: status.color }}>{status.color}</Badge>
                </TableCell>
                <TableCell>{format(new Date(status.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>
                  {status.updated_at ? format(new Date(status.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditStatusDialog status={status} onSuccess={loadStatuses} />
                    <Button variant="ghost" size="icon" onClick={() => deleteStatus(status.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhum status encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
