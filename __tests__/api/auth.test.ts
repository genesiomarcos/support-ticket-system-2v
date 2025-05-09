import type { NextRequest } from "next/server"
import { POST } from "@/app/api/register/route"
import prisma from "@/lib/prisma"
import { hash } from "bcrypt"
import { jest } from "@jest/globals"

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}))

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/register", () => {
    it("should register a new user successfully", async () => {
      // Mock request
      const request = {
        json: jest.fn().mockResolvedValue({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        }),
      } as unknown as NextRequest

      // Mock prisma responses
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
      })

      // Call the API handler
      const response = await POST(request)
      const responseData = await response.json()

      // Assertions
      expect(response.status).toBe(201)
      expect(responseData.message).toBe("Usuário criado com sucesso")
      expect(responseData.user).toHaveProperty("id")
      expect(responseData.user).toHaveProperty("name", "Test User")
      expect(responseData.user).toHaveProperty("email", "test@example.com")

      // Check if bcrypt.hash was called
      expect(hash).toHaveBeenCalledWith("password123", 10)

      // Check if prisma.user.create was called with correct data
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "hashed_password",
          isAdmin: false,
        },
      })
    })

    it("should return error if email already exists", async () => {
      // Mock request
      const request = {
        json: jest.fn().mockResolvedValue({
          name: "Test User",
          email: "existing@example.com",
          password: "password123",
        }),
      } as unknown as NextRequest

      // Mock prisma response for existing user
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "existing-user-id",
        email: "existing@example.com",
      })

      // Call the API handler
      const response = await POST(request)
      const responseData = await response.json()

      // Assertions
      expect(response.status).toBe(400)
      expect(responseData.message).toBe("Este email já está em uso")

      // Check that user.create was not called
      expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it("should handle server errors", async () => {
      // Mock request
      const request = {
        json: jest.fn().mockResolvedValue({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        }),
      } as unknown as NextRequest

      // Mock prisma to throw an error
      ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"))

      // Call the API handler
      const response = await POST(request)
      const responseData = await response.json()

      // Assertions
      expect(response.status).toBe(500)
      expect(responseData.message).toBe("Erro ao criar usuário")
    })
  })
})
