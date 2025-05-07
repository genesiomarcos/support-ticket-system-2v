"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, TicketIcon, Tag, AlertTriangle, CheckCircle, Users, Settings } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tickets",
    href: "/dashboard/tickets",
    icon: TicketIcon,
  },
  {
    title: "Categorias",
    href: "/dashboard/categories",
    icon: Tag,
    adminOnly: true,
  },
  {
    title: "Prioridades",
    href: "/dashboard/priorities",
    icon: AlertTriangle,
    adminOnly: true,
  },
  {
    title: "Status",
    href: "/dashboard/statuses",
    icon: CheckCircle,
    adminOnly: true,
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

        setIsAdmin(data?.is_admin || false)
      }
    }

    checkUserRole()
  }, [supabase])

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={close}>
            <TicketIcon className="h-6 w-6" />
            <span>Sistema de Suporte</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>
      {isOpen && <div className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm lg:hidden" onClick={close} />}
    </>
  )
}
