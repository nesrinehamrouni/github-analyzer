"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, Briefcase, DollarSign, Target, AlertTriangle, TrendingUp, Users } from "lucide-react"
import type { GitHubUser, GitHubRepo } from "@/lib/github"

interface RecruiterAIInsightsProps {
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

export function RecruiterAIInsights({ user, repos, languageStats, activityStats }: RecruiterAIInsightsProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRecruiterAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/recruiter-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, repos, languageStats, activityStats }),
      })

      if (!response.ok) throw new Error("Failed to generate recruiter analysis")

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateRecruiterAnalysis()
  }, [user, repos, languageStats, activityStats])

  const parseRecruiterAnalysis = (text: string) => {
    const sections = text.split(/\d+\.\s+\*\*|\*\*/).filter(Boolean)
    return {
      recommendation: sections[1] || "",
      experience: sections[2] || "",
      strengths: sections[3] || "",
      roleFit: sections[4] || "",
      concerns: sections[5] || "",
      salary: sections[6] || "",
      interview: sections[7] || "",
    }
  }

  const insights = analysis ? parseRecruiterAnalysis(analysis) : null

  const getRecommendationColor = (text: string) => {
    if (text.toLowerCase().includes("strong hire")) return "bg-green-100 text-green-800 border-green-200"
    if (text.toLowerCase().includes("hire")) return "bg-blue-100 text-blue-800 border-blue-200"
    if (text.toLowerCase().includes("maybe")) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            AI Recruiter Assessment
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateRecruiterAnalysis} disabled={loading}>
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
              <span>AI is generating recruiter insights...</span>
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
            {insights.recommendation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Hiring Recommendation</h3>
                </div>
                <Badge className={`${getRecommendationColor(insights.recommendation)} border`}>
                  {insights.recommendation.split("**")[0]}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insights.recommendation.split("**")[1] || insights.recommendation}
                </p>
              </div>
            )}

            {insights.experience && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-2" />
                  <h3 className="font-semibold">Experience Level</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.experience}</p>
              </div>
            )}

            {insights.strengths && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-chart-3" />
                  <h3 className="font-semibold">Key Technical Strengths</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.strengths}</p>
              </div>
            )}

            {insights.roleFit && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-chart-4" />
                  <h3 className="font-semibold">Best Role Fit</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.roleFit}</p>
              </div>
            )}

            {insights.salary && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-chart-5" />
                  <h3 className="font-semibold">Salary Range Estimate</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.salary}</p>
              </div>
            )}

            {insights.concerns && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <h3 className="font-semibold">Areas of Concern</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.concerns}</p>
              </div>
            )}

            {insights.interview && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Interview Focus Areas</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.interview}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
