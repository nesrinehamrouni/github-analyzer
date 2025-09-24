"use client"
import { LanguageChart } from "./language-chart"
import { ActivityChart } from "./activity-chart"
import { StarsChart } from "./stars-chart"
import type { GitHubRepo } from "@/lib/github"

interface DataVisualizationsProps {
  repos: GitHubRepo[]
  languageStats: Array<{
    language: string
    bytes: number
    percentage: number
  }>
}

export function DataVisualizations({ repos, languageStats }: DataVisualizationsProps) {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <LanguageChart languageStats={languageStats} />
        <ActivityChart repos={repos} />
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        <StarsChart repos={repos} />
      </div>
    </div>
  )
}
