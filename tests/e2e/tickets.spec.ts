import { test, expect } from "@playwright/test"

test.describe("Tickets Management", () => {
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

    // Navigate to tickets page
    await page.click('a:has-text("Tickets")')
    await page.waitForURL("/dashboard/tickets")
  })

  test("should display tickets list", async ({ page }) => {
    // Verify tickets table is visible
    await expect(page.locator("table")).toBeVisible()
    await expect(page.locator('th:has-text("Assunto")')).toBeVisible()
    await expect(page.locator('th:has-text("Categoria")')).toBeVisible()
    await expect(page.locator('th:has-text("Prioridade")')).toBeVisible()
    await expect(page.locator('th:has-text("Status")')).toBeVisible()
  })

  test("should create a new ticket", async ({ page }) => {
    // First, we need to login as a regular user
    await page.click("button.rounded-full")
    await page.click("text=Sair")
    await page.waitForURL("/")

    // Register a new user
    await page.click('button:has-text("Cadastro")')
    const email = `user-${Date.now()}@example.com`
    await page.fill('input[name="name"]', "Regular User")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")
    await page.click('button:has-text("Criar conta")')

    // Login with the new user
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")
    await page.click('button:has-text("Entrar")')
    await page.waitForURL("/dashboard")

    // Navigate to tickets page
    await page.click('a:has-text("Tickets")')
    await page.waitForURL("/dashboard/tickets")

    // Click on new ticket button
    await page.click('button:has-text("Novo Ticket")')

    // Fill in the ticket form
    const ticketSubject = `Test Ticket ${Date.now()}`
    await page.fill('input[name="subject"]', ticketSubject)
    await page.fill('textarea[name="description"]', "This is a test ticket description")

    // Select a category
    await page.click('button:has-text("Selecione uma categoria")')
    await page.click('div[role="option"]:has-text("Problema técnico")')

    // Submit the form
    await page.click('button:has-text("Criar ticket")')

    // Verify success message
    await expect(page.locator("text=Ticket criado com sucesso")).toBeVisible()

    // Verify the new ticket appears in the list
    await expect(page.locator(`td:has-text("${ticketSubject}")`)).toBeVisible()
  })

  test("should view ticket details", async ({ page }) => {
    // Click on the first ticket's view button
    await page.click('button:has-text("Visualizar")')

    // Wait for navigation to ticket details page
    await page.waitForURL("/dashboard/tickets/**")

    // Verify ticket details are visible
    await expect(page.locator(".card-title")).toBeVisible()
    await expect(page.locator("text=Criado por")).toBeVisible()
  })

  test("should update ticket status and priority", async ({ page }) => {
    // Click on the first ticket's view button
    await page.click('button:has-text("Visualizar")')

    // Wait for navigation to ticket details page
    await page.waitForURL("/dashboard/tickets/**")

    // Change status
    await page.click('button:has-text("Selecione um status")')
    await page.click('div[role="option"]:has-text("Em andamento")')

    // Change priority
    await page.click('button:has-text("Selecione uma prioridade")')
    await page.click('div[role="option"]:has-text("Alta")')

    // Click update button
    await page.click('button:has-text("Atualizar ticket")')

    // Verify success message
    await expect(page.locator("text=Ticket atualizado")).toBeVisible()
  })

  test("should add a comment to a ticket", async ({ page }) => {
    // Click on the first ticket's view button
    await page.click('button:has-text("Visualizar")')

    // Wait for navigation to ticket details page
    await page.waitForURL("/dashboard/tickets/**")

    // Add a comment
    const commentText = `Test comment ${Date.now()}`
    await page.fill('textarea[name="content"]', commentText)
    await page.click('button:has-text("Enviar comentário")')

    // Verify success message
    await expect(page.locator("text=Comentário adicionado")).toBeVisible()

    // Verify the comment appears
    await expect(page.locator(`text=${commentText}`)).toBeVisible()
  })
})
