"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface InputFormProps {
  onSubmit: (data: { concept: string; persona: string; lessonStepMode: "fixed" | "dynamic" }) => void
  isLoading: boolean
  lessonStepMode: "fixed" | "dynamic"
  onLessonStepModeChange: (mode: "fixed" | "dynamic") => void
}

export default function InputForm({ onSubmit, isLoading, lessonStepMode, onLessonStepModeChange }: InputFormProps) {
  const [concept, setConcept] = useState("")
  const [persona, setPersona] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (concept.trim() && persona.trim()) {
      onSubmit({ concept: concept.trim(), persona: persona.trim(), lessonStepMode })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">

      {/* Inputs Container */}
      <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">

          {/* Concept Input */}
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40 pl-1">Target Concept</label>
            <Input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/20 text-lg md:text-xl py-6 px-4 rounded-xl focus:border-neon-green/50 focus:bg-white/10 transition-all font-display tracking-wide"
              placeholder="e.g. Transformer Architecture"
            />
          </div>

          {/* Connection Icon */}
          <div className="text-white/20 text-2xl pt-6 hidden md:block">→</div>

          {/* Persona Input */}
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40 pl-1">Source Metaphor</label>
            <Input
              type="text"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/20 text-lg md:text-xl py-6 px-4 rounded-xl focus:border-broadcast-blue/50 focus:bg-white/10 transition-all font-display tracking-wide"
              placeholder="e.g. NFL Offensive Schemes"
            />
          </div>
        </div>

        {/* Lesson Step Mode Toggle */}
        <div className="flex items-center justify-center mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 p-1 rounded-full bg-black/40 border border-white/5">
            <button
              type="button"
              onClick={() => onLessonStepModeChange("fixed")}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${lessonStepMode === "fixed"
                ? "bg-white/10 text-white shadow-inner"
                : "text-white/40 hover:text-white/60"
                }`}
            >
              QUICK (3 STEPS)
            </button>
            <button
              type="button"
              onClick={() => onLessonStepModeChange("dynamic")}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${lessonStepMode === "dynamic"
                ? "bg-neon-green/20 text-neon-green border border-neon-green/20 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
                : "text-white/40 hover:text-white/60"
                }`}
            >
              DEEP DIVE (5 STEPS)
            </button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        type="submit"
        disabled={isLoading || !concept.trim() || !persona.trim()}
        className="w-full h-20 bg-white text-black hover:bg-neon-green hover:text-black hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all duration-300 rounded-full font-bold text-xl tracking-[0.2em] uppercase border border-white/20"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>ESTABLISHING LINK...</span>
          </div>
        ) : (
          <span>INITIALIZE CUSTOM LINK</span>
        )}
      </Button>
    </form>
  )
}
