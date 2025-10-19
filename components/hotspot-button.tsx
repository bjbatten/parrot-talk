"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGameStore } from "@/lib/game-store"
import { pointClick } from "@/lib/api"

type Hotspot = {
  id: string
  kind: "exit" | "item" | "look" | "npc"
  name: string
  x: number
  y: number
  w: number
  h: number
}

export function HotspotButton({ hotspot }: { hotspot: Hotspot }) {
  const worldId = useGameStore((s) => s.worldId)
  const selectedItem = useGameStore((s) => s.selectedItem)
  const setState = useGameStore((s) => s.setState)
  const addMessages = useGameStore((s) => s.addMessages)
  const setSelectedItem = useGameStore((s) => s.setSelectedItem)
  const setError = useGameStore((s) => s.setError)
  const queryClient = useQueryClient()

  const clickMutation = useMutation({
    mutationFn: async () => {
      if (!worldId) throw new Error("No world ID")

      const params: { target: string; op?: string; item_id?: string } = {
        target: hotspot.id,
      }

      if (selectedItem) {
        params.op = "use"
        params.item_id = selectedItem
        setSelectedItem(null)
      } else if (hotspot.kind === "item") {
        params.op = "pickup"
      } else if (hotspot.kind === "exit") {
        params.op = "go"
      } else if (hotspot.kind === "look") {
        params.op = "look"
      }

      return pointClick(worldId, params)
    },
    onSuccess: (data) => {
      if (data.state) setState(data.state)
      if (data.messages) addMessages(data.messages)
      setError(null)
      queryClient.invalidateQueries({ queryKey: ["gameState", worldId] })
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleClick = () => {
    if (hotspot.kind === "npc") {
      // NPC interaction handled by SpeakPanel
      return
    }
    clickMutation.mutate()
  }

  return (
    <button
      onClick={handleClick}
      className="absolute group transition-all hover:scale-105"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.w}%`,
        height: `${hotspot.h}%`,
      }}
      title={hotspot.name}
      disabled={clickMutation.isPending}
    >
      {/* Invisible clickable area with hover effect */}
      <div className="w-full h-full border-2 border-transparent group-hover:border-primary/50 group-hover:bg-primary/10 rounded transition-colors" />

      {/* Label on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-card border border-border rounded text-sm text-card-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {selectedItem ? `Use ${selectedItem} with ${hotspot.name}` : hotspot.name}
      </div>
    </button>
  )
}
