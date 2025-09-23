"use client"
import { LanguageChart } from "./charts/language-chart"
import { ActivityChart } from "./charts/activity-chart"
import { StarsChart } from "./charts/stars-chart"
import { ContributionHeatmap } from "./charts/contribution-heatmap"
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

      <div className="grid lg:grid-cols-2 gap-6">
        <StarsChart repos={repos} />
        <ContributionHeatmap repos={repos} />
      </div>
    </div>
  )
}
