import { type NextRequest, NextResponse } from "next/server"

interface RepoData {
  name: string
  description?: string
  language?: string
  stargazers_count: number
  forks_count: number
  size: number
  created_at: string
  updated_at: string
  topics?: string[]
}

export async function POST(request: NextRequest) {
  let repo: RepoData | null = null
  
  try {
    const requestData = await request.json()
    repo = requestData.repo

    // Validate repo data
    if (!repo || !repo.name) {
      return NextResponse.json({ error: "Repository data is required" }, { status: 400 })
    }

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
    
    // Validate API response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error("Invalid API response structure")
    }
    
    const text = data.candidates[0].content.parts[0].text

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Repository summary error:", error)
    
    // Check if it's a quota/billing error
    if (error instanceof Error && (error.message.includes("quota") || error.message.includes("billing")) && repo) {
      return NextResponse.json({ 
        error: "Google API quota exceeded. Please check your billing details or try again later.",
        fallback: true,
        summary: generateFallbackSummary(repo)
      }, { status: 429 })
    }
    
    return NextResponse.json({ error: "Failed to generate repository summary" }, { status: 500 })
  }
}

function generateFallbackSummary(repo: RepoData) {
  const stars = repo.stargazers_count
  const forks = repo.forks_count
  const language = repo.language || "Unknown"
  const updatedDate = new Date(repo.updated_at)
  const isRecent = (Date.now() - updatedDate.getTime()) < (30 * 24 * 60 * 60 * 1000) // 30 days
  
  let summary = `This ${language} repository`
  
  if (repo.description) {
    summary += ` (${repo.description})`
  }
  
  summary += ` has ${stars} stars and ${forks} forks. `
  
  if (stars > 100) {
    summary += "It appears to be a popular project with significant community interest. "
  } else if (stars > 10) {
    summary += "It shows moderate community engagement. "
  } else {
    summary += "It's a newer or specialized project. "
  }
  
  if (isRecent) {
    summary += "The repository has been recently updated, indicating active development."
  } else {
    summary += "The repository may be in maintenance mode or completed."
  }
  
  return summary
}
