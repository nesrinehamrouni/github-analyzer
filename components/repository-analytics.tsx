"use client"
import { LanguageBreakdown } from "./language-breakdown"
import { RepositoryInsights } from "./repository-insights"
import { ActivityTimeline } from "./activity-timeline"
import type { GitHubRepo } from "@/lib/github"

interface RepositoryAnalyticsProps {
  repos: GitHubRepo[]
  languageStats: Array<{
    language: string
    bytes: number
    percentage: number
  }>
}

export function RepositoryAnalytics({ repos, languageStats }: RepositoryAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LanguageBreakdown languageStats={languageStats} />
        </div>
        <div className="lg:col-span-2">
          <RepositoryInsights repos={repos} />
        </div>
      </div>

      <ActivityTimeline repos={repos} />
    </div>
  )
}
