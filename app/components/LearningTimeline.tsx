"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface LessonStep {
  step_number: number
  title: string
  metaphor_text: string
  literal_text: string
  image_callout: number
}

interface LearningTimelineProps {
  persona: string
  concept: string
  lessonSteps: LessonStep[]
  personaEmoji: string
  conceptEmoji: string
}

// Convert numbers to circled Unicode characters
const getCircledNumber = (num: number): string => {
  const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨']
  return circledNumbers[num - 1] || num.toString()
}

export default function LearningTimeline({
  persona,
  concept,
  lessonSteps,
  personaEmoji,
  conceptEmoji,
}: LearningTimelineProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const handleStepClick = (stepNumber: number) => {
    setActiveStep(activeStep === stepNumber ? null : stepNumber)
  }

  const activeStepData = lessonSteps.find(s => s.step_number === activeStep)

  return (
    <div className="w-full max-w-6xl mx-auto space-y-3">
      {/* Timeline Bar */}
      <div className="glass-panel border border-white/10 rounded-2xl px-4 md:px-6 py-3">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Persona (Start) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl md:text-2xl emoji-icon">{personaEmoji}</span>
            <span className="text-user font-bold text-xs md:text-sm uppercase tracking-wider hidden sm:inline">
              {persona}
            </span>
          </div>

          {/* Timeline with Steps */}
          <div className="flex-1 flex items-center relative">
            {/* Background Line */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-user via-white/20 to-topic -translate-y-1/2" />

            {/* Step Nodes */}
            <div className="relative flex items-center justify-around w-full">
              {lessonSteps.map((step) => (
                <button
                  key={step.step_number}
                  onClick={() => handleStepClick(step.step_number)}
                  className={`relative z-10 flex flex-col items-center gap-1 group transition-all duration-200
                              ${activeStep === step.step_number ? 'scale-110' : 'hover:scale-105'}`}
                >
                  {/* Step Circle */}
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                                   transition-all duration-200 border-2
                                   ${activeStep === step.step_number
                                     ? 'bg-topic/30 border-topic shadow-neon-topic'
                                     : 'bg-obsidian/80 border-white/20 hover:border-topic/50 hover:bg-topic/10'}`}>
                    <span className={`text-sm md:text-base font-bold transition-colors
                                     ${activeStep === step.step_number ? 'text-topic' : 'text-white/70 group-hover:text-topic'}`}>
                      {getCircledNumber(step.step_number)}
                    </span>
                  </div>

                  {/* Step Title (visible on hover or active) */}
                  <span className={`absolute top-full mt-1 text-[10px] md:text-xs font-medium whitespace-nowrap
                                    transition-all duration-200 max-w-[80px] md:max-w-[120px] truncate text-center
                                    ${activeStep === step.step_number
                                      ? 'opacity-100 text-topic'
                                      : 'opacity-0 group-hover:opacity-100 text-white/60'}`}>
                    {step.title}
                  </span>

                  {/* Active Indicator Arrow */}
                  {activeStep === step.step_number && (
                    <ChevronDown className="absolute -bottom-6 w-4 h-4 text-topic animate-bounce" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Concept (End) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-topic font-bold text-xs md:text-sm uppercase tracking-wider hidden sm:inline">
              {concept}
            </span>
            <span className="text-xl md:text-2xl emoji-icon">{conceptEmoji}</span>
          </div>
        </div>
      </div>

      {/* Expanded Step Content */}
      {activeStepData && (
        <div className="glass-panel border border-white/10 rounded-2xl p-4 md:p-6 animate-slide-in">
          {/* Step Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-topic/20 border-2 border-topic/40
                            flex items-center justify-center shadow-neon-topic">
              <span className="text-topic text-lg font-bold">
                {getCircledNumber(activeStepData.step_number)}
              </span>
            </div>
            <h3 className="text-white font-bold text-base md:text-lg">
              {activeStepData.title}
            </h3>
          </div>

          {/* Dual Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Left: Metaphor (User/Pink) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6 bg-gradient-to-r from-user to-transparent rounded-full" />
                <span className="text-user/80 text-xs font-bold tracking-widest uppercase">
                  {persona}'s View
                </span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                {activeStepData.metaphor_text}
              </p>
            </div>

            {/* Right: Technical (Topic/Cyan) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 md:justify-end">
                <span className="text-topic/80 text-xs font-bold tracking-widest uppercase md:order-2">
                  Technical Concept
                </span>
                <div className="h-0.5 w-6 bg-gradient-to-l from-topic to-transparent rounded-full md:order-1" />
              </div>
              <p className="text-white/90 text-sm leading-relaxed md:text-right">
                {activeStepData.literal_text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

