export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string
  company: string | null
  blog: string
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  language: string | null
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  visibility: string
  owner: {
    login: string
  }
}

export interface LanguageStats {
  [language: string]: number
}

export class GitHubAPI {
  private baseUrl = "https://api.github.com"
  private token?: string

  constructor(token?: string) {
    this.token = token
  }

  private async fetch(endpoint: string) {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHub-Portfolio-Analyzer",
    }

    if (this.token) {
      headers["Authorization"] = `token ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.fetch(`/users/${username}`)
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    const repos = await this.fetch(`/users/${username}/repos?sort=updated&per_page=100`)
    return repos.filter((repo: GitHubRepo) => !repo.name.startsWith("."))
  }

  async getRepoLanguages(owner: string, repo: string): Promise<LanguageStats> {
    return this.fetch(`/repos/${owner}/${repo}/languages`)
  }

  async getRepoContributors(owner: string, repo: string) {
    return this.fetch(`/repos/${owner}/${repo}/contributors`)
  }

  async getRepoCommits(owner: string, repo: string, since?: string) {
    const sinceParam = since ? `?since=${since}` : ""
    return this.fetch(`/repos/${owner}/${repo}/commits${sinceParam}`)
  }

  async getUserContributions(username: string) {
    // Get user's repositories
    const repos = await this.getUserRepos(username)
    
    // Get commit data for the last year for each repository
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const since = oneYearAgo.toISOString()
    
    const contributionData: Record<string, number> = {}
    
    // Process repositories in batches to avoid rate limits
    const batchSize = 5
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize)
      
      await Promise.all(
        batch.map(async (repo) => {
          try {
            const commits = await this.getRepoCommits(repo.owner?.login || username, repo.name, since)
            
            // Count commits by date
            commits.forEach((commit: any) => {
              const commitDate = new Date(commit.commit.author.date).toISOString().split('T')[0]
              contributionData[commitDate] = (contributionData[commitDate] || 0) + 1
            })
          } catch (error) {
            console.warn(`Failed to get commits for ${repo.name}:`, error)
          }
        })
      )
    }
    
    return contributionData
  }
}

export function calculateLanguageStats(repos: GitHubRepo[], languageData: Record<string, LanguageStats>) {
  const totalStats: LanguageStats = {}

  repos.forEach((repo) => {
    const repoLanguages = languageData[repo.full_name] || {}
    Object.entries(repoLanguages).forEach(([language, bytes]) => {
      totalStats[language] = (totalStats[language] || 0) + bytes
    })
  })

  const total = Object.values(totalStats).reduce((sum, bytes) => sum + bytes, 0)

  return Object.entries(totalStats)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: total > 0 ? (bytes / total) * 100 : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
}

export function getActivityStats(repos: GitHubRepo[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

  const recentlyUpdated = repos.filter((repo) => new Date(repo.updated_at) > thirtyDaysAgo).length

  const activeRepos = repos.filter((repo) => new Date(repo.updated_at) > sixMonthsAgo).length

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)

  return {
    totalRepos: repos.length,
    recentlyUpdated,
    activeRepos,
    totalStars,
    totalForks,
    averageStars: repos.length > 0 ? Math.round((totalStars / repos.length) * 10) / 10 : 0,
  }
}
