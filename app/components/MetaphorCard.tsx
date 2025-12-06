"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { X, Info, Eye, EyeOff } from "lucide-react"
import LessonTrack from "./LessonTrack"
import RosettaStone from "./RosettaStone"
import CalloutBadge from "./CalloutBadge"

interface LessonStep {
  step_number: number
  title: string
  metaphor_text: string
  literal_text: string
  image_callout: number
}

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
  explanation_text: string
  imageUrl: string
  isSwitching: boolean
  lessonSteps: LessonStep[]
  mappingPairs: MappingPair[]
  visualCallouts: VisualCallout[]
  showCallouts: boolean
  onToggleCallouts: () => void
}

// Helper function to map persona to emoji
const getPersonaEmoji = (persona: string): string => {
  const normalized = persona.toLowerCase()
  if (normalized.includes('chef') || normalized.includes('cook') || normalized.includes('baker')) return '👨‍🍳'
  if (normalized.includes('captain') || normalized.includes('pilot') || normalized.includes('astronaut')) return '🧑‍✈️'
  if (normalized.includes('detective') || normalized.includes('investigator')) return '🕵️'
  if (normalized.includes('gamer') || normalized.includes('game')) return '🎮'
  if (normalized.includes('musician') || normalized.includes('music') || normalized.includes('guitar')) return '🎸'
  if (normalized.includes('surfer') || normalized.includes('surf')) return '🏄'
  if (normalized.includes('firefighter') || normalized.includes('fire')) return '🚒'
  if (normalized.includes('teacher') || normalized.includes('professor')) return '👨‍🏫'
  return '👤' // default
}

// Helper to get concept emoji
const getConceptEmoji = (concept: string): string => {
  const normalized = concept.toLowerCase()
  if (normalized.includes('ai') || normalized.includes('neural') || normalized.includes('attention')) return '🧠'
  if (normalized.includes('docker') || normalized.includes('k8s') || normalized.includes('kubernetes') || normalized.includes('container')) return '🐳'
  if (normalized.includes('blockchain') || normalized.includes('crypto')) return '🔗'
  if (normalized.includes('security') || normalized.includes('encryption')) return '🛡️'
  if (normalized.includes('database') || normalized.includes('sql')) return '💾'
  if (normalized.includes('network') || normalized.includes('api')) return '🌐'
  return '💻' // default
}

export default function MetaphorCard({
  persona,
  concept,
  explanation_text,
  imageUrl,
  isSwitching,
  lessonSteps,
  mappingPairs,
  visualCallouts,
  showCallouts,
  onToggleCallouts,
}: MetaphorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Split explanation into two parts for dual-side display (fallback for old format)
  const paragraphs = explanation_text?.split('\n\n').filter(p => p.trim()) || []
  const leftText = paragraphs[0] || ""
  const rightText = paragraphs[1] || paragraphs[2] || ""

  return (
    <div className={`relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10
                     shadow-2xl group transition-all duration-300 max-w-6xl mx-auto cursor-pointer ${
                       isSwitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                     }`}
         onClick={() => setIsExpanded(!isExpanded)}>

      {/* Background Image Layer - Full Bleed */}
      <img
        src={imageUrl}
        alt={`${persona} explanation of ${concept}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform
                   duration-700 group-hover:scale-105"
      />

      {/* Bifrost Center Divider */}
      <div className="bifrost-divider z-20" />

      {/* Minimal Top Badges - Always Visible */}
      <div className="absolute top-4 inset-x-4 flex justify-between items-start z-30 pointer-events-none">
        <Badge className="bg-user/20 backdrop-blur-md border-user/40 text-user text-xs md:text-sm px-3 py-1">
          <span className="emoji-icon mr-1">{getPersonaEmoji(persona)}</span>
          {persona}
        </Badge>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleCallouts()
            }}
            className="pointer-events-auto glass-panel p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={showCallouts ? "Hide callouts" : "Show callouts"}
          >
            {showCallouts ? <Eye className="w-4 h-4 text-topic" /> : <EyeOff className="w-4 h-4 text-white/40" />}
          </button>
          <Badge className="bg-topic/20 backdrop-blur-md border-topic/40 text-topic text-xs md:text-sm px-3 py-1">
            {concept}
            <span className="emoji-icon ml-1">{getConceptEmoji(concept)}</span>
          </Badge>
        </div>
      </div>

      {/* Callout Badges */}
      {visualCallouts && visualCallouts.map((callout) => (
        <CalloutBadge
          key={callout.id}
          number={callout.id}
          position={callout.position}
          label={callout.label}
          visible={showCallouts}
        />
      ))}

      {/* Hover Indicator - Shows when NOT expanded */}
      {!isExpanded && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 z-25 bg-obsidian/20 backdrop-blur-sm">
          <div className="glass-panel px-6 py-3 flex items-center gap-3">
            <Info className="w-5 h-5 text-topic" />
            <span className="text-white font-medium">Click to view explanation</span>
          </div>
        </div>
      )}

      {/* Expanded Text Panel - Glass Overlay */}
      {isExpanded && (
        <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl flex flex-col z-30
                        animate-slide-in"
             style={{ WebkitBackdropFilter: 'blur(24px)' }}>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20
                       transition-colors duration-200 group/close"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(false)
            }}>
            <X className="w-5 h-5 text-white group-hover/close:rotate-90 transition-transform duration-300" />
          </button>

          {/* Header */}
          <div className="flex-none px-8 pt-8 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl emoji-icon">{getPersonaEmoji(persona)}</span>
                <h3 className="text-user font-bold tracking-wider text-xl uppercase text-glow-user">
                  {persona}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-topic font-bold tracking-wider text-xl uppercase text-glow-topic">
                  {concept}
                </h3>
                <span className="text-3xl emoji-icon">{getConceptEmoji(concept)}</span>
              </div>
            </div>
          </div>

          {/* Content - Lesson Track + Rosetta Stone */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Show new structured content if available */}
              {lessonSteps && lessonSteps.length > 0 ? (
                <>
                  <LessonTrack lessonSteps={lessonSteps} />
                  {mappingPairs && mappingPairs.length > 0 && (
                    <RosettaStone mappingPairs={mappingPairs} />
                  )}
                </>
              ) : (
                /* Fallback to old dual-column layout if new data isn't available */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {/* Left Side: Persona World */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1 w-12 bg-gradient-to-r from-user to-transparent rounded-full"></div>
                      <h4 className="text-user/80 text-sm font-bold tracking-widest uppercase">
                        Your World
                      </h4>
                    </div>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed">
                      {leftText}
                    </p>
                  </div>

                  {/* Right Side: Tech World */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3 justify-end">
                      <h4 className="text-topic/80 text-sm font-bold tracking-widest uppercase">
                        Technical Concept
                      </h4>
                      <div className="h-1 w-12 bg-gradient-to-l from-topic to-transparent rounded-full"></div>
                    </div>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed text-right">
                      {rightText}
                    </p>
                  </div>

                  {/* Full Text if more paragraphs exist */}
                  {paragraphs.length > 2 && (
                    <div className="col-span-full mt-8 pt-6 border-t border-white/10">
                      <div className="prose prose-invert max-w-none">
                        {paragraphs.slice(2).map((para, idx) => (
                          <p key={idx} className="text-white/80 text-base leading-relaxed mb-4">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
