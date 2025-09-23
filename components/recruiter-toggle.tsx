"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, User } from "lucide-react"

interface RecruiterToggleProps {
  isRecruiterView: boolean
  onToggle: (isRecruiterView: boolean) => void
}

export function RecruiterToggle({ isRecruiterView, onToggle }: RecruiterToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={!isRecruiterView ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(false)}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Developer View
      </Button>
      <Button
        variant={isRecruiterView ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(true)}
        className="flex items-center gap-2"
      >
        <Briefcase className="h-4 w-4" />
        Recruiter View
        <Badge variant="secondary" className="ml-1">
          New
        </Badge>
      </Button>
    </div>
  )
}
