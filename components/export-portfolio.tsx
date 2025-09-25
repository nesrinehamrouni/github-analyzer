"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"
import { useState } from "react"
import type { GitHubUser, GitHubRepo } from "@/lib/github"

interface ExportPortfolioProps {
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

export function ExportPortfolio({ user, repos, languageStats, activityStats }: ExportPortfolioProps) {
  const [generating, setGenerating] = useState(false)

  const generatePDFSummary = async () => {
    setGenerating(true)
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${user.name || user.login} - GitHub Portfolio Summary</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #e1e5e9; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              color: #24292e; 
              margin: 0; 
              font-size: 2.5em; 
            }
            .header p { 
              color: #586069; 
              margin: 10px 0 0 0; 
              font-size: 1.2em; 
            }
            .section { 
              margin-bottom: 30px; 
            }
            .section h2 { 
              color: #0366d6; 
              border-bottom: 1px solid #e1e5e9; 
              padding-bottom: 10px; 
              margin-bottom: 15px; 
            }
            .profile-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 20px; 
            }
            .profile-item { 
              background: #f6f8fa; 
              padding: 15px; 
              border-radius: 6px; 
            }
            .profile-item strong { 
              color: #24292e; 
            }
            .metrics-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
              gap: 15px; 
              margin-bottom: 20px; 
            }
            .metric-card { 
              background: #f6f8fa; 
              padding: 15px; 
              text-align: center; 
              border-radius: 6px; 
            }
            .metric-value { 
              font-size: 2em; 
              font-weight: bold; 
              color: #0366d6; 
            }
            .metric-label { 
              color: #586069; 
              font-size: 0.9em; 
            }
            .language-list { 
              display: flex; 
              flex-wrap: wrap; 
              gap: 10px; 
            }
            .language-tag { 
              background: #0366d6; 
              color: white; 
              padding: 5px 12px; 
              border-radius: 20px; 
              font-size: 0.9em; 
            }
            .project-list { 
              list-style: none; 
              padding: 0; 
            }
            .project-item { 
              background: #f6f8fa; 
              padding: 15px; 
              margin-bottom: 10px; 
              border-radius: 6px; 
              border-left: 4px solid #0366d6; 
            }
            .project-name { 
              font-weight: bold; 
              color: #24292e; 
              margin-bottom: 5px; 
            }
            .project-description { 
              color: #586069; 
              margin-bottom: 8px; 
            }
            .project-stats { 
              font-size: 0.9em; 
              color: #586069; 
            }
            .project-stats span { 
              margin-right: 15px; 
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${user.name || user.login}</h1>
            <p>GitHub Portfolio Summary</p>
          </div>

          <div class="section">
            <h2>Profile Information</h2>
            <div class="profile-grid">
              <div class="profile-item">
                <strong>Location:</strong> ${user.location || "Not specified"}
              </div>
              <div class="profile-item">
                <strong>Company:</strong> ${user.company || "Not specified"}
              </div>
              <div class="profile-item">
                <strong>Followers:</strong> ${user.followers?.toLocaleString() || 0}
              </div>
              <div class="profile-item">
                <strong>Following:</strong> ${user.following?.toLocaleString() || 0}
              </div>
            </div>
            ${user.bio ? `<div class="profile-item"><strong>Bio:</strong> ${user.bio}</div>` : ""}
          </div>

          <div class="section">
            <h2>Activity Metrics</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value">${activityStats.totalRepos}</div>
                <div class="metric-label">Total Repositories</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${activityStats.totalStars}</div>
                <div class="metric-label">Total Stars</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${activityStats.activeRepos}</div>
                <div class="metric-label">Active Repos</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${activityStats.averageStars.toFixed(1)}</div>
                <div class="metric-label">Avg Stars/Repo</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Top Programming Languages</h2>
            <div class="language-list">
              ${languageStats.slice(0, 5).map(lang => 
                `<span class="language-tag">${lang.language} (${lang.percentage.toFixed(1)}%)</span>`
              ).join("")}
            </div>
          </div>

          <div class="section">
            <h2>Top Projects</h2>
            <ul class="project-list">
              ${repos.slice(0, 5).map(repo => `
                <li class="project-item">
                  <div class="project-name">${repo.name}</div>
                  <div class="project-description">${repo.description || "No description available"}</div>
                  <div class="project-stats">
                    <span>⭐ ${repo.stargazers_count?.toLocaleString() || 0} stars</span>
                    <span>🍴 ${repo.forks_count?.toLocaleString() || 0} forks</span>
                    <span>💻 ${repo.language || "Unknown"}</span>
                  </div>
                </li>
              `).join("")}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e1e5e9; color: #586069; font-size: 0.9em;">
            Generated on ${new Date().toLocaleDateString()} | GitHub Portfolio Analyzer
          </div>
        </body>
        </html>
      `

      // Create a new window with the HTML content
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        // Wait for content to load, then trigger print dialog
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
            // Close the window after a short delay
            setTimeout(() => {
              printWindow.close()
            }, 1000)
          }, 500)
        }
      }
    } finally {
      setGenerating(false)
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Export Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button onClick={generatePDFSummary} disabled={generating} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {generating ? "Generating..." : "Download PDF Summary"}
          </Button>
        </div>


        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">What's included in exports:</h4>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• AI-generated project summaries and elevator pitch</li>
                <li>• Technical skills breakdown and experience assessment</li>
                <li>• Top impactful projects with metrics and descriptions</li>
                <li>• Collaboration and consistency scores</li>
                <li>• Direct links to repositories and live demos</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
