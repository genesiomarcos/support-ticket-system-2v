"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase-browser"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Edit } from "lucide-react"

const formSchema = z.object({
  content: z.string().min(3, {
    message: "O comentário deve ter pelo menos 3 caracteres",
  }),
})

interface TicketCommentsProps {
  ticketId: string
  userId: string
}

export function TicketComments({ ticketId, userId }: TicketCommentsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const loadComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          id,
          name
        )
      `)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true })

    setComments(data || [])
  }

  useEffect(() => {
    loadComments()
  }, [ticketId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // Create comment
      const { error } = await supabase.from("comments").insert({
        content: values.content,
        ticket_id: ticketId,
        user_id: userId,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso",
      })

      form.reset()
      loadComments()
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar comentário",
        description: error.message || "Ocorreu um erro ao adicionar o comentário",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (comment: any) => {
    editForm.setValue("content", comment.content)
    setEditingCommentId(comment.id)
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
    editForm.reset()
  }

  const updateComment = async (values: z.infer<typeof formSchema>) => {
    if (!editingCommentId) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("comments")
        .update({
          content: values.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingCommentId)

      if (error) {
        throw error
      }

      toast({
        title: "Comentário atualizado",
        description: "Seu comentário foi atualizado com sucesso",
      })

      setEditingCommentId(null)
      editForm.reset()
      loadComments()
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar comentário",
        description: error.message || "Ocorreu um erro ao atualizar o comentário",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId)

      if (error) {
        throw error
      }

      toast({
        title: "Comentário excluído",
        description: "O comentário foi excluído com sucesso",
      })

      loadComments()
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir comentário",
        description: error.message || "Ocorreu um erro ao excluir o comentário",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentários</CardTitle>
        <CardDescription>Discussão sobre este ticket</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-md border p-4">
                  {editingCommentId === comment.id ? (
                    <Form {...editForm}>
                      <form onSubmit={editForm.handleSubmit(updateComment)} className="space-y-4">
                        <FormField
                          control={editForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea className="min-h-[100px]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <Button type="submit" size="sm" disabled={isLoading}>
                            {isLoading ? "Salvando..." : "Salvar"}
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{comment.profiles.name}</span>
                          <span> • </span>
                          <span>{format(new Date(comment.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                        </div>
                        {comment.user_id === userId && (
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => startEditing(comment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteComment(comment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">Nenhum comentário ainda</div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Novo comentário</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Escreva seu comentário" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar comentário"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
