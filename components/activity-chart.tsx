"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { GitHubRepo } from "@/lib/github"

interface ActivityChartProps {
  repos: GitHubRepo[]
}

interface MonthlyData {
  month: string
  monthKey: string
  created: number
  updated: number
  stars: number
}

export function ActivityChart({ repos }: ActivityChartProps) {
  // Group repositories by month for the last 12 months
  const generateMonthlyData = (): MonthlyData[] => {
    const months: MonthlyData[] = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })

      months.push({
        month: monthName,
        monthKey,
        created: 0,
        updated: 0,
        stars: 0,
      })
    }

    // Count repositories created and updated in each month
    repos.forEach((repo) => {
      const createdDate = new Date(repo.created_at)
      const updatedDate = new Date(repo.updated_at)

      const createdKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}`
      const updatedKey = `${updatedDate.getFullYear()}-${String(updatedDate.getMonth() + 1).padStart(2, "0")}`

      const createdMonth = months.find((m) => m.monthKey === createdKey)
      const updatedMonth = months.find((m) => m.monthKey === updatedKey)

      if (createdMonth) {
        createdMonth.created += 1
        createdMonth.stars += repo.stargazers_count
      }

      if (updatedMonth && updatedKey !== createdKey) {
        updatedMonth.updated += 1
      }
    })

    return months
  }

  const data = generateMonthlyData()

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Activity (Last 12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="created"
                stroke="var(--primary)"
                strokeWidth={2}
                name="Created"
                dot={{ fill: "var(--primary)", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="updated"
                stroke="var(--chart-2)"
                strokeWidth={2}
                name="Updated"
                dot={{ fill: "var(--chart-2)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
