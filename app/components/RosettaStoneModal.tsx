"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MappingPair {
  concept_term: string
  metaphor_term: string
  note?: string
}

interface RosettaStoneModalProps {
  mappingPairs: MappingPair[]
  persona: string
  concept: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
}

export default function RosettaStoneModal({ 
  mappingPairs, 
  persona, 
  concept,
  isOpen: controlledOpen,
  onOpenChange,
  showTrigger = true
}: RosettaStoneModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Use controlled or uncontrolled state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalOpen(open)
    }
  }

  // Ensure we only render portal on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mappingPairs || mappingPairs.length === 0) return null

  const modalContent = isOpen && mounted ? (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative glass-panel border border-white/20 rounded-2xl p-6 
                   max-w-lg w-full max-h-[80vh] overflow-y-auto
                   shadow-2xl animate-slide-in bg-obsidian/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20
                     transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <BookOpen className="w-6 h-6 text-topic" />
          <div>
            <h3 className="text-white font-bold text-lg">Translation Guide</h3>
            <p className="text-white/50 text-xs">{persona} ↔ {concept}</p>
          </div>
        </div>

        {/* Mapping Table */}
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/10">
            <div className="text-user/80 text-xs font-bold tracking-widest uppercase text-right pr-3">
              {persona} Term
            </div>
            <div className="text-topic/80 text-xs font-bold tracking-widest uppercase pl-3">
              Technical Term
            </div>
          </div>

          {/* Mapping Rows */}
          {mappingPairs.map((pair, index) => (
            <div
              key={index}
              className="relative grid grid-cols-2 gap-4 py-3 hover:bg-white/5 rounded-lg
                         transition-colors duration-200 cursor-default"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Metaphor Term (Right-aligned, Pink) */}
              <div className="text-user text-right text-sm font-medium pr-3 border-r border-white/10">
                {pair.metaphor_term}
              </div>

              {/* Concept Term (Left-aligned, Cyan) */}
              <div className="text-topic text-sm font-medium pl-3">
                {pair.concept_term}
              </div>

              {/* Tooltip with note (if exists) */}
              {pair.note && hoveredIndex === index && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10
                                glass-panel px-3 py-2 rounded-lg max-w-xs
                                border border-white/20 shadow-lg animate-slide-in">
                  <p className="text-white/80 text-xs leading-relaxed">{pair.note}</p>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3
                                  bg-white/10 backdrop-blur-xl rotate-45 border-l border-t border-white/20"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs text-center mt-4 italic">
          Hover over rows for additional details
        </p>
      </div>
    </div>
  ) : null

  return (
    <>
      {/* Trigger Button - only show if showTrigger is true */}
      {showTrigger && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          className="glass-panel border-white/20 hover:border-topic/50 hover:bg-topic/10 
                     text-white/80 hover:text-white transition-all duration-200
                     flex items-center gap-2 px-3 py-2"
        >
          <BookOpen className="w-4 h-4 text-topic" />
          <span className="text-xs font-medium">Translation Guide</span>
        </Button>
      )}

      {/* Portal Modal - renders at document.body level */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}
