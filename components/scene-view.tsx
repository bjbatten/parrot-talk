"use client"

import { useGameStore } from "@/lib/game-store"
import { HotspotButton } from "./hotspot-button"
import Player from "./player"

export function SceneView() {
  const state = useGameStore((s) => s.state)

  console.log("[v0] SceneView state:", state)

  if (!state) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading scene...</p>
      </div>
    )
  }

  const currentRoom = state.rooms[state.player.room_id]
  console.log("[v0] Current room:", currentRoom)

  if (!currentRoom?.scene) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No scene data available</p>
      </div>
    )
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_API_URL
      : `https://${process.env.NEXT_PUBLIC_API_URL}`
    : ""

  const imageUrl = currentRoom.scene.bg ? `${apiUrl}/assets/${currentRoom.scene.bg}` : "/adventure-game-room.jpg"

  console.log("[v0] Image URL:", imageUrl)

  const parallaxLayers =
    currentRoom.scene.parallax?.map((layer) => ({
      image_url: `${apiUrl}/assets/${layer.url}`,
      speed: layer.speed,
    })) || []

  const hotspots = currentRoom.scene.hotspots
    ? Object.entries(currentRoom.scene.hotspots).map(([id, hotspot]) => ({
        id,
        kind: hotspot.type as "exit" | "item" | "look" | "npc",
        name: id,
        x: hotspot.rect[0],
        y: hotspot.rect[1],
        w: hotspot.rect[2] - hotspot.rect[0],
        h: hotspot.rect[3] - hotspot.rect[1],
      }))
    : []

  if (currentRoom.scene.exits) {
    Object.entries(currentRoom.scene.exits).forEach(([exitId, exit]) => {
      hotspots.push({
        id: exitId,
        kind: "exit",
        name: exitId,
        x: exit.rect[0],
        y: exit.rect[1],
        w: exit.rect[2] - exit.rect[0],
        h: exit.rect[3] - exit.rect[1],
      })
    })
  }

  console.log("[v0] Hotspots:", hotspots)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Parallax layers */}
      {parallaxLayers.map((layer, idx) => (
        <div
          key={idx}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${layer.image_url})`,
            transform: `translateZ(${layer.speed * -100}px) scale(${1 + layer.speed})`,
          }}
        />
      ))}

      {/* Main room image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        onError={(e) => {
          console.error("[v0] Image failed to load:", imageUrl)
        }}
      />

      {/* Hotspots overlay */}
      <div className="absolute inset-0">
        {hotspots.map((hotspot) => (
          <HotspotButton key={hotspot.id} hotspot={hotspot} />
        ))}
      </div>

      {/* Player character */}
      <Player />
    </div>
  )
}
