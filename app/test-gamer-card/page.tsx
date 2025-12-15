"use client";

import { useState, useEffect } from 'react';
import { GamifiedCard } from '@/components/GamifiedCard';
import { QuizSection } from '@/components/QuizSection';
import { MOCK_GAMER_DATA, MOCK_SPORTS_DATA } from '@/lib/data';

export default function DualClassDemo() {
    const [mode, setMode] = useState<'gamer' | 'sports'>('gamer');
    const [isGlitching, setIsGlitching] = useState(false);
    const [isErrorMode, setIsErrorMode] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // The Data Source matches the current mode
    const currentData = mode === 'gamer' ? MOCK_GAMER_DATA : MOCK_SPORTS_DATA;

    const handleContextSwitch = () => {
        // 1. Trigger Glitch Animation
        setIsGlitching(true);

        // 2. Wait 300ms (simulate processing), then swap data
        setTimeout(() => {
            setMode(prev => prev === 'gamer' ? 'sports' : 'gamer');
        }, 300);

        // 3. End Glitch after 600ms
        setTimeout(() => {
            setIsGlitching(false);
        }, 600);
    };

    // Reset error mode when switching contexts
    useEffect(() => {
        setIsErrorMode(false);
    }, [mode]);

    const triggerErrorMirror = () => {
        setIsErrorMode(true);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Shake duration
    };

    // Determine which image to show
    const activeImagePrompt = isErrorMode
        ? currentData.quiz.fail_state.image_prompt
        : currentData.visual_card.image_prompt;

    return (
        <main className={`min-h-screen font-sans overflow-hidden relative transition-colors duration-700 flex flex-col items-center justify-center p-8 ${mode === 'gamer' ? 'bg-[#0f1015] selection:bg-[#39ff14] selection:text-black' : 'bg-slate-100 selection:bg-broadcast-yellow selection:text-black'} ${isShaking ? 'animate-shake' : ''}`}>

            {/* Red Flash Overlay */}
            <div className={`absolute inset-0 z-50 bg-red-500 pointer-events-none transition-opacity duration-200 ${isShaking ? 'opacity-30' : 'opacity-0'}`}></div>

            {/* The CRT Glitch Overlay (Only visible when switching) */}
            {isGlitching && (
                <div className="absolute inset-0 z-50 bg-black mix-blend-hard-light animate-pulse pointer-events-none">
                    <div className="w-full h-full opacity-50 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-screen" />
                </div>
            )}

            {/* Your Existing Component, passed with currentData */}
            <div className={`transition-opacity duration-300 w-full ${isGlitching ? 'opacity-0 blur-lg' : 'opacity-100 blur-0'}`}>
                <GamifiedCard
                    data={currentData}
                    overrideImage={isErrorMode ? activeImagePrompt : undefined}
                    isErrorState={isErrorMode}
                />

                {/* Quiz Section */}
                <div className="w-full max-w-4xl mx-auto">
                    <QuizSection
                        data={currentData}
                        onTriggerErrorMirror={triggerErrorMirror}
                    />
                </div>
            </div>

            {/* The Switcher Button (Bottom Right) */}
            <button
                onClick={handleContextSwitch}
                className={`fixed bottom-8 right-8 z-40 group flex items-center gap-3 backdrop-blur-md border px-6 py-3 rounded-full transition-all active:scale-95 shadow-lg ${mode === 'gamer' ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' : 'bg-broadcast-blue text-white border-broadcast-blue hover:bg-blue-700'}`}
            >
                <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">
                    {mode === 'gamer' ? '🏈' : '🎮'}
                </span>
                <span className="font-bold tracking-widest text-sm uppercase">
                    Switch to {mode === 'gamer' ? 'Sports' : 'Gamer'}
                </span>
            </button>

        </main>
    );
}
