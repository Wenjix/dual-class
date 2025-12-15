"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuizSectionProps {
    data: any; // Using any for loose typing as per project style, can refine later
    onTriggerErrorMirror: () => void;
}

export function QuizSection({ data, onTriggerErrorMirror }: QuizSectionProps) {
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const isGamer = data.meta.theme_color === 'neon-green';

    // Theme configuration based on mode
    const theme = isGamer ? {
        cardBg: "bg-white/5 border-white/10",
        headingColor: "text-white",
        text: "text-white/90",
        buttonIdle: "bg-white/10 hover:bg-white/20 text-white",
        buttonDisabled: "opacity-50 text-white/50",
        feedbackText: "text-white/80"
    } : {
        cardBg: "bg-white border-broadcast-blue/20 shadow-lg",
        headingColor: "text-broadcast-blue",
        text: "text-slate-700",
        buttonIdle: "bg-broadcast-blue/10 hover:bg-broadcast-blue/20 text-broadcast-blue",
        buttonDisabled: "opacity-50 text-slate-400",
        feedbackText: "text-slate-600"
    };

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setStatus('correct');
            // Optional: Play a "Level Up" sound or green flash
        } else {
            setStatus('wrong');
            // CRITICAL: This triggers the image swap in the parent
            onTriggerErrorMirror();
        }
    };

    return (
        <div className={cn("mt-8 p-6 rounded-2xl backdrop-blur-sm transition-colors duration-500", theme.cardBg)}>
            <h3 className={cn("text-xl font-bold mb-4 flex items-center gap-2", theme.headingColor)}>
                <span className="text-2xl">🎓</span>
                PROVE YOUR KNOWLEDGE
            </h3>

            <p className={cn("text-lg mb-6", theme.text)}>{data.quiz.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.quiz.options.map((option: any) => (
                    <button
                        key={option.id}
                        onClick={() => handleAnswer(option.isCorrect)}
                        disabled={status !== 'idle'}
                        className={cn(
                            "p-4 rounded-xl font-bold text-left transition-all duration-300",
                            status === 'idle' && theme.buttonIdle,
                            status === 'idle' && "hover:scale-[1.02]",
                            status === 'correct' && option.isCorrect && "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.6)]",
                            status === 'wrong' && !option.isCorrect && "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]",
                            status !== 'idle' && !option.isCorrect && status !== 'wrong' && theme.buttonDisabled
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* The Error Mirror Feedback Text */}
            {status === 'wrong' && (
                <div className="mt-6 animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="border-l-4 border-red-500 pl-4 py-2">
                        <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-1">
                            {data.quiz.fail_state.feedback_title}
                        </h4>
                        <p className={cn("leading-relaxed", theme.feedbackText)}>
                            {data.quiz.fail_state.feedback_text}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
