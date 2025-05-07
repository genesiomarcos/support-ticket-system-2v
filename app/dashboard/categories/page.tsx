import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CreateCategoryButton } from "@/components/categories/create-category-button"
import { getUserProfile } from "@/lib/user-service"

export default async function CategoriesPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  const userProfile = await getUserProfile(session.user.id)

  if (!userProfile?.is_admin) {
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
