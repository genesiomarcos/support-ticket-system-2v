import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const name = url.searchParams.get("name")

    let statuses

    if (name) {
      statuses = await prisma.status.findMany({
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
      statuses = await prisma.status.findMany({
        orderBy: {
          name: "asc",
        },
      })
    }

    return NextResponse.json(statuses)
  } catch (error) {
    console.error("Error fetching statuses:", error)
    return NextResponse.json({ error: "Failed to fetch statuses" }, { status: 500 })
  }
}
