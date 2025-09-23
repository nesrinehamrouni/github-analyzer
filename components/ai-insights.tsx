"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, User, TrendingUp, Target, Users } from "lucide-react"
import type { GitHubUser, GitHubRepo } from "@/lib/github"

interface AIInsightsProps {
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

export function AIInsights({ user, repos, languageStats, activityStats }: AIInsightsProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, repos, languageStats, activityStats }),
      })

      if (!response.ok) throw new Error("Failed to generate analysis")

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate analysis on component mount
  useEffect(() => {
    generateAnalysis()
  }, [])

  const parseAnalysis = (text: string) => {
    const sections = text.split(/\d+\.\s+/).filter(Boolean)
    const parsed = {
      summary: "",
      strengths: "",
      highlights: "",
      opportunities: "",
      impact: "",
    }

    sections.forEach((section, index) => {
      const content = section.trim()
      switch (index) {
        case 0:
          parsed.summary = content
          break
        case 1:
          parsed.strengths = content
          break
        case 2:
          parsed.highlights = content
          break
        case 3:
          parsed.opportunities = content
          break
        case 4:
          parsed.impact = content
          break
      }
    })

    return parsed
  }

  const insights = analysis ? parseAnalysis(analysis) : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Portfolio Analysis
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateAnalysis} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Analyzing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>AI is analyzing your portfolio...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-6">
            {insights.summary && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Developer Profile</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.summary}</p>
              </div>
            )}

            {insights.strengths && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                  <h3 className="font-semibold">Technical Strengths</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.strengths}</p>
              </div>
            )}

            {insights.highlights && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-chart-3" />
                  <h3 className="font-semibold">Portfolio Highlights</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.highlights}</p>
              </div>
            )}

            {insights.opportunities && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-chart-4" />
                  <h3 className="font-semibold">Growth Opportunities</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.opportunities}</p>
              </div>
            )}

            {insights.impact && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-5" />
                  <h3 className="font-semibold">Community Impact</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.impact}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
