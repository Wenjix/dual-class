"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ErrorMirror from "./ErrorMirror"

interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

interface ErrorState {
  wrong_option_id: string
  misconception_title: string
  wrong_connection_visual: string
  correct_connection_visual: string
  explanation_text: string
  wrong_label: string
  correct_label: string
}

interface MultipleChoiceQuizProps {
  question: string
  options: QuizOption[]
  explanation: string
  whyText?: string
  whyImageUrl?: string
  errorStates?: ErrorState[]
  fallbackError?: ErrorState
  onCorrectAnswer?: () => void
}

export default function MultipleChoiceQuiz({
  question,
  options,
  explanation,
  whyText,
  whyImageUrl,
  errorStates,
  fallbackError,
  onCorrectAnswer,
}: MultipleChoiceQuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [showErrorMirror, setShowErrorMirror] = useState(false)
  const [currentErrorState, setCurrentErrorState] = useState<ErrorState | null>(null)

  // Update currentErrorState when errorStates prop changes (e.g., after regeneration)
  useEffect(() => {
    if (selectedOption && showErrorMirror && errorStates) {
      const updatedErrorState = errorStates.find(e => e.wrong_option_id === selectedOption)
      if (updatedErrorState) {
        setCurrentErrorState(updatedErrorState)
      } else if (fallbackError) {
        setCurrentErrorState(fallbackError)
      }
    }
  }, [errorStates, fallbackError, selectedOption, showErrorMirror])

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId)
    setShowResult(true)
    setShowWhy(false) // Reset "Why?" state on new answer
    setShowErrorMirror(false) // Reset Error Mirror on new answer
  }

  const handleWhyClick = () => {
    setShowWhy(!showWhy)
    if (!showWhy) {
      setShowErrorMirror(false) // Hide Error Mirror when showing Why
    }
  }

  const handleShowErrorMirror = () => {
    if (!selectedOption || !errorStates) return

    // Find error state for selected wrong option
    const errorState = errorStates.find(e => e.wrong_option_id === selectedOption)

    setCurrentErrorState(errorState || fallbackError || null)
    setShowErrorMirror(true)
    setShowWhy(false) // Hide Why when showing Error Mirror
  }

  const getOptionClass = (option: QuizOption) => {
    // If no result shown yet, use default styling
    if (!showResult) {
      return "bg-topic/10 border-2 border-topic/30 hover:border-topic hover:bg-topic/20 hover:shadow-neon-topic text-white"
    }

    // If this is the correct answer, always show it as correct
    if (option.is_correct) {
      return "bg-green-500/20 border-2 border-green-500 shadow-lg shadow-green-500/50 text-green-100 hover:bg-green-500/30"
    }

    // If this is the currently selected wrong option, show it as incorrect
    if (selectedOption === option.id && !option.is_correct) {
      return "bg-red-500/20 border-2 border-red-500 animate-shake text-red-100 hover:bg-red-500/30"
    }

    // Other options remain clickable but with muted styling
    return "bg-white/5 border-2 border-white/10 text-white/40 hover:border-white/20 hover:bg-white/10"
  }

  const isCorrect = selectedOption && options.find(o => o.id === selectedOption)?.is_correct

  // Trigger callback when user answers correctly
  useEffect(() => {
    if (isCorrect && showResult && onCorrectAnswer) {
      onCorrectAnswer()
    }
  }, [isCorrect, showResult, onCorrectAnswer])

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
              className={`${getOptionClass(option)}
                         px-4 md:px-6 py-3 md:py-4 rounded-xl
                         text-left text-base md:text-lg font-medium
                         transition-all duration-300
                         cursor-pointer
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
                  ✗ Not quite
                </Badge>
                <p className="text-sm md:text-base text-red-400 font-medium">
                  Try again! Look carefully at the visual elements in the image.
                </p>

                {/* "See what went wrong" button - NEW */}
                {(errorStates || fallbackError) && !showErrorMirror && (
                  <button
                    onClick={handleShowErrorMirror}
                    className="mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-lg
                               bg-red-500/20 border-2 border-red-500/40 hover:bg-red-500/30
                               hover:border-red-500 text-red-100 hover:text-white font-semibold
                               transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20
                               focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <span className="text-lg">🪞</span>
                    <span>See what went wrong</span>
                  </button>
                )}

                {/* Error Mirror Display */}
                {showErrorMirror && currentErrorState && (
                  <ErrorMirror errorState={currentErrorState} />
                )}
              </>
            )}

            {/* "Why?" Button - Show when quiz has why content */}
            {(whyText || whyImageUrl) && (
              <div className="pt-2">
                <button
                  onClick={handleWhyClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40
                             text-white/80 hover:text-white font-medium text-sm
                             transition-all duration-300 hover:shadow-lg hover:shadow-white/10
                             focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <span className="text-lg">🤔</span>
                  <span>{showWhy ? 'Hide explanation' : 'Why?'}</span>
                </button>

                {/* "Why?" Explanation - Appears when button is clicked */}
                {showWhy && (
                  <div className="mt-4 space-y-4 animate-slide-in">
                    {/* Visual Explanation Image */}
                    {whyImageUrl && (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/20
                                      shadow-xl shadow-white/5">
                        <img
                          src={whyImageUrl}
                          alt="Visual explanation"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Text Explanation */}
                    {whyText && (
                      <div className="p-4 rounded-lg bg-white/5 border border-white/20">
                        <p className="text-sm md:text-base text-white/80 leading-relaxed">
                          {whyText}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
