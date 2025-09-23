import { type NextRequest, NextResponse } from "next/server"
import { GitHubAPI, calculateLanguageStats, getActivityStats } from "@/lib/github"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  const token = searchParams.get("token")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const github = new GitHubAPI(token || undefined)
    const repos = await github.getUserRepos(username)

    // Get language data for each repo (limit to top 10 to avoid rate limits)
    const topRepos = repos.slice(0, 10)
    const languageData: Record<string, any> = {}

    for (const repo of topRepos) {
      try {
        const languages = await github.getRepoLanguages(username, repo.name)
        languageData[repo.full_name] = languages
      } catch (error) {
        console.warn(`Failed to get languages for ${repo.name}:`, error)
        languageData[repo.full_name] = {}
      }
    }

    const languageStats = calculateLanguageStats(repos, languageData)
    const activityStats = getActivityStats(repos)

    return NextResponse.json({
      repos,
      languageStats,
      activityStats,
    })
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json({ error: "Failed to fetch repository data" }, { status: 500 })
  }
}
