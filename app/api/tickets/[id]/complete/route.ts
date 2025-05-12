import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { isAdmin: true, id: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Find completed status
    const completedStatus = await prisma.status.findFirst({
      where: {
        name: {
          equals: "Concluído",
          mode: "insensitive",
        },
      },
    })

    if (!completedStatus) {
      return NextResponse.json({ error: "Completed status not found" }, { status: 404 })
    }

    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: {
        statusId: completedStatus.id,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error completing ticket:", error)
    return NextResponse.json({ error: "Failed to complete ticket" }, { status: 500 })
  }
}
