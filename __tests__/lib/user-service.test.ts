import { getUserProfile } from "@/lib/user-service"
import prisma from "@/lib/prisma"
import { jest } from "@jest/globals"

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return user profile when found", async () => {
    // Mock user data
    const mockUser = {
      id: "user-id",
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Mock prisma response
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    // Call the service
    const result = await getUserProfile("user-id")

    // Assertions
    expect(result).toEqual(mockUser)
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-id" },
    })
  })

  it("should return null when user not found", async () => {
    // Mock prisma response
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    // Call the service
    const result = await getUserProfile("non-existent-id")

    // Assertions
    expect(result).toBeNull()
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "non-existent-id" },
    })
  })

  it("should return null when an error occurs", async () => {
    // Mock prisma to throw an error
    ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"))

    // Call the service
    const result = await getUserProfile("user-id")

    // Assertions
    expect(result).toBeNull()
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-id" },
    })
  })
})
