import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTicketStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "aberto":
      return "#3B82F6" // blue-500
    case "em andamento":
      return "#F59E0B" // amber-500
    case "aguardando":
      return "#8B5CF6" // violet-500
    case "finalizado":
      return "#10B981" // emerald-500
    case "cancelado":
      return "#EF4444" // red-500
    default:
      return "#6B7280" // gray-500
  }
}

export function getTicketPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "baixa":
      return "#10B981" // emerald-500
    case "média":
      return "#F59E0B" // amber-500
    case "alta":
      return "#EF4444" // red-500
    case "crítica":
      return "#7F1D1D" // red-900
    default:
      return "#6B7280" // gray-500
  }
}
