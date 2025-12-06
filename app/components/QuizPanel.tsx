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
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Quiz</h3>
          <p className="text-base text-muted-foreground">{question}</p>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={quizResult === 'correct'}
            className={`flex-1 ${
              quizResult === 'incorrect'
                ? 'border-red-500 animate-shake'
                : ''
            }`}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={!userAnswer.trim() || quizResult === 'correct'}
          >
            Submit
          </Button>
        </div>

        {quizResult === 'correct' && (
          <div className="space-y-2">
            <Badge className="bg-green-500 hover:bg-green-500 animate-pulse">
              ✓ Correct!
            </Badge>
            {quizExplanation && (
              <p className="text-sm text-muted-foreground">
                {quizExplanation}
              </p>
            )}
          </div>
        )}

        {quizResult === 'incorrect' && (
          <p className="text-sm text-red-500">
            Try again! (Hint: Look carefully at the attention weights in the image)
          </p>
        )}
      </CardContent>
    </Card>
  )
}
