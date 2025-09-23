import { type NextRequest, NextResponse } from "next/server"
import { GitHubAPI } from "@/lib/github"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  const token = searchParams.get("token")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const github = new GitHubAPI(token || undefined)
    const user = await github.getUser(username)

    return NextResponse.json(user)
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
