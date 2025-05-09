import { render, screen, fireEvent } from "@testing-library/react"
import { Header } from "@/components/header"
import { useSession, signOut } from "next-auth/react"
import { useSidebar } from "@/components/sidebar-provider"

// Mock the modules
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock("@/components/sidebar-provider", () => ({
  useSidebar: jest.fn(),
}))

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useSession
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      },
      status: "authenticated",
    })

    // Mock useSidebar
    ;(useSidebar as jest.Mock).mockReturnValue({
      toggle: jest.fn(),
      isOpen: false,
      close: jest.fn(),
    })
  })

  it("renders header correctly", () => {
    render(<Header />)

    // Check if the toggle menu button is rendered
    expect(screen.getByRole("button", { name: "Toggle menu" })).toBeInTheDocument()

    // Check if the avatar is rendered
    expect(screen.getByRole("img", { name: "Test User" })).toBeInTheDocument()
  })

  it("opens dropdown menu when avatar is clicked", () => {
    render(<Header />)

    // Click on the avatar button
    fireEvent.click(screen.getByRole("button", { name: /Test User/i }))

    // Check if dropdown menu is opened
    expect(screen.getByText("Minha conta")).toBeInTheDocument()
    expect(screen.getByText("Perfil")).toBeInTheDocument()
    expect(screen.getByText("Sair")).toBeInTheDocument()
  })

  it("calls signOut when logout button is clicked", () => {
    render(<Header />)

    // Click on the avatar button to open dropdown
    fireEvent.click(screen.getByRole("button", { name: /Test User/i }))

    // Click on the logout button
    fireEvent.click(screen.getByText("Sair"))

    // Check if signOut was called
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" })
  })

  it("calls toggle when menu button is clicked", () => {
    const toggleMock = jest.fn()
    ;(useSidebar as jest.Mock).mockReturnValue({
      toggle: toggleMock,
      isOpen: false,
      close: jest.fn(),
    })

    render(<Header />)

    // Click on the menu button
    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }))

    // Check if toggle was called
    expect(toggleMock).toHaveBeenCalled()
  })
})
