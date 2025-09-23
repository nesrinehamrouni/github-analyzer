import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { user, repos, languageStats, activityStats } = await request.json()

    const prompt = `Analyze this GitHub portfolio and provide insights:

USER PROFILE:
- Name: ${user.name || user.login}
- Bio: ${user.bio || "No bio provided"}
- Public Repos: ${user.public_repos}
- Followers: ${user.followers}
- Following: ${user.following}
- Account created: ${new Date(user.created_at).getFullYear()}

REPOSITORY STATISTICS:
- Total repositories: ${activityStats.totalRepos}
- Total stars: ${activityStats.totalStars}
- Total forks: ${activityStats.totalForks}
- Recently updated (30 days): ${activityStats.recentlyUpdated}
- Active repositories (6 months): ${activityStats.activeRepos}

TOP LANGUAGES:
${languageStats
  .slice(0, 5)
  .map((lang) => `- ${lang.language}: ${lang.percentage.toFixed(1)}%`)
  .join("\n")}

TOP REPOSITORIES (by stars):
${repos
  .slice(0, 5)
  .map(
    (repo) =>
      `- ${repo.name}: ${repo.stargazers_count} stars, ${repo.forks_count} forks (${repo.language || "Unknown"})`,
  )
  .join("\n")}

Please provide a comprehensive analysis including:
1. Developer Profile Summary (2-3 sentences about their coding style and focus)
2. Technical Strengths (based on languages and repository patterns)
3. Portfolio Highlights (most impressive projects and achievements)
4. Growth Opportunities (areas for improvement or expansion)
5. Community Impact (based on stars, forks, and activity)

Keep the analysis professional, constructive, and insightful. Focus on actionable insights.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 1000,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("AI analysis error:", error)
    return NextResponse.json({ error: "Failed to generate AI analysis" }, { status: 500 })
  }
}
