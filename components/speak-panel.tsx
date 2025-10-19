"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGameStore } from "@/lib/game-store"
import { speak } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

type SpeakPanelProps = {
  npcId: string
  npcName: string
  onClose: () => void
}

export function SpeakPanel({ npcId, npcName, onClose }: SpeakPanelProps) {
  const [text, setText] = useState("")
  const worldId = useGameStore((s) => s.worldId)
  const setState = useGameStore((s) => s.setState)
  const addMessages = useGameStore((s) => s.addMessages)
  const setError = useGameStore((s) => s.setError)
  const queryClient = useQueryClient()

  const speakMutation = useMutation({
    mutationFn: async (playerText: string) => {
      if (!worldId) throw new Error("No world ID")
      return speak(worldId, npcId, playerText)
    },
    onSuccess: (data) => {
      if (data.state) setState(data.state)
      if (data.npc_text) {
        addMessages([{ text: `${npcName}: ${data.npc_text}`, type: "dialogue" }])
      }
      if (data.messages) addMessages(data.messages)
      setError(null)
      setText("")
      queryClient.invalidateQueries({ queryKey: ["gameState", worldId] })
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      speakMutation.mutate(text.trim())
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-card border-t border-border shadow-2xl z-40 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Speaking with {npcName}</h3>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you want to say?"
            className="flex-1"
            disabled={speakMutation.isPending}
          />
          <Button type="submit" disabled={speakMutation.isPending || !text.trim()}>
            {speakMutation.isPending ? "Sending..." : "Speak"}
          </Button>
        </form>
      </div>
    </div>
  )
}
