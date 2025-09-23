"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, GitCommit, Plus } from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

interface ActivityTimelineProps {
  repos: GitHubRepo[]
}

export function ActivityTimeline({ repos }: ActivityTimelineProps) {
  // Group repositories by creation month
  const reposByMonth = repos.reduce(
    (acc, repo) => {
      const date = new Date(repo.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { year: "numeric", month: "long" })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          monthName,
          repos: [],
          date: date,
        }
      }
      acc[monthKey].repos.push(repo)
      return acc
    },
    {} as Record<string, { monthName: string; repos: GitHubRepo[]; date: Date }>,
  )

  // Sort by date (most recent first)
  const sortedMonths = Object.entries(reposByMonth)
    .sort(([, a], [, b]) => b.date.getTime() - a.date.getTime())
    .slice(0, 12) // Show last 12 months with activity

  // Calculate repository activity over time
  const activityData = repos
    .map((repo) => ({
      name: repo.name,
      created: new Date(repo.created_at),
      updated: new Date(repo.updated_at),
      stars: repo.stargazers_count,
      language: repo.language,
    }))
    .sort((a, b) => b.updated.getTime() - a.updated.getTime())

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
    <div className="grid gap-6">
      {/* Creation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Repository Creation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMonths.map(([monthKey, data]) => (
              <div key={monthKey} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="w-px bg-border h-full mt-2" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{data.monthName}</h3>
                    <Badge variant="secondary">{data.repos.length} repos</Badge>
                  </div>
                  <div className="grid gap-2">
                    {data.repos.slice(0, 3).map((repo) => (
                      <div key={repo.id} className="flex items-center gap-2 text-sm">
                        <Plus className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{repo.name}</span>
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                            <span className="text-muted-foreground text-xs">{repo.language}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {data.repos.length > 3 && (
                      <div className="text-xs text-muted-foreground ml-5">
                        +{data.repos.length - 3} more repositories
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-primary" />
            Recent Repository Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityData.slice(0, 10).map((repo) => (
              <div key={repo.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {repo.language && <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />}
                  <div>
                    <h4 className="font-medium">{repo.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Updated{" "}
                      {repo.updated.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{repo.stars} stars</div>
                  <div className="text-xs text-muted-foreground">
                    Created{" "}
                    {repo.created.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
