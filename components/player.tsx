"use client"

import React from "react"

export default function Player() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = React.useState({ x: 100, y: 300 })
  const vel = React.useRef({ x: 0, y: 0 })
  const speed = 220 // pixels per second

  React.useEffect(() => {
    let pressed: Record<string, boolean> = {}

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        pressed[k] = e.type === "keydown" ? true : false
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("keyup", onKey)

    let last = performance.now()
    let raf = 0

    const frame = (now: number) => {
      const dt = (now - last) / 1000
      last = now

      let dx = 0
      let dy = 0
      if (pressed["w"] || pressed["arrowup"]) dy -= 1
      if (pressed["s"] || pressed["arrowdown"]) dy += 1
      if (pressed["a"] || pressed["arrowleft"]) dx -= 1
      if (pressed["d"] || pressed["arrowright"]) dx += 1

      // normalize
      if (dx !== 0 && dy !== 0) {
        const inv = 1 / Math.sqrt(2)
        dx *= inv
        dy *= inv
      }

      const nextX = Math.max(0, pos.x + dx * speed * dt)
      const nextY = Math.max(0, pos.y + dy * speed * dt)

      setPos({ x: nextX, y: nextY })

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("keyup", onKey)
    }
  }, [pos.x, pos.y])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: 48,
        height: 48,
        pointerEvents: "none",
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="w-12 h-12 rounded-full bg-red-500 border-2 border-white/30 shadow-lg" />
    </div>
  )
}
