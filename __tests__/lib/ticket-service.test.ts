import { getTicketById } from "@/lib/ticket-service"
import prisma from "@/lib/prisma"
import { jest } from "@jest/globals"

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    ticket: {
      findUnique: jest.fn(),
    },
  },
}))

describe("Ticket Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return ticket when found", async () => {
    // Mock ticket data
    const mockTicket = {
      id: "ticket-id",
      subject: "Test Ticket",
      description: "Test Description",
      categoryId: "category-id",
      statusId: "status-id",
      priorityId: "priority-id",
      createdById: "user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
      category: {
        id: "category-id",
        name: "Problem",
        color: "#ff0000",
      },
      status: {
        id: "status-id",
        name: "Open",
        color: "#00ff00",
      },
      priority: {
        id: "priority-id",
        name: "High",
        color: "#0000ff",
      },
      createdBy: {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      },
    }

    // Mock prisma response
    ;(prisma.ticket.findUnique as jest.Mock).mockResolvedValue(mockTicket)

    // Call the service
    const result = await getTicketById("ticket-id")

    // Assertions
    expect(result).toEqual(mockTicket)
    expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
      where: { id: "ticket-id" },
      include: {
        category: true,
        status: true,
        priority: true,
        createdBy: true,
      },
    })
  })

  it("should return null when ticket not found", async () => {
    // Mock prisma response
    ;(prisma.ticket.findUnique as jest.Mock).mockResolvedValue(null)

    // Call the service
    const result = await getTicketById("non-existent-id")

    // Assertions
    expect(result).toBeNull()
    expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
      where: { id: "non-existent-id" },
      include: {
        category: true,
        status: true,
        priority: true,
        createdBy: true,
      },
    })
  })

  it("should return null when an error occurs", async () => {
    // Mock prisma to throw an error
    ;(prisma.ticket.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"))

    // Call the service
    const result = await getTicketById("ticket-id")

    // Assertions
    expect(result).toBeNull()
    expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
      where: { id: "ticket-id" },
      include: {
        category: true,
        status: true,
        priority: true,
        createdBy: true,
      },
    })
  })
})
