"use client"

import { useGameStore } from "@/lib/game-store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorBanner() {
  const error = useGameStore((s) => s.error)
  const setError = useGameStore((s) => s.setError)

  if (!error) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
