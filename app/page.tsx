"use client"

import { useState, useEffect } from "react"
import InputForm from "./components/InputForm"
import MetaphorCard from "./components/MetaphorCard"
import MultipleChoiceQuiz from "./components/MultipleChoiceQuiz"
import { Button } from "@/components/ui/button"

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

interface MetaphorResponse {
  persona: string
  concept: string
  metaphor_logic: string
  explanation_text: string
  imageUrl: string
  visual_style: string
  quiz_question: string
  quiz_answer: string
  quiz_explanation: string
  lesson_steps: LessonStep[]
  mapping_pairs: MappingPair[]
  visual_callouts: VisualCallout[]
  quiz_options: QuizOption[]
  why_text?: string
  why_imageUrl?: string
  error_states?: ErrorState[]
  fallback_error?: ErrorState
}

export default function Home() {
  const [concept, setConcept] = useState("")
  const [persona, setPersona] = useState("")
  const [metaphorData, setMetaphorData] = useState<MetaphorResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null)

  // New state for lesson step mode and callout visibility
  const [lessonStepMode, setLessonStepMode] = useState<"fixed" | "dynamic">("dynamic")
  const [showCallouts, setShowCallouts] = useState(true)

  // Pre-load cached responses for context switching
  const [chefData, setChefData] = useState<MetaphorResponse | null>(null)
  const [captainData, setCaptainData] = useState<MetaphorResponse | null>(null)

  // Load cached data on mount
  useEffect(() => {
    async function loadCachedData() {
      try {
        const [chefRes, captainRes] = await Promise.all([
          fetch('/data/chef_response.json'),
          fetch('/data/captain_response.json'),
        ])
        const chef = await chefRes.json()
        const captain = await captainRes.json()

        setChefData(chef)
        setCaptainData(captain)

        // Display Chef data initially for demo
        setMetaphorData(chef)
        setConcept(chef.concept)
        setPersona(chef.persona)
      } catch (error) {
        console.error('Error loading cached data:', error)
      }
    }

    loadCachedData()
  }, [])

  const handleGenerate = async (data: { concept: string; persona: string; lessonStepMode: "fixed" | "dynamic" }) => {
    setIsLoading(true)
    setQuizResult(null)
    setConcept(data.concept)
    setPersona(data.persona)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate explanation')
      }

      const result = await response.json()
      setMetaphorData(result)

      // Update cached data if it's a demo persona
      if (result.persona === 'Chef') {
        setChefData(result)
      } else if (result.persona === 'Starship Captain') {
        setCaptainData(result)
      }
    } catch (error) {
      console.error('Error generating explanation:', error)
      alert('Failed to generate explanation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuizSubmit = (isCorrect: boolean) => {
    setQuizResult(isCorrect ? 'correct' : 'incorrect')

    if (!isCorrect) {
      // Reset after animation completes
      setTimeout(() => setQuizResult(null), 500)
    }
  }

  const handleContextSwitch = () => {
    if (!metaphorData || !chefData || !captainData) return

    setIsSwitching(true)

    setTimeout(() => {
      const newData = metaphorData.persona === 'Chef' ? captainData : chefData
      setMetaphorData(newData)
      setConcept(newData.concept)
      setPersona(newData.persona)
      setQuizResult(null)
      setIsSwitching(false)
    }, 200)
  }

  const alternatePersona = metaphorData?.persona === 'Chef' ? 'Starship Captain' : 'Chef'

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Dual Class</h1>
          <p className="text-lg md:text-xl text-white/70">
            Learn complex concepts through personalized metaphors powered by Gemini
          </p>
        </header>

        <InputForm
          onSubmit={handleGenerate}
          isLoading={isLoading}
          lessonStepMode={lessonStepMode}
          onLessonStepModeChange={setLessonStepMode}
        />

        {metaphorData && (
          <>
            <MetaphorCard
              persona={metaphorData.persona}
              concept={metaphorData.concept}
              explanation_text={metaphorData.explanation_text}
              imageUrl={metaphorData.imageUrl}
              isSwitching={isSwitching}
              lessonSteps={metaphorData.lesson_steps}
              mappingPairs={metaphorData.mapping_pairs}
              visualCallouts={metaphorData.visual_callouts}
              showCallouts={showCallouts}
              onToggleCallouts={() => setShowCallouts(!showCallouts)}
            />

            <MultipleChoiceQuiz
              question={metaphorData.quiz_question}
              options={metaphorData.quiz_options}
              explanation={metaphorData.quiz_explanation}
              whyText={metaphorData.why_text}
              whyImageUrl={metaphorData.why_imageUrl}
              errorStates={metaphorData.error_states}
              fallbackError={metaphorData.fallback_error}
            />

            {chefData && captainData && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleContextSwitch}
                  disabled={isLoading || isSwitching}
                  className="glass-panel hover:shadow-neon-user transition-all duration-300
                             text-white font-semibold px-8 border-white/20 hover:border-user"
                >
                  <span className="emoji-icon mr-2">🔄</span>
                  Switch to {alternatePersona}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
