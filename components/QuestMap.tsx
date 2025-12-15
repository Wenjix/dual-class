"use client"

import React from "react"
import { Curriculum, QuestLevel } from "@/lib/mock-curriculum"
import { cn } from "@/lib/utils"

interface QuestMapProps {
    curriculum: Curriculum
    onLevelSelect: (level: QuestLevel) => void
    currentLevelId?: number
}

export default function QuestMap({ curriculum, onLevelSelect, currentLevelId }: QuestMapProps) {
    return (
        <div className="w-full max-w-4xl mx-auto pt-12 px-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 font-display text-white">{curriculum.source_title}</h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-white/60">
                    <span>AI GENERATED CURRICULUM</span>
                    <span className="w-2 h-2 rounded-full bg-topic animate-pulse" />
                </div>
            </div>

            {/* The Levels Grid */}
            <div className="grid gap-6">
                {curriculum.levels.map((level) => {
                    const isLocked = level.status === "LOCKED"
                    return (
                        <div
                            key={level.id}
                            onClick={() => !isLocked && onLevelSelect(level)}
                            className={cn(
                                "relative group overflow-hidden rounded-2xl border bg-white/5 p-8 transition-all duration-300",
                                isLocked
                                    ? "border-white/5 opacity-50 cursor-not-allowed grayscale"
                                    : "border-white/10 cursor-pointer hover:border-topic/50 hover:bg-white/10 hover:scale-[1.01]"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className={cn(
                                        "text-xs font-bold tracking-widest uppercase",
                                        isLocked ? "text-white/30" : "text-topic"
                                    )}>
                                        {level.status === "UNLOCKED" ? "CURRENT QUEST" : "LOCKED"}
                                    </h3>
                                    <h2 className="text-3xl font-bold text-white">{level.title}</h2>
                                    <p className="text-white/60 text-lg">{level.topic}</p>
                                    {level.description && (
                                        <p className="text-white/40 text-sm mt-2 font-mono max-w-xl">{level.description}</p>
                                    )}
                                </div>

                                {/* Status Icon */}
                                <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
                                    {isLocked ? '🔒' : '⚔️'}
                                </div>
                            </div>

                            {/* Visual Flair: Progress Bar for unlocked levels */}
                            {!isLocked && (
                                <div className="absolute bottom-0 left-0 h-1 bg-topic w-0 group-hover:w-full transition-all duration-700 ease-out" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
