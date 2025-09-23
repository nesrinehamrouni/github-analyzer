"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Star, GitFork, Activity, TrendingUp, Clock } from "lucide-react"

interface StatsOverviewProps {
  activityStats: {
    totalRepos: number
    recentlyUpdated: number
    activeRepos: number
    totalStars: number
    totalForks: number
    averageStars: number
  }
}

export function StatsOverview({ activityStats }: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Repositories",
      value: activityStats.totalRepos,
      icon: GitBranch,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Stars",
      value: activityStats.totalStars,
      icon: Star,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Total Forks",
      value: activityStats.totalForks,
      icon: GitFork,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Recently Updated",
      value: activityStats.recentlyUpdated,
      subtitle: "Last 30 days",
      icon: Clock,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Active Repositories",
      value: activityStats.activeRepos,
      subtitle: "Last 6 months",
      icon: Activity,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      title: "Average Stars",
      value: activityStats.averageStars,
      subtitle: "Per repository",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
