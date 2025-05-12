import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { subject, description, categoryId, statusId, priorityId } = await request.json()

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        categoryId,
        statusId,
        priorityId,
        createdById: user.id,
      },
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
