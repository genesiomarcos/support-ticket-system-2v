"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres",
  }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Informe uma cor hexadecimal válida (ex: #FF0000)",
  }),
})

interface EditCategoryDialogProps {
  category: {
    id: string
    name: string
    color: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      color: category.color,
    },
  })

  // Update form values when category changes
  useEffect(() => {
    form.reset({
      name: category.name,
      color: category.color,
    })
  }, [category, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar categoria",
        description: error.message || "Ocorreu um erro ao atualizar a categoria",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir categoria",
        description: error.message || "Ocorreu um erro ao excluir a categoria",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar categoria</DialogTitle>
          <DialogDescription>Atualize as informações da categoria</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="#3B82F6" {...field} />
                    </FormControl>
                    <div
                      className="h-10 w-10 rounded-md border"
                      style={{ backgroundColor: field.value }}
                      aria-hidden="true"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:space-x-0">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                Excluir
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
