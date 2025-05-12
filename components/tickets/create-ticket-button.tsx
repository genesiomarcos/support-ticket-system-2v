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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

const formSchema = z.object({
  subject: z.string().min(3, {
    message: "O assunto deve ter pelo menos 3 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  category_id: z.string({
    required_error: "Selecione uma categoria",
  }),
})

export function CreateTicketButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      category_id: "",
    },
  })

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data || [])
    } catch (error) {
      console.error("Error loading categories:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar categorias",
        description: "Ocorreu um erro ao carregar as categorias",
      })
    }
  }

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // Get default status and priority
      const statusResponse = await fetch("/api/statuses?name=Aberto")
      const statusData = await statusResponse.json()
      const defaultStatus = statusData[0]

      const priorityResponse = await fetch("/api/priorities?name=Média")
      const priorityData = await priorityResponse.json()
      const defaultPriority = priorityData[0]

      // Create ticket
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: values.subject,
          description: values.description,
          categoryId: values.category_id,
          statusId: defaultStatus?.id,
          priorityId: defaultPriority?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create ticket")
      }

      const data = await response.json()

      toast({
        title: "Ticket criado com sucesso",
        description: "Seu ticket foi criado e está aguardando atendimento",
      })

      setOpen(false)
      form.reset()
      router.refresh()

      // Navigate to the new ticket
      if (data?.id) {
        router.push(`/dashboard/tickets/${data.id}`)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar ticket",
        description: error.message || "Ocorreu um erro ao criar o ticket",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar novo ticket</DialogTitle>
          <DialogDescription>Preencha as informações abaixo para criar um novo ticket de suporte</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o assunto do ticket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva detalhadamente o problema" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar ticket"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
