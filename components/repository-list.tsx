"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, GitFork, ExternalLink, Calendar } from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

interface RepositoryListProps {
  repos: GitHubRepo[]
  limit?: number
}

export function RepositoryList({ repos, limit = 10 }: RepositoryListProps) {
  const displayRepos = repos.slice(0, limit).sort((a, b) => b.stargazers_count - a.stargazers_count)

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
      Swift: "bg-orange-400",
      Kotlin: "bg-purple-600",
      Dart: "bg-blue-400",
      HTML: "bg-orange-500",
      CSS: "bg-blue-600",
      Shell: "bg-green-600",
    }
    return colors[language || ""] || "bg-gray-400"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Repositories</span>
          <Badge variant="secondary">{repos.length} total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayRepos.map((repo) => (
          <div key={repo.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
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
                  {repo.visibility === "private" && <Badge variant="outline">Private</Badge>}
                </div>

                {repo.description && (
                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{repo.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Updated {formatDate(repo.updated_at)}
                  </div>
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {repo.topics.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{repo.topics.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <Button variant="ghost" size="sm" asChild>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}

        {repos.length > limit && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Showing top {limit} of {repos.length} repositories
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
