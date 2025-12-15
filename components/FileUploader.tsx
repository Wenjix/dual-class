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
        <div className="w-full max-w-xl mx-auto">
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center",
                    dragActive
                        ? "border-topic bg-topic/10 scale-105"
                        : "border-white/20 hover:border-white/40 bg-black/20",
                    isProcessing ? "animate-pulse border-topic cursor-wait" : "cursor-pointer"
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
                    <div className="space-y-4">
                        <div className="text-4xl animate-bounce">🧠</div>
                        <div className="text-xl font-bold text-white">Gemini is reading...</div>
                        <p className="text-white/60 text-sm">Analyzing logical structures and identifying key metaphors</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-4xl text-white/80 group-hover:scale-110 transition-transform">📄</div>
                        <div>
                            <p className="text-lg font-bold text-white">Upload Textbook Chapter</p>
                            <p className="text-sm text-white/60 mt-1">Drag & drop or click to select PDF</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
