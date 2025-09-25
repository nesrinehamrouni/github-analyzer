"use client"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface DashboardHeaderProps {
  username: string
  onRefresh?: () => void
  loading?: boolean
}

export function DashboardHeader({ username, onRefresh, loading }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-balance">GitHub Portfolio Analysis</h1>
        <p className="text-muted-foreground">Comprehensive insights for @{username}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  )
}
