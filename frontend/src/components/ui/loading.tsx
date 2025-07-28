"use client"

import { useLoading } from "@/contexts/loading-context"
import { Loader2 } from "lucide-react"

export function Loading() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-4 rounded-lg shadow-lg flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Carregando...</span>
      </div>
    </div>
  )
}
