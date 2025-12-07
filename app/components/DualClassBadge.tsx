"use client"

interface DualClassBadgeProps {
  persona: string
  isVisible: boolean
  isAnimating: boolean
}

const getBadgeEmoji = (persona: string): string => {
  const normalized = persona.toLowerCase()
  if (normalized.includes('chef')) return '👨‍🍳'
  if (normalized.includes('captain')) return '🧑‍✈️'
  return '👤' // fallback
}

const getBadgeTitle = (persona: string): string => {
  const normalized = persona.toLowerCase()
  if (normalized.includes('chef')) return 'Chef-Engineer'
  if (normalized.includes('captain')) return 'Captain-Engineer'
  return 'Engineer'
}

export default function DualClassBadge({
  persona,
  isVisible,
  isAnimating,
}: DualClassBadgeProps) {
  const personaEmoji = getBadgeEmoji(persona)
  const badgeTitle = getBadgeTitle(persona)

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 transition-all duration-300
                  ${isAnimating ? 'scale-105' : 'scale-100'}
                  ${isVisible ? 'animate-slide-in' : ''}`}
    >
      <div className="glass-panel px-4 py-2 md:px-6 md:py-3 rounded-2xl
                      border border-user/30 bg-user/20
                      shadow-neon-user/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-xl md:text-2xl emoji-icon">{personaEmoji}</span>
          <span className="text-xl md:text-2xl">⚙️</span>
          <span className="font-bold text-white whitespace-nowrap text-xs md:text-base">
            {badgeTitle} Lvl 1
          </span>
        </div>
        {/* Subtle pulse animation when idle */}
        {!isAnimating && (
          <div className="absolute inset-0 rounded-2xl animate-glow-pulse opacity-30 pointer-events-none" />
        )}
      </div>
    </div>
  )
}
