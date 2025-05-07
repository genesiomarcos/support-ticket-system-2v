"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { EditUserDialog } from "./edit-user-dialog"
import { Trash2 } from "lucide-react"

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const loadUsers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("profiles").select("*").order("name")

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: error.message,
      })
    } else {
      setUsers(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const deleteUser = async (id: string) => {
    // Check if user has created any tickets
    const { count } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("created_by", id)

    if (count && count > 0) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Este usuário possui tickets criados e não pode ser excluído",
      })
      return
    }

    try {
      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) {
        throw authError
      }

      // Profile will be deleted automatically due to cascade delete

      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso",
      })
      loadUsers()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro ao excluir o usuário",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.is_admin ? "default" : "outline"}>
                    {user.is_admin ? "Administrador" : "Usuário"}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(user.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>
                  {user.updated_at ? format(new Date(user.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditUserDialog user={user} onSuccess={loadUsers} />
                    <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
