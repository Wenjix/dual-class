"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

interface MultipleChoiceQuizProps {
  question: string
  options: QuizOption[]
  explanation: string
}

export default function MultipleChoiceQuiz({
  question,
  options,
  explanation,
}: MultipleChoiceQuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleOptionClick = (optionId: string) => {
    if (showResult) return // Prevent re-selection after answer

    setSelectedOption(optionId)
    setShowResult(true)
  }

  const getOptionClass = (option: QuizOption) => {
    if (!showResult) {
      return "bg-topic/10 border-2 border-topic/30 hover:border-topic hover:bg-topic/20 hover:shadow-neon-topic text-white"
    }

    if (option.is_correct) {
      return "bg-green-500/20 border-2 border-green-500 shadow-lg shadow-green-500/50 text-green-100"
    }

    if (selectedOption === option.id && !option.is_correct) {
      return "bg-red-500/20 border-2 border-red-500 animate-shake text-red-100"
    }

    return "bg-white/5 border-2 border-white/10 text-white/40"
  }

  const isCorrect = selectedOption && options.find(o => o.id === selectedOption)?.is_correct

  return (
    <Card className="glass-panel w-full max-w-6xl mx-auto border-white/10">
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="text-3xl md:text-4xl emoji-icon">🎯</span>
          <h3 className="text-xl md:text-2xl font-semibold text-white/90">Visual Challenge</h3>
        </div>

        {/* Question */}
        <p className="text-base md:text-lg text-white/70 leading-relaxed">{question}</p>

        {/* Options Grid: 2x2 on desktop, 1x4 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={showResult}
              className={`${getOptionClass(option)}
                         px-4 md:px-6 py-3 md:py-4 rounded-xl
                         text-left text-base md:text-lg font-medium
                         transition-all duration-300
                         disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-topic focus:ring-offset-2 focus:ring-offset-obsidian`}
            >
              <span className="font-bold mr-2">{option.id.toUpperCase()}.</span>
              {option.text}
            </button>
          ))}
        </div>

        {/* Result & Explanation */}
        {showResult && (
          <div className="space-y-3 animate-slide-in pt-4 border-t border-white/10">
            {isCorrect ? (
              <>
                <Badge className="bg-green-500/30 text-green-100 border-green-500/50 shadow-lg shadow-green-500/30
                                  animate-glow-pulse text-base px-4 py-1">
                  ✓ Correct!
                </Badge>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  {explanation}
                </p>
              </>
            ) : (
              <>
                <Badge className="bg-red-500/30 text-red-100 border-red-500/50
                                  text-base px-4 py-1">
                  ✗ Incorrect
                </Badge>
                <p className="text-sm md:text-base text-red-400 font-medium">
                  Try again! Look carefully at the visual elements in the image.
                </p>
              </>
            )}
          </div>
        )}

        {/* Hint */}
        {!showResult && (
          <p className="text-sm text-white/40 italic text-center">
            Select an answer to check your understanding
          </p>
        )}
      </CardContent>
    </Card>
  )
}
