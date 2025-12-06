"use client"

import { Badge } from "@/components/ui/badge"

interface ErrorState {
  wrong_option_id: string
  misconception_title: string
  wrong_connection_visual: string
  correct_connection_visual: string
  explanation_text: string
  wrong_label: string
  correct_label: string
}

interface ErrorMirrorProps {
  errorState: ErrorState
}

export default function ErrorMirror({ errorState }: ErrorMirrorProps) {
  return (
    <div className="mt-6 animate-slide-in">
      {/* Split-screen container */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-red-500/30">

        {/* Header */}
        <div className="bg-red-500/20 border-b border-red-500/30 px-6 py-4">
          <h4 className="text-red-100 font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🪞</span>
            <span>Error Mirror: {errorState.misconception_title}</span>
          </h4>
        </div>

        {/* Split Screen Grid: 2 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* LEFT: User's Wrong Connection */}
          <div className="relative bg-red-500/5 border-r border-red-500/20 p-6">
            <Badge className="mb-3 bg-red-500/30 text-red-100 border-red-500/50 text-sm px-3 py-1">
              YOUR CHOICE
            </Badge>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-red-500/30">
              <img
                src={errorState.wrong_connection_visual}
                alt="Your wrong connection"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-red-300 font-semibold text-center text-sm">
              {errorState.wrong_label}
            </p>
          </div>

          {/* RIGHT: Correct Connection */}
          <div className="relative bg-green-500/5 p-6">
            <Badge className="mb-3 bg-green-500/30 text-green-100 border-green-500/50 text-sm px-3 py-1">
              CORRECT
            </Badge>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-500/30">
              <img
                src={errorState.correct_connection_visual}
                alt="Correct connection"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-green-300 font-semibold text-center text-sm">
              {errorState.correct_label}
            </p>
          </div>
        </div>

        {/* Explanation Below */}
        <div className="bg-white/5 border-t border-white/10 px-6 py-4">
          <p className="text-white/90 text-base leading-relaxed">
            {errorState.explanation_text}
          </p>
        </div>
      </div>
    </div>
  )
}
