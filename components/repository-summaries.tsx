"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ExternalLink, Star, GitFork } from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

interface RepositorySummariesProps {
  repos: GitHubRepo[]
}

export function RepositorySummaries({ repos }: RepositorySummariesProps) {
  const [summaries, setSummaries] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState<Record<number, boolean>>({})

  // Get top 5 most starred repositories
  const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5)

  const generateSummary = async (repo: GitHubRepo) => {
    setLoading((prev) => ({ ...prev, [repo.id]: true }))

    try {
      const response = await fetch("/api/ai/repository-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo }),
      })

      if (!response.ok) throw new Error("Failed to generate summary")

      const data = await response.json()
      setSummaries((prev) => ({ ...prev, [repo.id]: data.summary }))
    } catch (error) {
      console.error("Failed to generate summary:", error)
      setSummaries((prev) => ({ ...prev, [repo.id]: "Failed to generate summary" }))
    } finally {
      setLoading((prev) => ({ ...prev, [repo.id]: false }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-orange-500",
      "C++": "bg-pink-500",
      C: "bg-gray-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-600",
      PHP: "bg-purple-500",
      Ruby: "bg-red-500",
    }
    return colors[language || ""] || "bg-gray-400"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Repository Summaries
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topRepos.map((repo) => (
          <div key={repo.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {repo.name}
                    </a>
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                      {repo.language}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {repo.stargazers_count}
                  </div>

                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    {repo.forks_count}
                  </div>

                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>

                {repo.description && (
                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{repo.description}</p>
                )}

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Summary Section */}
            <div className="border-t pt-3">
              {summaries[repo.id] ? (
                <div className="bg-accent/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">AI Analysis</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{summaries[repo.id]}</p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSummary(repo)}
                  disabled={loading[repo.id]}
                  className="w-full"
                >
                  {loading[repo.id] ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      Generating AI Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Summary
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
