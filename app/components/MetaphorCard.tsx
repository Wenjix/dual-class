"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import RosettaStoneModal from "./RosettaStoneModal"

interface MappingPair {
  concept_term: string
  metaphor_term: string
  note?: string
}

interface VisualCallout {
  id: number
  position: string
  label: string
}

interface MetaphorCardProps {
  persona: string
  concept: string
  imageUrl: string
  isSwitching: boolean
  mappingPairs: MappingPair[]
  visualCallouts: VisualCallout[]
}

export default function MetaphorCard({
  persona,
  concept,
  imageUrl,
  isSwitching,
  mappingPairs,
  visualCallouts,
}: MetaphorCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div 
        className={`relative w-full rounded-3xl overflow-hidden border border-white/10
                    shadow-2xl group transition-all duration-300 max-w-6xl mx-auto aspect-video
                    cursor-pointer
                    ${isSwitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Background Image Layer - Full Bleed */}
        <img
          src={imageUrl}
          alt={`${persona} explanation of ${concept}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform
                     duration-700 group-hover:scale-105"
        />

        {/* Hover Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 z-25 bg-obsidian/30 backdrop-blur-sm">
          <div className="glass-panel px-6 py-3 flex items-center gap-3 border border-white/20">
            <BookOpen className="w-5 h-5 text-topic" />
            <span className="text-white font-medium">Click to view Translation Guide</span>
          </div>
        </div>
      </div>

      {/* Translation Guide Modal - controlled externally */}
      {mappingPairs && mappingPairs.length > 0 && (
        <RosettaStoneModal
          mappingPairs={mappingPairs}
          persona={persona}
          concept={concept}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          showTrigger={false}
        />
      )}
    </>
  )
}
