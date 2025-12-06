"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface MetaphorCardProps {
  persona: string
  concept: string
  explanation_text: string
  imageUrl: string
  isSwitching: boolean
}

export default function MetaphorCard({
  persona,
  concept,
  explanation_text,
  imageUrl,
  isSwitching,
}: MetaphorCardProps) {
  return (
    <Card
      className={`w-full max-w-6xl mx-auto transition-all duration-200 ease-out ${
        isSwitching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <CardContent className="p-6">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-2">
            {persona}
          </Badge>
          <h2 className="text-2xl font-bold text-foreground">{concept}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Text explanation */}
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-line">
                {explanation_text}
              </p>
            </div>
          </div>

          {/* Right side: Image */}
          <div className="flex items-center justify-center bg-muted rounded-lg p-4">
            <div className="relative w-full aspect-square max-w-md">
              <img
                src={imageUrl}
                alt={`${persona} explanation of ${concept}`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
