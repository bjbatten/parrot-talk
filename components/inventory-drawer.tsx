"use client"

import { useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import { Package, X } from "lucide-react"

export function InventoryDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const state = useGameStore((s) => s.state)
  const selectedItem = useGameStore((s) => s.selectedItem)
  const setSelectedItem = useGameStore((s) => s.setSelectedItem)

  const inventory = state?.player.inventory || []

  const handleItemClick = (item: string) => {
    if (selectedItem === item) {
      setSelectedItem(null)
    } else {
      setSelectedItem(item)
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Package className="w-6 h-6" />}
      </Button>

      {/* Selected item indicator */}
      {selectedItem && (
        <div className="fixed bottom-20 right-4 z-40 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium">Using: {selectedItem}</p>
          <button onClick={() => setSelectedItem(null)} className="text-xs underline hover:no-underline">
            Cancel
          </button>
        </div>
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 right-0 w-80 bg-card border-l border-t border-border rounded-tl-lg shadow-2xl transition-transform duration-300 z-30 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "60vh" }}
      >
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">Inventory</h2>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(60vh - 60px)" }}>
          {inventory.length === 0 ? (
            <p className="text-muted-foreground text-sm">No items yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {inventory.map((item) => (
                <button
                  key={item}
                  onClick={() => handleItemClick(item)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedItem === item
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-square bg-background rounded mb-2 flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-card-foreground text-center">{item}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
