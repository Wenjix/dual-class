"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface InputFormProps {
  onSubmit: (data: { concept: string; persona: string }) => void
  isLoading: boolean
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [concept, setConcept] = useState("")
  const [persona, setPersona] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (concept.trim() && persona.trim()) {
      onSubmit({ concept: concept.trim(), persona: persona.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="space-y-2">
        <label htmlFor="concept" className="text-sm font-medium">
          Teach me...
        </label>
        <Input
          id="concept"
          type="text"
          placeholder="e.g., Transformer Attention Mechanism"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          disabled={isLoading}
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="persona" className="text-sm font-medium">
          ...as a...
        </label>
        <Input
          id="persona"
          type="text"
          placeholder="e.g., Chef, Starship Captain, Firefighter"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          disabled={isLoading}
          className="text-base"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !concept.trim() || !persona.trim()}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate"
        )}
      </Button>
    </form>
  )
}
