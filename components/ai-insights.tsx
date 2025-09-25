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
  const [loading, setLoading] = useState(true) // Start with loading true
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

      const data = await response.json()

      if (!response.ok) {
        if (data.fallback) {
          // Show fallback content for quota errors
          setAnalysis(generateFallbackAnalysis())
          return
        }
        throw new Error(data.error || "Failed to generate analysis")
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackAnalysis = () => {
    const topLanguage = languageStats[0]?.language || "Unknown"
    const totalStars = activityStats.totalStars
    const totalRepos = activityStats.totalRepos
    const recentActivity = activityStats.recentlyUpdated

    return `1. Developer Profile Summary
This developer shows a strong focus on ${topLanguage} development with ${totalRepos} public repositories and ${totalStars} total stars. The portfolio demonstrates consistent activity with ${recentActivity} repositories updated recently.

2. Technical Strengths
Primary expertise in ${topLanguage} with a diverse repository portfolio. The developer shows good project organization and maintains active repositories, indicating strong development practices and commitment to open source.

3. Portfolio Highlights
Notable achievements include ${totalStars} total stars across all repositories, demonstrating community recognition. The ${recentActivity} recently updated repositories show ongoing development activity and project maintenance.

4. Growth Opportunities
Consider expanding into additional programming languages to diversify technical skills. Focus on creating more detailed README files and documentation to improve project discoverability and community engagement.

5. Community Impact
With ${totalStars} stars and ${totalRepos} repositories, this developer has made a meaningful contribution to the open source community. The active maintenance of repositories shows dedication to long-term project sustainability.`
  }

  // Auto-generate analysis on component mount
  useEffect(() => {
    generateAnalysis()
  }, [user, repos, languageStats, activityStats])

  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>') // Inline code
      .replace(/\n/g, '<br />') // Line breaks
  }

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
        {loading && !analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>AI is analyzing your portfolio...</span>
              </div>
            </div>
            
            {/* Skeleton loading content */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
            {error.includes("quota") && (
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Check your OpenAI billing at <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/account/billing</a>
              </p>
            )}
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
                <p 
                  className="text-sm text-muted-foreground leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(insights.summary) }}
                />
              </div>
            )}

            {insights.strengths && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                  <h3 className="font-semibold">Technical Strengths</h3>
                </div>
                <p 
                  className="text-sm text-muted-foreground leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(insights.strengths) }}
                />
              </div>
            )}

            {insights.highlights && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-chart-3" />
                  <h3 className="font-semibold">Portfolio Highlights</h3>
                </div>
                <p 
                  className="text-sm text-muted-foreground leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(insights.highlights) }}
                />
              </div>
            )}

            {insights.opportunities && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-chart-4" />
                  <h3 className="font-semibold">Growth Opportunities</h3>
                </div>
                <p 
                  className="text-sm text-muted-foreground leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(insights.opportunities) }}
                />
              </div>
            )}

            {insights.impact && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-5" />
                  <h3 className="font-semibold">Community Impact</h3>
                </div>
                <p 
                  className="text-sm text-muted-foreground leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(insights.impact) }}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
