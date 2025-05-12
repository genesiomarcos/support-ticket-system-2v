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

    const { description } = await request.json()

    const operation = await prisma.operation.create({
      data: {
        description,
        ticketId: params.id,
        userId: user.id,
      },
    })

    return NextResponse.json(operation)
  } catch (error) {
    console.error("Error creating operation:", error)
    return NextResponse.json({ error: "Failed to create operation" }, { status: 500 })
  }
}
