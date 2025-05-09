import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Este email já está em uso" }, { status: 400 })
    }

    // Criar o usuário
    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    })

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ message: "Erro ao criar usuário" }, { status: 500 })
  }
}
