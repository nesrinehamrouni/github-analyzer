"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, Calendar, TrendingUp, Award } from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

interface RepositoryInsightsProps {
  repos: GitHubRepo[]
}

export function RepositoryInsights({ repos }: RepositoryInsightsProps) {
  // Calculate insights
  const mostStarred = repos.reduce((prev, current) =>
    prev.stargazers_count > current.stargazers_count ? prev : current,
  )

  const mostForked = repos.reduce((prev, current) => (prev.forks_count > current.forks_count ? prev : current))

  const mostRecent = repos.reduce((prev, current) =>
    new Date(prev.created_at) > new Date(current.created_at) ? prev : current,
  )

  const recentlyUpdated = repos
    .filter((repo) => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(repo.updated_at) > thirtyDaysAgo
    })
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  const topicCounts = repos.reduce(
    (acc, repo) => {
      repo.topics?.forEach((topic) => {
        acc[topic] = (acc[topic] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const insights = [
    {
      title: "Most Starred Repository",
      repo: mostStarred,
      icon: Star,
      color: "text-yellow-500",
      metric: `${mostStarred.stargazers_count} stars`,
    },
    {
      title: "Most Forked Repository",
      repo: mostForked,
      icon: GitFork,
      color: "text-blue-500",
      metric: `${mostForked.forks_count} forks`,
    },
    {
      title: "Newest Repository",
      repo: mostRecent,
      icon: Calendar,
      color: "text-green-500",
      metric: `Created ${formatDate(mostRecent.created_at)}`,
    },
  ]

  return (
    <div className="grid gap-6">
      {/* Top Repositories */}
      <div className="grid md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate">{insight.repo.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {insight.repo.description || "No description available"}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {insight.repo.language || "Unknown"}
                  </Badge>
                  <span className={`text-sm font-medium ${insight.color}`}>{insight.metric}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentlyUpdated.map((repo) => (
              <div key={repo.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{repo.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{repo.description || "No description"}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>Updated {formatDate(repo.updated_at)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Popular Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topTopics.map(([topic, count]) => (
              <Badge key={topic} variant="secondary" className="text-sm">
                {topic} ({count})
              </Badge>
            ))}
          </div>
          {topTopics.length === 0 && <p className="text-muted-foreground text-sm">No topics found in repositories</p>}
        </CardContent>
      </Card>
    </div>
  )
}
