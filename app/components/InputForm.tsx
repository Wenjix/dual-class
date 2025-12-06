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
    <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-12 rounded-3xl max-w-4xl mx-auto">
      <div className="text-2xl md:text-4xl text-white/90 flex flex-wrap items-baseline justify-center gap-2 md:gap-3 mb-8">
        <span className="font-medium">Teach me</span>

        <Input
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          disabled={isLoading}
          className="inline-flex w-auto min-w-[250px] md:min-w-[300px] bg-topic/10 border-2 border-topic/30
                     focus:border-topic focus:shadow-neon-topic focus-visible:ring-topic text-topic
                     text-2xl md:text-4xl placeholder:text-topic/40 bg-transparent rounded-lg px-3 md:px-4
                     h-auto py-1 md:py-2 font-medium"
          placeholder="a complex concept"
        />

        <span className="font-medium">as a</span>

        <Input
          type="text"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          disabled={isLoading}
          className="inline-flex w-auto min-w-[180px] md:min-w-[200px] bg-user/10 border-2 border-user/30
                     focus:border-user focus:shadow-neon-user focus-visible:ring-user text-user
                     text-2xl md:text-4xl placeholder:text-user/40 bg-transparent rounded-lg px-3 md:px-4
                     h-auto py-1 md:py-2 font-medium"
          placeholder="profession or hobby"
        />
      </div>

      {/* Lesson Step Mode Toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-white/60 text-sm md:text-base font-medium">Learning Depth:</span>
        <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => onLessonStepModeChange("fixed")}
            className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
              lessonStepMode === "fixed"
                ? "bg-topic text-white shadow-neon-topic"
                : "text-white/60 hover:text-white"
            }`}
          >
            Fixed (3 steps)
          </button>
          <button
            type="button"
            onClick={() => onLessonStepModeChange("dynamic")}
            className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
              lessonStepMode === "dynamic"
                ? "bg-topic text-white shadow-neon-topic"
                : "text-white/60 hover:text-white"
            }`}
          >
            Dynamic (3-5 steps)
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !concept.trim() || !persona.trim()}
        className="w-full bg-gradient-to-r from-user to-topic hover:shadow-neon-user
                   hover:from-user/90 hover:to-topic/90 transition-all duration-300
                   text-white font-bold text-lg py-6 rounded-xl"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <span className="text-2xl mr-2 emoji-icon">✨</span>
            Generate
          </>
        )}
      </Button>
    </form>
  )
}
