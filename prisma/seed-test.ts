import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding test database...")

  // Criar categorias
  const categories = [
    { name: "Problema técnico", color: "#EF4444" },
    { name: "Dúvida", color: "#3B82F6" },
    { name: "Solicitação", color: "#10B981" },
    { name: "Reclamação", color: "#F59E0B" },
    { name: "Sugestão", color: "#8B5CF6" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Criar prioridades
  const priorities = [
    { name: "Baixa", color: "#10B981" },
    { name: "Média", color: "#F59E0B" },
    { name: "Alta", color: "#EF4444" },
    { name: "Crítica", color: "#7F1D1D" },
  ]

  for (const priority of priorities) {
    await prisma.priority.upsert({
      where: { name: priority.name },
      update: {},
      create: priority,
    })
  }

  // Criar status
  const statuses = [
    { name: "Aberto", color: "#3B82F6" },
    { name: "Em andamento", color: "#F59E0B" },
    { name: "Aguardando", color: "#8B5CF6" },
    { name: "Finalizado", color: "#10B981" },
    { name: "Cancelado", color: "#EF4444" },
  ]

  for (const status of statuses) {
    await prisma.status.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    })
  }

  // Criar usuário administrador
  const adminPassword = await hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@example.com",
      password: adminPassword,
      isAdmin: true,
    },
  })

  // Criar usuário regular para testes
  const userPassword = await hash("user123", 10)
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Usuário Teste",
      email: "user@example.com",
      password: userPassword,
      isAdmin: false,
    },
  })

  // Criar alguns tickets para testes
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@example.com" } })
  const regularUser = await prisma.user.findUnique({ where: { email: "user@example.com" } })
  const openStatus = await prisma.status.findUnique({ where: { name: "Aberto" } })
  const mediumPriority = await prisma.priority.findUnique({ where: { name: "Média" } })
  const technicalCategory = await prisma.category.findUnique({ where: { name: "Problema técnico" } })

  if (adminUser && regularUser && openStatus && mediumPriority && technicalCategory) {
    // Ticket criado pelo usuário regular
    await prisma.ticket.upsert({
      where: { id: "test-ticket-1" },
      update: {},
      create: {
        id: "test-ticket-1",
        subject: "Problema com login",
        description: "Não consigo fazer login no sistema",
        categoryId: technicalCategory.id,
        statusId: openStatus.id,
        priorityId: mediumPriority.id,
        createdById: regularUser.id,
      },
    })

    // Ticket criado pelo admin
    await prisma.ticket.upsert({
      where: { id: "test-ticket-2" },
      update: {},
      create: {
        id: "test-ticket-2",
        subject: "Atualização do sistema",
        description: "Precisamos atualizar o sistema para a versão mais recente",
        categoryId: technicalCategory.id,
        statusId: openStatus.id,
        priorityId: mediumPriority.id,
        createdById: adminUser.id,
      },
    })
  }

  console.log("Test database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding test database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
