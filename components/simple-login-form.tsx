"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase-browser"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { SimpleForm, SimpleFormField } from "@/components/ui/simple-form"

export function SimpleLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()
  const supabase = createBrowserClient()
  const { toast } = useToast()

  // Login form
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Register form
  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // Login handler
  const onLoginSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao fazer login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Register handler
  const onRegisterSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Create user profile
      if (signUpData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: signUpData.user.id,
          name: data.name,
          email: data.email,
          is_admin: false,
        })

        if (profileError) {
          throw profileError
        }
      }

      toast({
        title: "Conta criada com sucesso",
        description: "Você já pode fazer login com suas credenciais",
      })

      setActiveTab("login")
      registerForm.reset()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao criar sua conta",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sistema de Suporte</CardTitle>
        <CardDescription className="text-center">Faça login ou crie uma conta para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <SimpleForm form={loginForm} onSubmit={onLoginSubmit} className="space-y-4 pt-4">
              <SimpleFormField name="email" label="Email" type="email" placeholder="seu@email.com" required>
                <Input type="email" placeholder="seu@email.com" {...loginForm.register("email", { required: true })} />
              </SimpleFormField>
              <SimpleFormField name="password" label="Senha" type="password" placeholder="******" required>
                <Input type="password" placeholder="******" {...loginForm.register("password", { required: true })} />
              </SimpleFormField>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </SimpleForm>
          </TabsContent>
          <TabsContent value="register">
            <SimpleForm form={registerForm} onSubmit={onRegisterSubmit} className="space-y-4 pt-4">
              <SimpleFormField name="name" label="Nome" placeholder="Seu nome" required>
                <Input placeholder="Seu nome" {...registerForm.register("name", { required: true })} />
              </SimpleFormField>
              <SimpleFormField name="email" label="Email" type="email" placeholder="seu@email.com" required>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  {...registerForm.register("email", { required: true })}
                />
              </SimpleFormField>
              <SimpleFormField name="password" label="Senha" type="password" placeholder="******" required>
                <Input
                  type="password"
                  placeholder="******"
                  {...registerForm.register("password", { required: true })}
                />
              </SimpleFormField>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </SimpleForm>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Sistema de Gerenciamento de Tickets de Suporte
      </CardFooter>
    </Card>
  )
}
