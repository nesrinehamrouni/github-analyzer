"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GitHubRepo } from "@/lib/github"

interface ContributionHeatmapProps {
  repos: GitHubRepo[]
}

export function ContributionHeatmap({ repos }: ContributionHeatmapProps) {
  // Generate a simplified contribution heatmap based on repository updates
  const generateHeatmapData = () => {
    const weeks = []
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1) // Last 12 months

    // Generate weeks
    for (let week = 0; week < 52; week++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(startDate.getDate() + week * 7)

      const days = []
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(weekStart)
        currentDate.setDate(weekStart.getDate() + day)

        // Count repository updates on this day
        const updates = repos.filter((repo) => {
          const repoDate = new Date(repo.updated_at)
          return repoDate.toDateString() === currentDate.toDateString()
        }).length

        days.push({
          date: currentDate.toISOString().split("T")[0],
          count: updates,
          day: day,
        })
      }

      weeks.push(days)
    }

    return weeks
  }

  const heatmapData = generateHeatmapData()
  const maxCount = Math.max(...heatmapData.flat().map((d) => d.count))

  const getIntensity = (count: number) => {
    if (count === 0) return 0
    if (maxCount === 0) return 0
    return Math.min(Math.ceil((count / maxCount) * 4), 4)
  }

  const getColor = (intensity: number) => {
    const colors = [
      "bg-muted/30", // 0 - no activity
      "bg-primary/20", // 1 - low activity
      "bg-primary/40", // 2 - medium activity
      "bg-primary/60", // 3 - high activity
      "bg-primary/80", // 4 - very high activity
    ]
    return colors[intensity] || colors[0]
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-muted-foreground px-4">
            {monthLabels.map((month, index) => (
              <span key={month}>{month}</span>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
              {dayLabels.map((day, index) => (
                <div key={day} className="h-3 flex items-center">
                  {index % 2 === 1 ? day : ""}
                </div>
              ))}
            </div>

            {/* Heatmap cells */}
            <div className="flex gap-1">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm ${getColor(getIntensity(day.count))}`}
                      title={`${day.date}: ${day.count} updates`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div key={intensity} className={`w-3 h-3 rounded-sm ${getColor(intensity)}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
