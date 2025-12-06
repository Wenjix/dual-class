"use client"

import { useState } from "react"

interface MappingPair {
  concept_term: string
  metaphor_term: string
  note?: string
}

interface RosettaStoneProps {
  mappingPairs: MappingPair[]
}

export default function RosettaStone({ mappingPairs }: RosettaStoneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-1 w-8 bg-gradient-to-r from-topic via-user to-topic rounded-full"></div>
        <h3 className="text-white font-bold text-lg tracking-wide">Rosetta Stone</h3>
        <div className="h-1 w-8 bg-gradient-to-r from-topic via-user to-topic rounded-full"></div>
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/10">
          <div className="text-topic/80 text-sm font-bold tracking-widest uppercase text-right">
            Technical Concept
          </div>
          <div className="text-user/80 text-sm font-bold tracking-widest uppercase">
            Your World
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
            {/* Concept Term (Right-aligned, Cyan) */}
            <div className="text-topic text-right font-medium pr-4 border-r border-white/10">
              {pair.concept_term}
            </div>

            {/* Metaphor Term (Left-aligned, Pink) */}
            <div className="text-user font-medium pl-4">
              {pair.metaphor_term}
            </div>

            {/* Tooltip with note (if exists) */}
            {pair.note && hoveredIndex === index && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30
                              glass-panel px-4 py-2 rounded-lg max-w-xs
                              border border-white/20 shadow-lg animate-slide-in">
                <p className="text-white/80 text-sm leading-relaxed">{pair.note}</p>
                {/* Arrow pointing up */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4
                                bg-obsidian/90 backdrop-blur-xl rotate-45 border-l border-t border-white/20"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-white/50 text-xs text-center mt-4 italic">
        Hover over rows for additional details
      </p>
    </div>
  )
}
