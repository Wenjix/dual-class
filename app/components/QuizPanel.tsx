"use client"

import { useState, FormEvent, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface QuizPanelProps {
  question: string
  correctAnswer: string
  onAnswerSubmit: (isCorrect: boolean) => void
  quizResult: 'correct' | 'incorrect' | null
  quizExplanation?: string
}

function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (str: string) => str.toLowerCase().trim()
  const user = normalize(userAnswer)
  const correct = normalize(correctAnswer)

  // Exact match
  if (user === correct) return true

  // Partial match (minimum 3 characters)
  if (correct.includes(user) && user.length >= 3) return true
  if (user.includes(correct) && user.length >= 3) return true

  return false
}

export default function QuizPanel({
  question,
  correctAnswer,
  onAnswerSubmit,
  quizResult,
  quizExplanation,
}: QuizPanelProps) {
  const [userAnswer, setUserAnswer] = useState("")

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (userAnswer.trim()) {
      const isCorrect = validateAnswer(userAnswer, correctAnswer)
      onAnswerSubmit(isCorrect)
      if (isCorrect) {
        setUserAnswer("") // Clear on correct answer
      }
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Card className="glass-panel w-full max-w-6xl mx-auto border-white/10">
      <CardContent className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl md:text-4xl emoji-icon">🎯</span>
          <h3 className="text-xl md:text-2xl font-semibold text-white/90">Visual Challenge</h3>
        </div>

        <p className="text-base md:text-lg text-white/70 leading-relaxed">{question}</p>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={quizResult === 'correct'}
            className={`flex-1 bg-topic/10 border-2 border-topic/30
                       focus:border-topic focus:shadow-neon-topic focus-visible:ring-topic
                       text-topic placeholder:text-topic/40 text-base
                       ${quizResult === 'incorrect' ? 'border-red-500 animate-shake' : ''}`}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={!userAnswer.trim() || quizResult === 'correct'}
            className="bg-topic hover:bg-topic/90 hover:shadow-neon-topic
                       transition-all duration-300 text-white font-semibold px-6"
          >
            Submit
          </Button>
        </div>

        {quizResult === 'correct' && (
          <div className="space-y-2 animate-slide-in">
            <Badge className="bg-topic/30 text-topic border-topic/50 shadow-neon-topic
                              animate-glow-pulse text-base px-4 py-1">
              ✓ Correct!
            </Badge>
            {quizExplanation && (
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {quizExplanation}
              </p>
            )}
          </div>
        )}

        {quizResult === 'incorrect' && (
          <p className="text-sm md:text-base text-red-400 font-medium">
            Try again! (Hint: Look carefully at the attention weights in the image)
          </p>
        )}
      </CardContent>
    </Card>
  )
}
