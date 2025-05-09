import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
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

  console.log("Banco de dados inicializado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
