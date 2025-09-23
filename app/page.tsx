"use client"

import { useState } from "react"
import { GitHubConnect } from "@/components/github-connect"
import { UserProfile } from "@/components/user-profile"
import { StatsOverview } from "@/components/stats-overview"
import { RepositoryList } from "@/components/repository-list"
import { RepositoryAnalytics } from "@/components/repository-analytics"
import { DataVisualizations } from "@/components/data-visualizations"
import { AIInsights } from "@/components/ai-insights"
import { RepositorySummaries } from "@/components/repository-summaries"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecruiterToggle } from "@/components/recruiter-toggle"
import { RecruiterDashboard } from "@/components/recruiter-dashboard"
import { RecruiterAIInsights } from "@/components/recruiter-ai-insights"
import { ExportPortfolio } from "@/components/export-portfolio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GitHubUser, GitHubRepo } from "@/lib/github"

interface AnalysisData {
  user: GitHubUser
  repos: GitHubRepo[]
  languageStats: Array<{
    language: string
    bytes: number
    percentage: number
  }>
  activityStats: {
    totalRepos: number
    recentlyUpdated: number
    activeRepos: number
    totalStars: number
    totalForks: number
    averageStars: number
  }
}

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<{ username: string; token?: string } | null>(null)
  const [isRecruiterView, setIsRecruiterView] = useState(false)

  const handleConnect = async (username: string, token?: string) => {
    setCredentials({ username, token })
    await fetchData(username, token)
  }

  const fetchData = async (username: string, token?: string) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch user data
      const userParams = new URLSearchParams({ username })
      if (token) userParams.append("token", token)

      const userResponse = await fetch(`/api/github/user?${userParams}`)
      if (!userResponse.ok) throw new Error("Failed to fetch user data")
      const user = await userResponse.json()

      // Fetch repository data
      const repoParams = new URLSearchParams({ username })
      if (token) repoParams.append("token", token)

      const repoResponse = await fetch(`/api/github/repos?${repoParams}`)
      if (!repoResponse.ok) throw new Error("Failed to fetch repository data")
      const repoData = await repoResponse.json()

      setData({
        user,
        repos: repoData.repos,
        languageStats: repoData.languageStats,
        activityStats: repoData.activityStats,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (credentials) {
      fetchData(credentials.username, credentials.token)
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <GitHubConnect onConnect={handleConnect} loading={loading} />
        {error && (
          <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <DashboardHeader username={data.user.login} onRefresh={handleRefresh} loading={loading} />
          <RecruiterToggle isRecruiterView={isRecruiterView} onToggle={setIsRecruiterView} />
        </div>

        <UserProfile user={data.user} />

        <StatsOverview activityStats={data.activityStats} />

        {isRecruiterView ? (
          <Tabs defaultValue="assessment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="projects">Top Projects</TabsTrigger>
              <TabsTrigger value="ai-recruiter">AI Analysis</TabsTrigger>
              <TabsTrigger value="export">Export & Share</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="space-y-6">
              <RecruiterDashboard
                user={data.user}
                repos={data.repos}
                languageStats={data.languageStats}
                activityStats={data.activityStats}
              />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <RepositoryList repos={data.repos} limit={8} />
            </TabsContent>

            <TabsContent value="ai-recruiter" className="space-y-6">
              <RecruiterAIInsights
                user={data.user}
                repos={data.repos}
                languageStats={data.languageStats}
                activityStats={data.activityStats}
              />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <ExportPortfolio
                user={data.user}
                repos={data.repos}
                languageStats={data.languageStats}
                activityStats={data.activityStats}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="repositories" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="repositories">Repositories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="visualizations">Charts</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="repositories" className="space-y-6">
              <RepositoryList repos={data.repos} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <RepositoryAnalytics repos={data.repos} languageStats={data.languageStats} />
            </TabsContent>

            <TabsContent value="visualizations" className="space-y-6">
              <DataVisualizations repos={data.repos} languageStats={data.languageStats} />
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-6">
              <AIInsights
                user={data.user}
                repos={data.repos}
                languageStats={data.languageStats}
                activityStats={data.activityStats}
              />
              <RepositorySummaries repos={data.repos} />
            </TabsContent>
          </Tabs>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
