"use client"

import { useEffect } from "react"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { useGameStore } from "@/lib/game-store"
import { createWorld, getState } from "@/lib/api"
import { SceneView } from "@/components/scene-view"
import { InventoryDrawer } from "@/components/inventory-drawer"
import { MessageLog } from "@/components/message-log"
import { ErrorBanner } from "@/components/error-banner"

const queryClient = new QueryClient()

import { useState } from "react"

function GameContent() {
  const worldId = useGameStore((s) => s.worldId)
  const setWorldId = useGameStore((s) => s.setWorldId)
  const setState = useGameStore((s) => s.setState)
  const addMessages = useGameStore((s) => s.addMessages)
  const setLoading = useGameStore((s) => s.setLoading)
  const setError = useGameStore((s) => s.setError)

  // Bootstrap world on mount
  const [showWelcome, setShowWelcome] = useState(true)
  useEffect(() => {
    const initWorld = async () => {
      setLoading(true)
      try {
        // Check localStorage for existing world
        const storedWorldId = localStorage.getItem("worldId")

        if (storedWorldId) {
          setWorldId(storedWorldId)
        } else {
          // Create new world
          const response = await createWorld("banana")
          setWorldId(response.world_id)
          setState(response.state)
          addMessages(response.messages ?? [])
          localStorage.setItem("worldId", response.world_id)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to initialize world")
      } finally {
        setLoading(false)
        setTimeout(() => setShowWelcome(false), 1200)
      }
    }

    initWorld()
  }, [setWorldId, setState, addMessages, setLoading, setError])

  // Fetch state when worldId is set
  const { data } = useQuery({
    queryKey: ["gameState", worldId],
    queryFn: () => getState(worldId!),
    enabled: !!worldId,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (data?.state) {
      setState(data.state)
    }
    if (data) {
      addMessages(data.messages ?? [])
    }
  }, [data, setState, addMessages])

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-900 text-white">
      {showWelcome && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold mb-4">Welcome to Parrot Talk!</h1>
          <p className="mb-8">Your adventure awaits. Loading game world...</p>
        </div>
      )}
      {!showWelcome && (
        <>
          <ErrorBanner />
          <SceneView />
          <MessageLog />
          <InventoryDrawer />
        </>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContent />
    </QueryClientProvider>
  )
}
