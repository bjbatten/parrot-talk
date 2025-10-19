import type { ApiResponse, CreateWorldResponse } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.startsWith("http")
    ? process.env.NEXT_PUBLIC_API_URL
    : `https://${process.env.NEXT_PUBLIC_API_URL}`
  : ""

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`
  console.log("[v0] API Request:", { url, method: options?.method || "GET", body: options?.body })

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    console.log("[v0] API Response Status:", response.status, response.statusText)

    const rawText = await response.text()
    console.log("[v0] API Response Body (raw):", rawText)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${rawText}`)
    }

    try {
      const data = JSON.parse(rawText)
      console.log("[v0] API Response Body (parsed):", data)
      return data
    } catch (parseError) {
      console.error("[v0] JSON Parse Error:", parseError)
      throw new Error(
        `Failed to parse API response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      )
    }
  } catch (error) {
    console.error("[v0] API Fetch Error:", error)
    throw error
  }
}

export async function createWorld(seed: string): Promise<CreateWorldResponse> {
  return fetchApi<CreateWorldResponse>("/worlds", {
    method: "POST",
    body: JSON.stringify({ seed }),
  })
}

export async function getState(worldId: string): Promise<ApiResponse> {
  return fetchApi<ApiResponse>(`/worlds/${worldId}/state`)
}

export async function pointClick(
  worldId: string,
  params: {
    target: string
    op?: string
    item_id?: string
  },
): Promise<ApiResponse> {
  return fetchApi<ApiResponse>(`/worlds/${worldId}/point_click`, {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export async function speak(worldId: string, npcId: string, playerText: string): Promise<ApiResponse> {
  return fetchApi<ApiResponse>(`/worlds/${worldId}/npc/${npcId}/speak`, {
    method: "POST",
    body: JSON.stringify({ player_text: playerText }),
  })
}
