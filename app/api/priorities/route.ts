import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const name = url.searchParams.get("name")

    let priorities

    if (name) {
      priorities = await prisma.priority.findMany({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        orderBy: {
          name: "asc",
        },
      })
    } else {
      priorities = await prisma.priority.findMany({
        orderBy: {
          name: "asc",
        },
      })
    }

    return NextResponse.json(priorities)
  } catch (error) {
    console.error("Error fetching priorities:", error)
    return NextResponse.json({ error: "Failed to fetch priorities" }, { status: 500 })
  }
}
