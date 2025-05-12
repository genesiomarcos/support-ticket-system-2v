import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CreateCategoryButton } from "@/components/categories/create-category-button"
import prisma from "@/lib/prisma"

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const userProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!userProfile?.isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <CreateCategoryButton />
      </div>
      <CategoriesTable />
    </div>
  )
}
