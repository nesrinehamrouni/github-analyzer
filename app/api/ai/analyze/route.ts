import { type NextRequest, NextResponse } from "next/server"

interface LanguageStats {
  language: string
  bytes: number
  percentage: number
}

interface ActivityStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  recentlyUpdated: number
  activeRepos: number
}

export async function POST(request: NextRequest) {
  try {
    const { user, repos, languageStats, activityStats }: {
      user: {
        name?: string
        login: string
        bio?: string
        location?: string
        company?: string
        public_repos: number
        followers: number
        following: number
        created_at: string
      }
      repos: Array<{
        name: string
        stargazers_count: number
        forks_count: number
        language?: string
        description?: string
      }>
      languageStats: LanguageStats[]
      activityStats: ActivityStats
    } = await request.json()

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

    // Use direct HTTP request to Google Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.GOOGLE_API_KEY!,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("AI analysis error:", error)
    
    // Check if it's a quota/billing error
    if (error instanceof Error && error.message.includes("quota")) {
      return NextResponse.json({ 
        error: "OpenAI API quota exceeded. Please check your billing details or try again later.",
        fallback: true 
      }, { status: 429 })
    }
    
    return NextResponse.json({ error: "Failed to generate AI analysis" }, { status: 500 })
  }
}
