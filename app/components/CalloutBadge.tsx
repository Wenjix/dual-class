"use client"

interface CalloutBadgeProps {
  number: number
  position: string
  label?: string
  visible?: boolean
}

// Map position strings to Tailwind classes for 9-grid positioning
const positionClasses: Record<string, string> = {
  'top-left': 'absolute top-4 left-4',
  'top-center': 'absolute top-4 left-1/2 -translate-x-1/2',
  'top-right': 'absolute top-4 right-4',
  'center-left': 'absolute top-1/2 left-4 -translate-y-1/2',
  'center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-right': 'absolute top-1/2 right-4 -translate-y-1/2',
  'bottom-left': 'absolute bottom-4 left-4',
  'bottom-center': 'absolute bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'absolute bottom-4 right-4',
}

// Convert numbers to circled Unicode characters
const getCircledNumber = (num: number): string => {
  const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨']
  return circledNumbers[num - 1] || num.toString()
}

export default function CalloutBadge({ number, position, label, visible = true }: CalloutBadgeProps) {
  if (!visible) return null

  const positionClass = positionClasses[position] || positionClasses['center']

  return (
    <div
      className={`${positionClass} z-20 pointer-events-none
                  transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      aria-label={label || `Callout ${number}`}
    >
      <div className="glass-panel flex items-center justify-center
                      w-10 h-10 md:w-12 md:h-12 rounded-full
                      border-2 border-topic/40 bg-topic/20 backdrop-blur-md
                      shadow-neon-topic">
        <span className="text-topic text-xl md:text-2xl font-bold">
          {getCircledNumber(number)}
        </span>
      </div>
      {label && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap
                        glass-panel px-2 py-1 text-xs text-white/80 rounded">
          {label}
        </div>
      )}
    </div>
  )
}
