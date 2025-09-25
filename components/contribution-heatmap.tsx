"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GitHubRepo } from "@/lib/github"

interface ContributionHeatmapProps {
  repos: GitHubRepo[]
  contributions: Record<string, number>
}

export function ContributionHeatmap({ repos, contributions }: ContributionHeatmapProps) {
  // Generate GitHub-style contribution heatmap data using real contribution data
  const generateHeatmapData = () => {
    const weeks = []
    const now = new Date()
    const startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()) // Last year

    // Generate 53 weeks (GitHub shows 53 weeks)
    for (let week = 0; week < 53; week++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(startDate.getDate() + week * 7)

      const days = []
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(weekStart)
        currentDate.setDate(weekStart.getDate() + day)
        const dateString = currentDate.toISOString().split("T")[0]

        // Use real contribution data if available, otherwise fall back to repository activity
        let count = contributions[dateString] || 0

        // If no contribution data, use repository activity as fallback
        if (count === 0) {
          const activity = repos.filter((repo) => {
            const repoDate = new Date(repo.updated_at)
            const isSameDay = repoDate.toDateString() === currentDate.toDateString()
            const isRecent = currentDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return isSameDay && isRecent
          }).length
          count = activity
        }

        days.push({
          date: dateString,
          count: count,
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

  // GitHub-style green color scheme
  const getColor = (intensity: number) => {
    const colors = [
      "bg-[#161b22] border border-[#30363d]", // 0 - no activity (GitHub's dark theme)
      "bg-[#0e4429] border border-[#30363d]", // 1 - low activity
      "bg-[#006d32] border border-[#30363d]", // 2 - medium activity
      "bg-[#26a641] border border-[#30363d]", // 3 - high activity
      "bg-[#39d353] border border-[#30363d]", // 4 - very high activity
    ]
    return colors[intensity] || colors[0]
  }

  const dayLabels = ["", "M", "", "W", "", "F", ""] // GitHub style - only show some days
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Get month positions for labels
  const getMonthPositions = () => {
    const positions = []
    const now = new Date()
    const startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
      const weekNumber = Math.floor((monthDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
      positions.push({ month: monthLabels[i], position: Math.max(0, weekNumber) })
    }
    
    return positions
  }

  const monthPositions = getMonthPositions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Month labels - GitHub style */}
          <div className="flex relative text-xs text-muted-foreground">
            {monthPositions.map(({ month, position }) => (
              <span 
                key={month} 
                className="absolute"
                style={{ left: `${(position / 53) * 100}%` }}
              >
                {month}
              </span>
            ))}
          </div>

          {/* Heatmap grid - GitHub style */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
              {dayLabels.map((day, index) => (
                <div key={index} className="h-3 flex items-center justify-center">
                  {day}
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
                      title={`${day.date}: ${day.count} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend - GitHub style */}
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
