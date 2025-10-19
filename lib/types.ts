export type GameState = {
  player: {
    room_id: string
    inventory: string[]
    flags?: Record<string, any>
    pos?: number[]
  }
  rooms: Record<string, ApiRoom>
  npcs?: Record<string, any>
  flags?: Record<string, any>
  log?: string[]
}

export type GameMessage = {
  text: string
  type?: "info" | "action" | "dialogue"
}

export type ApiResponse = {
  state?: GameState
  messages?: GameMessage[]
  npc_text?: string
}

export type CreateWorldResponse = {
  world_id: string
  state: GameState
  messages?: GameMessage[]
}

export type ApiRoomScene = {
  bg: string
  walkmesh?: number[][]
  hotspots?: Record<string, { rect: number[]; type: string }>
  exits?: Record<string, { rect: number[]; to: string }>
  parallax?: { url: string; speed: number }[]
}

export type ApiRoom = {
  desc: string
  scene: ApiRoomScene
  items?: string[]
  exits?: Record<string, string>
}

export type ApiGameState = {
  player: {
    room_id: string
    inventory: string[]
    flags?: Record<string, any>
    pos?: number[]
  }
  rooms: Record<string, ApiRoom>
  npcs?: Record<string, any>
  flags?: Record<string, any>
  log?: string[]
}
