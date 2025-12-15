"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { QuestLevel } from "@/lib/mock-curriculum"

interface QuestCardProps {
    level: QuestLevel
    onClick: (level: QuestLevel) => void
    isSelected?: boolean
}

export default function QuestCard({ level, onClick, isSelected }: QuestCardProps) {
    const isLocked = level.status === "LOCKED"

    return (
        <button
            onClick={() => !isLocked && onClick(level)}
            disabled={isLocked}
            className={cn(
                "relative group flex-shrink-0 w-64 h-80 rounded-xl overflow-hidden transition-all duration-300 text-left border-2",
                isSelected ? "scale-105 ring-4 ring-topic ring-offset-4 ring-offset-black" : "hover:scale-105",
                isLocked
                    ? "border-white/10 opacity-60 cursor-not-allowed grayscale"
                    : "border-topic/50 hover:border-topic cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]"
            )}
        >
            {/* Background Image / Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
            <div className={cn("absolute inset-0 bg-slate-800", isLocked ? "bg-slate-900" : "")}>
                {/* We would put the actual image here, but for now we'll use a gradient/color block if no image */}
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
                    {level.id === 1 ? "🧙‍♂️" : level.id === 2 ? "⚔️" : "🌫️"}
                </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <div className="space-y-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded border",
                            isLocked ? "bg-white/10 border-white/10 text-white/50" : "bg-topic/20 border-topic text-topic"
                        )}>
                            {isLocked ? "LOCKED" : "AVAILABLE"}
                        </span>
                        <span className="text-xs font-mono text-white/50">LVL {level.id}</span>
                    </div>
                    <h3 className={cn("text-lg font-bold leading-tight", isLocked ? "text-white/50" : "text-white")}>
                        {level.title}
                    </h3>
                    <p className="text-sm text-white/60 line-clamp-2">
                        {level.topic}
                    </p>
                </div>
            </div>

            {/* Lock Icon Overlay */}
            {isLocked && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center">
                        🔒
                    </div>
                </div>
            )}
        </button>
    )
}
