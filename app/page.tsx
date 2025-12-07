"use client"

import { useState, useEffect } from "react"
import InputForm from "./components/InputForm"
import LearningTimeline from "./components/LearningTimeline"
import MetaphorCard from "./components/MetaphorCard"
import MultipleChoiceQuiz from "./components/MultipleChoiceQuiz"
import LogsModal from "./components/LogsModal"
import { Button } from "@/components/ui/button"
import { LogEntry, LogType, createLog, truncateText } from "@/app/types/logs"

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
  return '👤'
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
  return '💻'
}

export default function Home() {
  const [concept, setConcept] = useState("")
  const [persona, setPersona] = useState("")
  const [metaphorData, setMetaphorData] = useState<MetaphorResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null)

  // State for lesson step mode
  const [lessonStepMode, setLessonStepMode] = useState<"fixed" | "dynamic">("fixed")
  const [isGeneratingErrorMirror, setIsGeneratingErrorMirror] = useState(false)
  const [errorMirrorVersion, setErrorMirrorVersion] = useState(0)

  // System logs state
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([])
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false)

  // Pre-load cached responses for context switching
  const [chefData, setChefData] = useState<MetaphorResponse | null>(null)
  const [captainData, setCaptainData] = useState<MetaphorResponse | null>(null)

  // Helper function to add logs
  const addLog = (type: LogType, message: string, details?: string, metadata?: Record<string, any>) => {
    setSystemLogs(prev => [...prev, createLog(type, message, details, metadata)])
  }

  // Load cached data on mount (for context switching, but don't display until Generate is clicked)
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
        // Don't set metaphorData here - wait for user to click Generate
      } catch (error) {
        console.error('Error loading cached data:', error)
      }
    }

    loadCachedData()
  }, [])

  const handleGenerate = async (data: { concept: string; persona: string; lessonStepMode: "fixed" | "dynamic" }) => {
    // Clear previous logs
    setSystemLogs([])

    // Add initial log
    addLog('info', 'Generation request initiated',
      `Concept: ${data.concept}\nPersona: ${data.persona}\nMode: ${data.lessonStepMode}`,
      {
        concept: data.concept,
        persona: data.persona,
        lessonStepMode: data.lessonStepMode
      }
    )

    setIsLoading(true)
    setQuizResult(null)
    setConcept(data.concept)
    setPersona(data.persona)

    try {
      // Log API call
      addLog('api-call', 'Calling generation API',
        'Endpoint: POST /api/generate\nModel: gemini-3-pro-preview',
        {
          endpoint: '/api/generate',
          method: 'POST'
        }
      )

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

      // Log API response
      addLog('api-response', 'Received metaphor data',
        truncateText(JSON.stringify(result, null, 2), 300),
        {
          persona: result.persona,
          concept: result.concept,
          lessonSteps: result.lesson_steps?.length || 0,
          responseTime: result._meta?.responseTime ? `${result._meta.responseTime}ms` : 'unknown'
        }
      )

      // Detect if using cached response (check metadata first, then fallback to image URL)
      const isCached = result._meta?.cached ?? (
        result.imageUrl?.includes('/images/chef_') ||
        result.imageUrl?.includes('/images/captain_')
      )

      if (isCached) {
        const isFallback = result._meta?.fallback
        addLog('info', isFallback ? 'Using fallback cached response' : 'Using cached demo response',
          `Loaded pre-generated ${result.persona} data from cache${isFallback ? ' (API error fallback)' : ''}`,
          {
            persona: result.persona,
            cached: true,
            fallback: isFallback || false,
            responseTime: result._meta?.responseTime ? `${result._meta.responseTime}ms` : 'unknown'
          }
        )
      } else {
        addLog('success', 'Live API generation complete',
          `Successfully generated content with ${result.lesson_steps?.length || 0} lesson steps`,
          {
            cached: false,
            model: result._meta?.model || 'gemini-3-pro-preview',
            responseTime: result._meta?.responseTime ? `${result._meta.responseTime}ms` : 'unknown'
          }
        )
      }

      setMetaphorData(result)

      // Final success log
      addLog('success', 'Content loaded successfully',
        `Ready to display educational content for "${result.concept}" as explained by a ${result.persona}`)

      // Update cached data if it's a demo persona
      if (result.persona === 'Chef') {
        setChefData(result)
      } else if (result.persona === 'Starship Captain') {
        setCaptainData(result)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      addLog('error', 'Generation failed', errorMessage, {
        error: errorMessage
      })
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

  const handleGenerateErrorMirror = async () => {
    if (!metaphorData) return

    setIsGeneratingErrorMirror(true)

    try {
      const context = {
        persona: metaphorData.persona,
        concept: metaphorData.concept,
        metaphor_logic: metaphorData.metaphor_logic,
        quiz_question: metaphorData.quiz_question,
        quiz_answer: metaphorData.quiz_answer,
        quiz_options: metaphorData.quiz_options,
      }

      const response = await fetch('/api/generate-error-mirror', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
      })

      if (!response.ok) {
        throw new Error('Failed to generate error mirror content')
      }

      const result = await response.json()

      // Update metaphorData with the new error mirror content
      setMetaphorData({
        ...metaphorData,
        error_states: result.error_states,
        fallback_error: result.fallback_error,
        why_text: result.why_text,
        why_imageUrl: result.why_imageUrl,
      })

      // Increment version to force quiz component to re-render
      setErrorMirrorVersion(prev => prev + 1)

      // Also update cached data if applicable
      if (metaphorData.persona === 'Chef') {
        setChefData(prev => prev ? {
          ...prev,
          error_states: result.error_states,
          fallback_error: result.fallback_error,
          why_text: result.why_text,
          why_imageUrl: result.why_imageUrl,
        } : null)
      } else if (metaphorData.persona === 'Starship Captain') {
        setCaptainData(prev => prev ? {
          ...prev,
          error_states: result.error_states,
          fallback_error: result.fallback_error,
          why_text: result.why_text,
          why_imageUrl: result.why_imageUrl,
        } : null)
      }

      alert('Error mirror content generated successfully!')
    } catch (error) {
      console.error('Error generating error mirror:', error)
      alert('Failed to generate error mirror content. Please try again.')
    } finally {
      setIsGeneratingErrorMirror(false)
    }
  }

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
            {/* Learning Timeline - Above the image */}
            {metaphorData.lesson_steps && metaphorData.lesson_steps.length > 0 && (
              <LearningTimeline
                persona={metaphorData.persona}
                concept={metaphorData.concept}
                lessonSteps={metaphorData.lesson_steps}
                personaEmoji={getPersonaEmoji(metaphorData.persona)}
                conceptEmoji={getConceptEmoji(metaphorData.concept)}
              />
            )}

            <MetaphorCard
              persona={metaphorData.persona}
              concept={metaphorData.concept}
              imageUrl={metaphorData.imageUrl}
              isSwitching={isSwitching}
              mappingPairs={metaphorData.mapping_pairs}
              visualCallouts={metaphorData.visual_callouts}
            />

            <MultipleChoiceQuiz
              key={`quiz-${metaphorData.persona}-${metaphorData.concept}-${errorMirrorVersion}`}
              question={metaphorData.quiz_question}
              options={metaphorData.quiz_options}
              explanation={metaphorData.quiz_explanation}
              whyText={metaphorData.why_text}
              whyImageUrl={metaphorData.why_imageUrl}
              errorStates={metaphorData.error_states}
              fallbackError={metaphorData.fallback_error}
            />

            {/* Generate Error Mirror Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGenerateErrorMirror}
                disabled={isGeneratingErrorMirror || isLoading}
                className="glass-panel hover:shadow-neon-topic transition-all duration-300
                           text-white font-semibold px-8 border-white/20 hover:border-topic
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingErrorMirror ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating Error Mirror...
                  </>
                ) : (
                  <>
                    <span className="emoji-icon mr-2">🪞</span>
                    Generate Error Mirror Content
                  </>
                )}
              </Button>
            </div>

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

            {/* System Logs Button */}
            {systemLogs.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsLogsModalOpen(true)}
                  className="glass-panel hover:shadow-neon-topic transition-all duration-300
                             text-white font-semibold px-8 border-white/20 hover:border-topic"
                >
                  <span className="emoji-icon mr-2">📋</span>
                  View System Logs ({systemLogs.length})
                </Button>
              </div>
            )}
          </>
        )}

        {/* Logs Modal */}
        <LogsModal
          isOpen={isLogsModalOpen}
          onOpenChange={setIsLogsModalOpen}
          logs={systemLogs}
          showTrigger={false}
        />
      </div>
    </main>
  )
}
