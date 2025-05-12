"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface TicketOperationsProps {
  ticketId: string
  operations: any[]
  isCompleted: boolean
  user: any
}

export function TicketOperations({ ticketId, operations, isCompleted, user }: TicketOperationsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [operationText, setOperationText] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const addOperation = async () => {
    if (!operationText.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticketId}/operations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: operationText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add operation")
      }

      setOperationText("")
      toast({
        title: "Operação registrada",
        description: "Sua operação foi registrada com sucesso",
      })
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

  const completeTicket = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticketId}/complete`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to complete ticket")
      }

      toast({
        title: "Ticket finalizado",
        description: "O ticket foi finalizado com sucesso",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao finalizar ticket",
        description: error.message || "Ocorreu um erro ao finalizar o ticket",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {operations.length > 0 ? (
          operations.map((operation) => (
            <div key={operation.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback>{operation.user.name.charAt(0)}</AvatarFallback>
                <AvatarImage src={operation.user.image || "/placeholder.svg"} />
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{operation.user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(operation.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{operation.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">Nenhuma operação registrada</p>
        )}
      </CardContent>
      {!isCompleted && (
        <CardFooter className="flex-col gap-4">
          <Textarea
            placeholder="Registre uma operação..."
            value={operationText}
            onChange={(e) => setOperationText(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={completeTicket} disabled={isLoading}>
              {isLoading ? "Finalizando..." : "Finalizar ticket"}
            </Button>
            <Button onClick={addOperation} disabled={isLoading || !operationText.trim()}>
              {isLoading ? "Registrando..." : "Registrar operação"}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
