import prisma from "./prisma"

export async function getTicketById(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        category: true,
        status: true,
        priority: true,
        createdBy: true,
      },
    })

    return ticket
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return null
  }
}
