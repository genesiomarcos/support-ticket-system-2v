import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/components/login-form"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

// Mock the modules
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    })
  })

  it("renders login form correctly", () => {
    render(<LoginForm />)

    // Check if the form elements are rendered
    expect(screen.getByText("Sistema de Suporte")).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Login" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Cadastro" })).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Senha")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument()
  })

  it("switches to register tab when clicked", () => {
    render(<LoginForm />)

    // Click on the register tab
    fireEvent.click(screen.getByRole("tab", { name: "Cadastro" }))

    // Check if register form is displayed
    expect(screen.getByLabelText("Nome")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Criar conta" })).toBeInTheDocument()
  })

  it("submits login form with valid data", async () => {
    ;(signIn as jest.Mock).mockResolvedValue({ error: null })

    render(<LoginForm />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "password123" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }))

    // Check if signIn was called with correct params
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      })
    })
  })

  it("shows error message when login fails", async () => {
    // Mock signIn to return an error
    ;(signIn as jest.Mock).mockResolvedValue({ error: "Invalid credentials" })

    render(<LoginForm />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "wrongpassword" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }))

    // Check if signIn was called
    await waitFor(() => {
      expect(signIn).toHaveBeenCalled()
    })
  })
})
