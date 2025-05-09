import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should allow user to login", async ({ page }) => {
    // Navigate to the login page
    await page.goto("/")

    // Fill in the login form
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[name="password"]', "admin123")

    // Click the login button
    await page.click('button:has-text("Entrar")')

    // Wait for navigation to dashboard
    await page.waitForURL("/dashboard")

    // Verify we're on the dashboard page
    expect(page.url()).toContain("/dashboard")

    // Verify dashboard elements are visible
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
  })

  test("should show error for invalid credentials", async ({ page }) => {
    // Navigate to the login page
    await page.goto("/")

    // Fill in the login form with invalid credentials
    await page.fill('input[name="email"]', "wrong@example.com")
    await page.fill('input[name="password"]', "wrongpassword")

    // Click the login button
    await page.click('button:has-text("Entrar")')

    // Verify we're still on the login page
    expect(page.url()).not.toContain("/dashboard")

    // Verify error message is shown
    await expect(page.locator("text=Erro ao fazer login")).toBeVisible()
  })

  test("should allow user to register", async ({ page }) => {
    // Navigate to the login page
    await page.goto("/")

    // Switch to register tab
    await page.click('button:has-text("Cadastro")')

    // Fill in the registration form
    const email = `test-${Date.now()}@example.com`
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")

    // Click the register button
    await page.click('button:has-text("Criar conta")')

    // Verify success message
    await expect(page.locator("text=Conta criada com sucesso")).toBeVisible()

    // Verify we're back on the login tab
    await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Login")')).toBeVisible()
  })
})
