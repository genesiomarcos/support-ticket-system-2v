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

interface TicketCommentsProps {
  ticketId: string
  comments: any[]
  user: any
}

export function TicketComments({ ticketId, comments, user }: TicketCommentsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [commentText, setCommentText] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const addComment = async () => {
    if (!commentText.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      setCommentText("")
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso",
      })
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                <AvatarImage src={comment.user.image || "/placeholder.svg"} />
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{comment.user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">Nenhum comentário ainda</p>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Textarea
          placeholder="Adicione um comentário..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={addComment} disabled={isLoading || !commentText.trim()} className="ml-auto">
          {isLoading ? "Enviando..." : "Enviar comentário"}
        </Button>
      </CardFooter>
    </Card>
  )
}
