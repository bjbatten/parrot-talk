"use client"

import { useEffect, useRef } from "react"
import { useGameStore } from "@/lib/game-store"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MessageLog() {
  const messages = useGameStore((s) => s.messages)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 w-96 max-h-48 bg-card/95 backdrop-blur border border-border rounded-lg shadow-xl z-30">
      <ScrollArea className="h-full p-4" ref={scrollRef}>
        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm leading-relaxed ${
                msg.type === "dialogue"
                  ? "text-secondary font-medium"
                  : msg.type === "action"
                    ? "text-accent italic"
                    : "text-card-foreground"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
