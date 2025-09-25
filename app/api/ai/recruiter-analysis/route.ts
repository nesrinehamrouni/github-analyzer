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
      user: any
      repos: any[]
      languageStats: LanguageStats[]
      activityStats: ActivityStats
    } = await request.json()

    const prompt = `As a technical recruiter AI, analyze this GitHub profile and provide recruiter-focused insights:

Developer: ${user.name || user.login}
Bio: ${user.bio || "No bio provided"}
Location: ${user.location || "Not specified"}
Company: ${user.company || "Not specified"}

Repository Stats:
- Total repositories: ${activityStats.totalRepos}
- Total stars: ${activityStats.totalStars}
- Total forks: ${activityStats.totalForks}
- Recently updated: ${activityStats.recentlyUpdated}

Top Languages: ${languageStats
      .slice(0, 5)
      .map((l) => `${l.language} (${l.percentage.toFixed(1)}%)`)
      .join(", ")}

Top Repositories:
${repos
  .slice(0, 5)
  .map(
    (repo) =>
      `- ${repo.name}: ${repo.description || "No description"} (${repo.stargazers_count} stars, ${repo.language || "Unknown language"})`,
  )
  .join("\n")}

Provide a recruiter-focused analysis with:
1. **Hiring Recommendation** (Strong Hire/Hire/Maybe/Pass) with reasoning
2. **Experience Level Assessment** (Junior/Mid/Senior) with justification
3. **Key Technical Strengths** for this candidate
4. **Best Role Fit** based on their portfolio
5. **Red Flags or Concerns** if any
6. **Salary Range Estimate** based on skills and experience
7. **Interview Focus Areas** - what to assess in interviews

Keep it professional, concise, and actionable for hiring managers.`

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
    console.error("Error generating recruiter analysis:", error)
    
    // Check if it's a quota/billing error
    if (error instanceof Error && error.message.includes("quota")) {
      return NextResponse.json({ 
        error: "OpenAI API quota exceeded. Please check your billing details or try again later.",
        fallback: true 
      }, { status: 429 })
    }
    
    return NextResponse.json({ error: "Failed to generate recruiter analysis" }, { status: 500 })
  }
}
