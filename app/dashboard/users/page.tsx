import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { UsersTable } from "@/components/users/users-table"
import { CreateUserButton } from "@/components/users/create-user-button"
import { getUserProfile } from "@/lib/user-service"

export default async function UsersPage() {
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
        <h1 className="text-3xl font-bold">Usuários</h1>
        <CreateUserButton />
      </div>
      <UsersTable />
    </div>
  )
}
