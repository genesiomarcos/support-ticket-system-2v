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
import { Trash2 } from "lucide-react"

const formSchema = z.object({
  description: z.string().min(5, {
    message: "A descrição deve ter pelo menos 5 caracteres",
  }),
})

interface TicketOperationsProps {
  ticketId: string
}

export function TicketOperations({ ticketId }: TicketOperationsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [operations, setOperations] = useState<any[]>([])
  const router = useRouter()
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  })

  const loadOperations = async () => {
    const { data } = await supabase
      .from("operations")
      .select(`
        id,
        description,
        created_at,
        profiles (
          id,
          name
        )
      `)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true })

    setOperations(data || [])
  }

  useEffect(() => {
    loadOperations()
  }, [ticketId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      // Create operation
      const { error } = await supabase.from("operations").insert({
        description: values.description,
        ticket_id: ticketId,
        user_id: user.id,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Operação registrada",
        description: "A operação foi registrada com sucesso",
      })

      form.reset()
      loadOperations()
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar operação",
        description: error.message || "Ocorreu um erro ao registrar a operação",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteOperation = async (operationId: string) => {
    try {
      const { error } = await supabase.from("operations").delete().eq("id", operationId)

      if (error) {
        throw error
      }

      toast({
        title: "Operação excluída",
        description: "A operação foi excluída com sucesso",
      })

      loadOperations()
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir operação",
        description: error.message || "Ocorreu um erro ao excluir a operação",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operações</CardTitle>
        <CardDescription>Registre as operações realizadas neste ticket</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {operations.length > 0 ? (
            <div className="space-y-4">
              {operations.map((operation) => (
                <div key={operation.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{operation.profiles.name}</span>
                      <span> • </span>
                      <span>{format(new Date(operation.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteOperation(operation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{operation.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">Nenhuma operação registrada</div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova operação</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva a operação realizada" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar operação"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
