"use client"

import { create } from "zustand"
import type { GameState, GameMessage } from "./types"

type GameStore = {
  worldId: string | null
  state: GameState | null
  messages: GameMessage[]
  selectedItem: string | null
  isLoading: boolean
  error: string | null
  setWorldId: (id: string) => void
  setState: (state: GameState) => void
  addMessages: (messages: GameMessage[]) => void
  setSelectedItem: (item: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearMessages: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  worldId: null,
  state: null,
  messages: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  setWorldId: (id) => set({ worldId: id }),
  setState: (state) => set({ state }),
  addMessages: (messages) => set((prev) => ({ messages: [...prev.messages, ...messages] })),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [] }),
}))
