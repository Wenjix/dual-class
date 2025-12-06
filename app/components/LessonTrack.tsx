"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface LessonStep {
  step_number: number
  title: string
  metaphor_text: string
  literal_text: string
  image_callout: number
}

interface LessonTrackProps {
  lessonSteps: LessonStep[]
}

// Convert numbers to circled Unicode characters
const getCircledNumber = (num: number): string => {
  const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨']
  return circledNumbers[num - 1] || num.toString()
}

export default function LessonTrack({ lessonSteps }: LessonTrackProps) {
  // Default to first step expanded
  const defaultValue = lessonSteps.length > 0 ? `step-${lessonSteps[0].step_number}` : undefined

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-0.5 w-8 bg-gradient-to-r from-user via-topic to-user rounded-full"></div>
        <h3 className="text-white font-bold text-lg tracking-wide">Learning Path</h3>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-user via-topic to-user rounded-full"></div>
      </div>

      <Accordion type="single" collapsible className="space-y-2" defaultValue={defaultValue}>
        {lessonSteps.map((step) => (
          <AccordionItem
            key={step.step_number}
            value={`step-${step.step_number}`}
            className="glass-panel border border-white/10 rounded-xl px-3 md:px-4 data-[state=open]:bg-white/5"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 md:gap-3 text-left">
                {/* Step Number Badge */}
                <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full
                                bg-topic/20 border-2 border-topic/40
                                flex items-center justify-center
                                shadow-neon-topic">
                  <span className="text-topic text-base md:text-lg font-bold">
                    {getCircledNumber(step.step_number)}
                  </span>
                </div>

                {/* Step Title */}
                <h4 className="text-white font-semibold text-sm md:text-base">
                  {step.title}
                </h4>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-1 pb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-1">
                {/* Left Side: Metaphor (Pink/User) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 bg-gradient-to-r from-user to-transparent rounded-full"></div>
                    <h5 className="text-user/80 text-xs font-bold tracking-widest uppercase">
                      Your World
                    </h5>
                  </div>
                  <p className="text-white/90 text-xs md:text-sm leading-relaxed">
                    {step.metaphor_text}
                  </p>
                </div>

                {/* Right Side: Technical (Cyan/Topic) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 md:justify-end">
                    <h5 className="text-topic/80 text-xs font-bold tracking-widest uppercase md:order-2">
                      Technical Concept
                    </h5>
                    <div className="h-0.5 w-6 bg-gradient-to-l from-topic to-transparent rounded-full md:order-1"></div>
                  </div>
                  <p className="text-white/90 text-xs md:text-sm leading-relaxed md:text-right">
                    {step.literal_text}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="text-white/40 text-xs text-center mt-2 italic">
        Click each step to expand and learn more
      </p>
    </div>
  )
}
