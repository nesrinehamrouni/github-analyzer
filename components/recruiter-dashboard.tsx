"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, GitFork, ExternalLink, Calendar, Award, TrendingUp, Code, Users } from "lucide-react"
import { useState } from "react"
import type { GitHubRepo, GitHubUser } from "@/lib/github"

interface RecruiterDashboardProps {
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

export function RecruiterDashboard({ user, repos, languageStats, activityStats }: RecruiterDashboardProps) {
  const [techFilter, setTechFilter] = useState<string>("all")
  const [projectType, setProjectType] = useState<string>("all")

  // Calculate project impact scores
  const calculateImpactScore = (repo: GitHubRepo) => {
    const starWeight = repo.stargazers_count * 2
    const forkWeight = repo.forks_count * 3
    const recentActivity = new Date(repo.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) ? 10 : 0
    const hasDescription = repo.description ? 5 : 0
    const hasTopics = repo.topics && repo.topics.length > 0 ? 5 : 0

    return starWeight + forkWeight + recentActivity + hasDescription + hasTopics
  }

  // Get top impactful projects
  const impactfulProjects = repos
    .map((repo) => ({ ...repo, impactScore: calculateImpactScore(repo) }))
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 6)

  // Filter projects based on tech stack
  const filteredProjects = impactfulProjects.filter((repo) => {
    if (techFilter === "all") return true
    return repo.language?.toLowerCase().includes(techFilter.toLowerCase())
  })

  // Get unique technologies
  const technologies = Array.from(new Set(repos.map((repo) => repo.language).filter(Boolean)))

  // Calculate hiring metrics
  const hiringMetrics = {
    experienceLevel: activityStats.totalRepos > 20 ? "Senior" : activityStats.totalRepos > 10 ? "Mid-level" : "Junior",
    collaborationScore: repos.filter((repo) => repo.forks_count > 0).length,
    consistencyScore: activityStats.recentlyUpdated / activityStats.totalRepos,
    popularityScore: activityStats.totalStars,
    diversityScore: languageStats.length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Candidate Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{hiringMetrics.experienceLevel}</div>
              <div className="text-sm text-muted-foreground">Experience Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2">{hiringMetrics.collaborationScore}</div>
              <div className="text-sm text-muted-foreground">Collaborative Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">{Math.round(hiringMetrics.consistencyScore * 100)}%</div>
              <div className="text-sm text-muted-foreground">Activity Consistency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-4">{hiringMetrics.popularityScore}</div>
              <div className="text-sm text-muted-foreground">Community Recognition</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-5">{hiringMetrics.diversityScore}</div>
              <div className="text-sm text-muted-foreground">Tech Stack Diversity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Technical Skills Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {languageStats.slice(0, 8).map((lang) => (
              <div key={lang.language} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lang.language}</span>
                  <Badge variant="secondary">{lang.percentage.toFixed(1)}%</Badge>
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{Math.round(lang.bytes / 1024)} KB</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Most Impactful Projects
            </div>
            <div className="flex gap-2">
              <Select value={techFilter} onValueChange={setTechFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by tech" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech!}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredProjects.map((repo) => (
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
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Impact Score: {repo.impactScore}
                    </Badge>
                  </div>

                  <div className="bg-muted/50 rounded-md p-3 mb-3">
                    <p className="text-sm font-medium text-primary mb-1">🤖 AI Project Summary:</p>
                    <p className="text-sm text-muted-foreground">
                      {repo.description ||
                        "This project demonstrates technical skills in " +
                          repo.language +
                          " development with practical implementation and community engagement."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-medium">{repo.language}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">{repo.stargazers_count}</span> stars
                    </div>

                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span className="font-medium">{repo.forks_count}</span> forks
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Updated {formatDate(repo.updated_at)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {repo.topics && repo.topics.length > 0 && (
                      <>
                        {repo.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </>
                    )}
                    {repo.has_pages && (
                      <Badge variant="outline" className="text-xs">
                        Live Demo
                      </Badge>
                    )}
                    {repo.stargazers_count > 10 && (
                      <Badge variant="outline" className="text-xs">
                        Popular
                      </Badge>
                    )}
                    {new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                      <Badge variant="outline" className="text-xs">
                        Recently Active
                      </Badge>
                    )}
                  </div>
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            30-Second Elevator Pitch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 rounded-lg p-4">
            <p className="text-sm leading-relaxed">
              <strong>{user.name || user.login}</strong> is a {hiringMetrics.experienceLevel.toLowerCase()} developer
              with {activityStats.totalRepos} repositories and {activityStats.totalStars} stars across their work. They
              specialize in{" "}
              <strong>
                {languageStats
                  .slice(0, 3)
                  .map((l) => l.language)
                  .join(", ")}
              </strong>{" "}
              with proven experience in{" "}
              {hiringMetrics.collaborationScore > 5 ? "collaborative development" : "independent projects"}. Their most
              impactful work includes {impactfulProjects[0]?.name} with {impactfulProjects[0]?.stargazers_count} stars,
              demonstrating{" "}
              {hiringMetrics.consistencyScore > 0.5 ? "consistent activity" : "focused project development"} and strong
              technical execution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
