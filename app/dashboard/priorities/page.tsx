import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrioritiesTable } from "@/components/priorities/priorities-table"
import { CreatePriorityButton } from "@/components/priorities/create-priority-button"
import prisma from "@/lib/prisma"

export default async function PrioritiesPage() {
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
        <h1 className="text-3xl font-bold">Prioridades</h1>
        <CreatePriorityButton />
      </div>
      <PrioritiesTable />
    </div>
  )
}
