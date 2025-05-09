import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  // Before each test, login as admin
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto("/")

    // Fill in the login form
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[name="password"]', "admin123")

    // Click the login button
    await page.click('button:has-text("Entrar")')

    // Wait for navigation to dashboard
    await page.waitForURL("/dashboard")
  })

  test("should display dashboard statistics", async ({ page }) => {
    // Verify dashboard stats are visible
    await expect(page.locator("text=Total de Tickets")).toBeVisible()
    await expect(page.locator("text=Tickets Abertos")).toBeVisible()
    await expect(page.locator("text=Tickets Resolvidos")).toBeVisible()
    await expect(page.locator("text=Alta Prioridade")).toBeVisible()
  })

  test("should navigate to tickets page", async ({ page }) => {
    // Click on the tickets link in sidebar
    await page.click('a:has-text("Tickets")')

    // Wait for navigation
    await page.waitForURL("/dashboard/tickets")

    // Verify we're on the tickets page
    expect(page.url()).toContain("/dashboard/tickets")
    await expect(page.locator('h1:has-text("Tickets")')).toBeVisible()
  })

  test("should navigate to categories page", async ({ page }) => {
    // Click on the categories link in sidebar
    await page.click('a:has-text("Categorias")')

    // Wait for navigation
    await page.waitForURL("/dashboard/categories")

    // Verify we're on the categories page
    expect(page.url()).toContain("/dashboard/categories")
    await expect(page.locator('h1:has-text("Categorias")')).toBeVisible()
  })

  test("should navigate to priorities page", async ({ page }) => {
    // Click on the priorities link in sidebar
    await page.click('a:has-text("Prioridades")')

    // Wait for navigation
    await page.waitForURL("/dashboard/priorities")

    // Verify we're on the priorities page
    expect(page.url()).toContain("/dashboard/priorities")
    await expect(page.locator('h1:has-text("Prioridades")')).toBeVisible()
  })

  test("should navigate to statuses page", async ({ page }) => {
    // Click on the statuses link in sidebar
    await page.click('a:has-text("Status")')

    // Wait for navigation
    await page.waitForURL("/dashboard/statuses")

    // Verify we're on the statuses page
    expect(page.url()).toContain("/dashboard/statuses")
    await expect(page.locator('h1:has-text("Status")')).toBeVisible()
  })

  test("should navigate to users page", async ({ page }) => {
    // Click on the users link in sidebar
    await page.click('a:has-text("Usuários")')

    // Wait for navigation
    await page.waitForURL("/dashboard/users")

    // Verify we're on the users page
    expect(page.url()).toContain("/dashboard/users")
    await expect(page.locator('h1:has-text("Usuários")')).toBeVisible()
  })

  test("should logout successfully", async ({ page }) => {
    // Click on the avatar to open dropdown
    await page.click("button.rounded-full")

    // Click on logout
    await page.click("text=Sair")

    // Wait for navigation to login page
    await page.waitForURL("/")

    // Verify we're on the login page
    expect(page.url()).toBe("http://localhost:3000/")
    await expect(page.locator("text=Sistema de Suporte")).toBeVisible()
  })
})
