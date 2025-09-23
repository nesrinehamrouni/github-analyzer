"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface LanguageBreakdownProps {
  languageStats: Array<{
    language: string
    bytes: number
    percentage: number
  }>
}

export function LanguageBreakdown({ languageStats }: LanguageBreakdownProps) {
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
      Vue: "#2c3e50",
      React: "#61dafb",
    }
    return colors[language] || "#6b7280"
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const topLanguages = languageStats.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topLanguages.map((lang) => (
          <div key={lang.language} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLanguageColor(lang.language) }} />
                <span className="font-medium">{lang.language}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{lang.percentage.toFixed(1)}%</span>
                <span className="text-xs">({formatBytes(lang.bytes)})</span>
              </div>
            </div>
            <Progress value={lang.percentage} className="h-2" />
          </div>
        ))}

        {languageStats.length > 8 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">+{languageStats.length - 8} more languages</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
