"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { EditCategoryDialog } from "./edit-category-dialog"
import { Trash2 } from "lucide-react"

export function CategoriesTable() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const loadCategories = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar categorias",
        description: error.message,
      })
    } else {
      setCategories(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const deleteCategory = async (id: string) => {
    // Check if category is used in any ticket
    const { count } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("category_id", id)

    if (count && count > 0) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Esta categoria está sendo usada em tickets e não pode ser excluída",
      })
      return
    }

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir categoria",
        description: error.message,
      })
    } else {
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso",
      })
      loadCategories()
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
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: category.color }}>{category.color}</Badge>
                </TableCell>
                <TableCell>{format(new Date(category.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>
                  {category.updated_at
                    ? format(new Date(category.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditCategoryDialog category={category} onSuccess={loadCategories} />
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhuma categoria encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
