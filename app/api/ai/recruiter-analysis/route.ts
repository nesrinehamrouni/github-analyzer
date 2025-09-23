import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { user, repos, languageStats, activityStats } = await request.json()

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

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 1000,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error generating recruiter analysis:", error)
    return NextResponse.json({ error: "Failed to generate recruiter analysis" }, { status: 500 })
  }
}
