"use client"

import React, { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
    onFileSelect: (file: File) => void
    isProcessing?: boolean
}

export default function FileUploader({ onFileSelect, isProcessing = false }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0])
        }
    }, [onFileSelect])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0])
        }
    }, [onFileSelect])

    return (
        <div className="w-full max-w-xl mx-auto animate-in fade-in zoom-in duration-500">
            <div
                className={cn(
                    "relative border border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center backdrop-blur-sm",
                    dragActive
                        ? "border-neon-green bg-neon-green/5 scale-105 shadow-[0_0_30px_rgba(57,255,20,0.1)]"
                        : "border-white/10 hover:border-white/30 bg-black/40 hover:bg-white/5",
                    isProcessing ? "animate-pulse border-neon-green cursor-wait" : "cursor-pointer"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={handleChange}
                    disabled={isProcessing}
                    accept=".pdf"
                />

                {isProcessing ? (
                    <div className="space-y-6">
                        <div className="text-6xl animate-bounce">🧠</div>
                        <div>
                            <div className="text-2xl font-bold text-white tracking-widest font-display mb-2">READING NEURAL PATTERNS</div>
                            <p className="text-neon-green font-mono text-sm">Analyzing logical structures...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 group">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl text-white/80 group-hover:scale-110 group-hover:bg-neon-green/10 group-hover:border-neon-green/50 group-hover:text-neon-green transition-all duration-500 shadow-glass mx-auto">
                            📄
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-white tracking-wide">UPLOAD MISSION DATA</p>
                            <p className="text-sm text-white/40 font-mono group-hover:text-white/60 transition-colors">
                                Drag & drop PDF or click to initialize
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
