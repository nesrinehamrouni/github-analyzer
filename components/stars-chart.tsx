"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { GitHubRepo } from "@/lib/github"

interface StarsChartProps {
  repos: GitHubRepo[]
}

export function StarsChart({ repos }: StarsChartProps) {
  // Get top 10 most starred repositories
  const topRepos = repos
    .filter((repo) => repo.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((repo) => ({
      name: repo.name.length > 15 ? repo.name.substring(0, 15) + "..." : repo.name,
      fullName: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{data.fullName}</p>
          <p className="text-sm text-muted-foreground mb-1">Language: {data.language || "Unknown"}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            Stars: {data.stars}
          </p>
          <p className="text-sm" style={{ color: payload[1]?.color }}>
            Forks: {data.forks}
          </p>
        </div>
      )
    }
    return null
  }

  if (topRepos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Starred Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No starred repositories found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Starred Repositories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topRepos} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="stars" fill="hsl(var(--chart-2))" name="Stars" radius={[2, 2, 0, 0]} />
              <Bar dataKey="forks" fill="hsl(var(--chart-3))" name="Forks" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
