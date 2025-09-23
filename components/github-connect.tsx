"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GitBranch, Github } from "lucide-react"

interface GitHubConnectProps {
  onConnect: (username: string, token?: string) => void
  loading?: boolean
}

export function GitHubConnect({ onConnect, loading }: GitHubConnectProps) {
  const [username, setUsername] = useState("")
  const [token, setToken] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onConnect(username.trim(), token.trim() || undefined)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Github className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">GitHub Portfolio Analyzer</CardTitle>
          <CardDescription>
            Connect your GitHub account to analyze your repositories and get AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">GitHub Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Personal Access Token (Optional)</Label>
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Provide a token for higher rate limits and private repos
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading || !username.trim()}>
              {loading ? (
                <>
                  <GitBranch className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Analyze Portfolio
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
