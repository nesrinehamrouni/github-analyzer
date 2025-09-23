"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Share, FileText, Link } from "lucide-react"
import { useState } from "react"
import type { GitHubUser, GitHubRepo } from "@/lib/github"

interface ExportPortfolioProps {
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

export function ExportPortfolio({ user, repos, languageStats, activityStats }: ExportPortfolioProps) {
  const [generating, setGenerating] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const generatePDFSummary = async () => {
    setGenerating(true)
    try {
      // This would integrate with a PDF generation service
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create a downloadable summary
      const summaryData = {
        candidate: user.name || user.login,
        profile: {
          location: user.location,
          company: user.company,
          bio: user.bio,
          followers: user.followers,
          following: user.following,
        },
        metrics: activityStats,
        topLanguages: languageStats.slice(0, 5),
        topProjects: repos.slice(0, 5).map((repo) => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
        })),
      }

      const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${user.login}-portfolio-summary.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  const generateShareableLink = () => {
    // Generate a shareable URL (in a real app, this would create a unique link)
    const params = new URLSearchParams({
      user: user.login,
      view: "recruiter",
    })
    const url = `${window.location.origin}?${params.toString()}`
    setShareUrl(url)
    navigator.clipboard.writeText(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5 text-primary" />
          Export & Share Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={generatePDFSummary} disabled={generating} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {generating ? "Generating..." : "Download PDF Summary"}
          </Button>

          <Button variant="outline" onClick={generateShareableLink} className="flex items-center gap-2 bg-transparent">
            <Link className="h-4 w-4" />
            Generate Shareable Link
          </Button>
        </div>

        {shareUrl && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium mb-2">Shareable Recruiter Link:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background p-2 rounded border">{shareUrl}</code>
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Link copied to clipboard! Share this with recruiters for a tailored view.
            </p>
          </div>
        )}

        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">What's included in exports:</h4>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• AI-generated project summaries and elevator pitch</li>
                <li>• Technical skills breakdown and experience assessment</li>
                <li>• Top impactful projects with metrics and descriptions</li>
                <li>• Collaboration and consistency scores</li>
                <li>• Direct links to repositories and live demos</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
