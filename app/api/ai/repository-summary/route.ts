import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { repo } = await request.json()

    const prompt = `Analyze this GitHub repository and provide a concise summary:

REPOSITORY: ${repo.name}
DESCRIPTION: ${repo.description || "No description provided"}
LANGUAGE: ${repo.language || "Unknown"}
STARS: ${repo.stargazers_count}
FORKS: ${repo.forks_count}
SIZE: ${repo.size} KB
CREATED: ${new Date(repo.created_at).toLocaleDateString()}
LAST UPDATED: ${new Date(repo.updated_at).toLocaleDateString()}
TOPICS: ${repo.topics?.join(", ") || "None"}

Based on the repository metadata, provide:
1. A brief 2-3 sentence summary of what this project likely does
2. Its potential impact or usefulness
3. Notable characteristics (high stars, recent activity, etc.)

Keep it concise and professional. Focus on the project's purpose and value.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 300,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Repository summary error:", error)
    return NextResponse.json({ error: "Failed to generate repository summary" }, { status: 500 })
  }
}
