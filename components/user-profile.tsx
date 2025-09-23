"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, LinkIcon, Building, Calendar, Users, GitFork } from "lucide-react"
import type { GitHubUser } from "@/lib/github"

interface UserProfileProps {
  user: GitHubUser
}

export function UserProfile({ user }: UserProfileProps) {
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || user.login} />
              <AvatarFallback className="text-lg">{(user.name || user.login).charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-balance">{user.name || user.login}</h2>
              {user.name && <p className="text-muted-foreground">@{user.login}</p>}
              {user.bio && <p className="text-sm text-muted-foreground mt-2 text-pretty">{user.bio}</p>}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {user.company}
                </div>
              )}
              {user.blog && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {user.blog.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {joinDate}
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                <span className="font-medium">{user.followers}</span>
                <span className="text-muted-foreground">followers</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <GitFork className="h-4 w-4" />
                <span className="font-medium">{user.following}</span>
                <span className="text-muted-foreground">following</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
