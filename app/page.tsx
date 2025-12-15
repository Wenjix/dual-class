"use client"

import { useState, useEffect } from "react"
import InputForm from "./components/InputForm"
import LearningTimeline from "./components/LearningTimeline"
import MetaphorCard from "./components/MetaphorCard"
import MultipleChoiceQuiz from "./components/MultipleChoiceQuiz"
import LogsModal from "./components/LogsModal"
import DualClassBadge from "./components/DualClassBadge"
import { Button } from "@/components/ui/button"
import { LogEntry, LogType, createLog, truncateText } from "@/app/types/logs"
import FileUploader from "@/components/FileUploader"
import QuestMap from "@/components/QuestMap"
import { MOCK_CURRICULUM, QuestLevel } from "@/lib/mock-curriculum"
import { MOCK_GAMER_DATA, MOCK_SPORTS_DATA } from "@/lib/data"
import { GamifiedCard } from "@/components/GamifiedCard"
import { QuizSection } from "@/components/QuizSection"

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

  // Badge system state - persists across concept changes within session
  const [badgeUnlocked, setBadgeUnlocked] = useState(false)
  const [badgeShowAnimation, setBadgeShowAnimation] = useState(false)

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

  // Curriculum Transformation State
  const [viewMode, setViewMode] = useState<"input" | "processing" | "quest_map" | "level">("input")
  const [activeLevelId, setActiveLevelId] = useState<number | undefined>(undefined)

  // Metaphor State (Gamer vs Sports) - Persistent across views
  const [currentPersonaMode, setCurrentPersonaMode] = useState<'gamer' | 'sports'>('gamer')

  // Error Mirror State for Drill Down
  const [isErrorMode, setIsErrorMode] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Progress State
  // Initialize with the default curriculum state, but we'll modify it locally
  const [curriculumState, setCurriculumState] = useState(MOCK_CURRICULUM)

  const handleFileUpload = (file: File) => {
    setViewMode("processing")
    // Mock processing delay
    setTimeout(() => {
      setViewMode("quest_map")
    }, 2500)
  }

  const handleLevelSelect = (level: QuestLevel) => {
    // Only allow selecting unlocked levels - data consistency check
    // Visuals handle the click prevention, but good to have a guard
    if (level.status === 'LOCKED') return;

    setActiveLevelId(level.id)
    // Map level 1 to our existing data
    // For now, Levels 2 & 3 are locked so this is safe
    if (level.id === 1) {
      setViewMode("level")
    }
  }

  const handleLevelComplete = () => {
    // Logic to unlock the next level
    // For demo: Completing Level 1 unlocks Level 2
    if (activeLevelId === 1) {
      setCurriculumState(prev => ({
        ...prev,
        levels: prev.levels.map(l => {
          if (l.id === 1) return { ...l, status: 'COMPLETED' as const };
          if (l.id === 2) return { ...l, status: 'UNLOCKED' as const }; // UNLOCK NEXT LEVEL
          return l;
        })
      }))
      alert("Level Complete! Next Quest Unlocked.");
      handleBackToMap();
    }
  }

  const handleBackToMap = () => {
    setViewMode("quest_map")
    setActiveLevelId(undefined)
  }

  const togglePersonaMode = () => {
    setIsErrorMode(false) // Reset error mode on switch
    setCurrentPersonaMode(prev => prev === 'gamer' ? 'sports' : 'gamer')
  }

  const triggerErrorMirror = () => {
    setIsErrorMode(true)
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  // Derived data based on mode
  const currentCardData = currentPersonaMode === 'gamer' ? MOCK_GAMER_DATA : MOCK_SPORTS_DATA

  const handleGenerate = async (data: { concept: string; persona: string; lessonStepMode: "fixed" | "dynamic" }) => {
    // Legacy generation logic - keeping for reference or mixed usage if needed
    // For the Drill Down demo, we rely on currentCardData
    console.log("Generating...", data)
  }

  // ... (keep unused functions for safety)

  return (
    <main className="min-h-screen py-12 px-4">
      {/* ... keeping header ... */}
      <div className="container mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Dual Class</h1>
          <p className="text-lg md:text-xl text-white/70">
            Learn complex concepts through personalized metaphors powered by Gemini
          </p>
        </header>

        {/* View Mode Switching */}
        {viewMode === "input" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4">
              <p className="text-xl text-white/60">Choose your path</p>
            </div>
            <FileUploader onFileSelect={handleFileUpload} />
            {/* ... keeping InputForm ... */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-2 text-muted-foreground">Or start manually</span>
              </div>
            </div>

            <InputForm
              onSubmit={handleGenerate}
              isLoading={isLoading}
              lessonStepMode={lessonStepMode}
              onLessonStepModeChange={setLessonStepMode}
            />
          </div>
        )}

        {viewMode === "processing" && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <FileUploader onFileSelect={() => { }} isProcessing={true} />
          </div>
        )}

        {viewMode === "quest_map" && (
          <QuestMap
            curriculum={curriculumState} // Use dynamic state instead of static mock
            onLevelSelect={handleLevelSelect}
            currentLevelId={activeLevelId}
          />
        )}

        {viewMode === "level" && (
          <div className={`animate-in fade-in zoom-in duration-300 ${isShaking ? 'animate-shake' : ''}`}>
            {/* Red Flash Overlay for Error */}
            <div className={`fixed inset-0 z-40 bg-red-500 pointer-events-none transition-opacity duration-200 ${isShaking ? 'opacity-30' : 'opacity-0'}`}></div>

            {/* Navigation Header */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
              <Button
                variant="ghost"
                onClick={handleBackToMap}
                className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:text-white transition-all group text-white/60"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-bold text-xs uppercase tracking-widest">Back to Map</span>
              </Button>

              {/* Persona Switcher */}
              <Button
                variant="outline"
                onClick={togglePersonaMode}
                className="pointer-events-auto glass-panel hover:shadow-neon-topic transition-all duration-300 text-white border-white/20"
              >
                <span className="mr-2">{currentPersonaMode === 'gamer' ? '🎮' : '🏈'}</span>
                Switch to {currentPersonaMode === 'gamer' ? 'Sports' : 'Gamer'}
              </Button>
            </div>

            {/* Component content padding for header */}
            <div className="pt-20 space-y-8 pb-12">
              <GamifiedCard
                data={currentCardData}
                // Pass error state and override image
                isErrorState={isErrorMode}
                overrideImage={isErrorMode ? currentCardData.quiz.fail_state.image_src : undefined}
              />

              <div className="max-w-4xl mx-auto">
                <QuizSection
                  key={currentPersonaMode} // Reset state on mode switch
                  data={currentCardData}
                  onTriggerErrorMirror={triggerErrorMirror}
                  onComplete={handleLevelComplete}
                />
              </div>
            </div>
          </div>
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
