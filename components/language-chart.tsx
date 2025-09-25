"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface LanguageChartProps {
  languageStats: Array<{
    language: string
    bytes: number
    percentage: number
  }>
}

export function LanguageChart({ languageStats }: LanguageChartProps) {
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      Go: "#00ADD8",
      Rust: "#dea584",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#1572B6",
      Shell: "#89e051",
      Vue: "#4fc08d",
      React: "#61dafb",
    }
    return colors[language] || "#6b7280"
  }

  // Take top 8 languages and group the rest as "Others"
  const topLanguages = languageStats.slice(0, 8)
  const otherLanguages = languageStats.slice(8)

  const chartData = [...topLanguages]

  if (otherLanguages.length > 0) {
    const otherPercentage = otherLanguages.reduce((sum, lang) => sum + lang.percentage, 0)
    const otherBytes = otherLanguages.reduce((sum, lang) => sum + lang.bytes, 0)
    chartData.push({
      language: "Others",
      bytes: otherBytes,
      percentage: otherPercentage,
    })
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { language: string; percentage: number; bytes: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.language}</p>
          <p className="text-sm text-muted-foreground">
            {data.percentage.toFixed(1)}% ({(data.bytes / 1024).toFixed(1)} KB)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="percentage"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getLanguageColor(entry.language)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
