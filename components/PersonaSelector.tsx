"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PersonaSelectorProps {
    onSelectionComplete: (personas: string[], target: string) => void;
}

// Combined Archetypes (Personas)
const ARCHETYPE_OPTIONS = [
    { id: 'lol', label: 'League of Legends', category: 'Game', icon: '⚔️', color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/50', image: '/assets/gamer_hero.png' },
    { id: 'nfl', label: 'Pro Football', category: 'Sport', icon: '🏈', color: 'text-broadcast-blue', bg: 'bg-broadcast-blue/10', border: 'border-broadcast-blue/50', image: '/assets/sports_hero.png' },
    { id: 'mc', label: 'Minecraft', category: 'Game', icon: '⛏️', color: 'text-white', bg: 'bg-white/5', border: 'border-white/10', disabled: true },
    { id: 'nba', label: 'Basketball', category: 'Sport', icon: '🏀', color: 'text-white', bg: 'bg-white/5', border: 'border-white/10', disabled: true },
];

const MISSION_OPTIONS = [
    { id: 'cs', label: 'Computer Science', sub: 'Attention Mechanism', icon: '🧠', color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/50' },
    { id: 'phys', label: 'Physics', sub: 'Quantum Mechanics', icon: '⚛️', color: 'text-white', bg: 'bg-white/5', border: 'border-white/10', disabled: true },
    { id: 'hist', label: 'History', sub: 'The Roman Empire', icon: '🏛️', color: 'text-white', bg: 'bg-white/5', border: 'border-white/10', disabled: true },
];

export function PersonaSelector({ onSelectionComplete }: PersonaSelectorProps) {
    const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
    const [isFusing, setIsFusing] = useState(false);

    const togglePersona = (id: string) => {
        setSelectedPersonas(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const handleConfirm = () => {
        if (selectedPersonas.length === 0 || !selectedTarget) return;

        setIsFusing(true);

        // Simulate Fusion Animation Duration
        // 1. Zoom in / flash
        // 2. Show "Dual Class Initialized"
        // 3. Callback
        setTimeout(() => {
            onSelectionComplete(selectedPersonas, selectedTarget);
        }, 3000);
    };

    if (isFusing) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Fusion Core Animation */}
                <div className="relative w-64 h-64">
                    <div className="absolute inset-0 rounded-full border-4 border-t-neon-green border-r-transparent border-b-broadcast-blue border-l-transparent animate-spin duration-1000"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-r-neon-green border-b-transparent border-l-broadcast-blue border-t-transparent animate-spin duration-[1.5s] reverse"></div>

                    {/* Icons fusing */}
                    <div className="absolute inset-0 flex items-center justify-center gap-4 animate-in zoom-in spin-in-12 duration-1000">
                        {selectedPersonas.includes('lol') && <span className="text-4xl">⚔️</span>}
                        {selectedPersonas.includes('nfl') && <span className="text-4xl">🏈</span>}
                        <span className="text-2xl opacity-50">+</span>
                        <span className="text-4xl">🧠</span>
                    </div>
                </div>

                <div className="mt-12 text-center space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h2 className="text-3xl font-bold text-white tracking-[0.5em] animate-pulse">GENERATING</h2>
                    <p className="text-white/50 font-mono text-sm">LOADING DUAL CLASS PROTOCOLS...</p>
                </div>

                {/* Background Particles (Simulated) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-green/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-broadcast-blue/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-12 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 font-display">
                    TURN HOBBIES INTO A <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-broadcast-blue">CHEAT CODE</span>
                </h1>
                <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                    Why start from scratch? We translate complex subjects like <strong>Computer Science</strong> into the languages you already speak—from <strong>League of Legends</strong> mechanics to <strong>NFL</strong> playbooks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative px-4">
                {/* VS Badge in Center */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black border border-white/10 items-center justify-center z-10 text-white/20 font-bold text-xl">
                    +
                </div>

                {/* Left Column: Archetypes (Multi-Select) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-white mb-4 px-2">
                        <span className="text-2xl">🎭</span>
                        <div>
                            <h3 className="text-sm font-bold tracking-widest uppercase">Select Archetypes</h3>
                            <p className="text-xs text-white/40">Pick any combination</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {ARCHETYPE_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                disabled={opt.disabled}
                                onClick={() => togglePersona(opt.id)}
                                className={cn(
                                    "relative w-full text-left p-6 rounded-2xl border transition-all duration-300 group overflow-hidden",
                                    opt.disabled ? "opacity-30 cursor-not-allowed border-white/5 bg-white/5" : "cursor-pointer hover:bg-white/5",
                                    selectedPersonas.includes(opt.id)
                                        ? cn("bg-black/80", opt.border, "shadow-lg scale-[1.02]")
                                        : "border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-black/50 border border-white/10", opt.disabled && "grayscale")}>
                                            {opt.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("font-bold text-lg", opt.disabled ? "text-white/40" : "text-white")}>{opt.label}</div>
                                                {/* Category Chip */}
                                                {!opt.disabled && (
                                                    <span className={cn("text-[0.6rem] px-2 py-0.5 rounded-full border bg-black/50 uppercase tracking-wider",
                                                        opt.category === 'Game' ? "text-neon-green border-neon-green/30" : "text-broadcast-blue border-broadcast-blue/30"
                                                    )}>
                                                        {opt.category}
                                                    </span>
                                                )}
                                            </div>
                                            {opt.disabled && <div className="text-xs text-white/20">Coming Soon</div>}
                                        </div>
                                    </div>

                                    {selectedPersonas.includes(opt.id) && (
                                        <div className={cn("w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse",
                                            opt.category === 'Game' ? "bg-neon-green" : "bg-broadcast-blue"
                                        )} />
                                    )}
                                </div>

                                {/* Hover Glow */}
                                {!opt.disabled && (
                                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                        opt.category === 'Game' ? "bg-neon-green/5" : "bg-broadcast-blue/5"
                                    )} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Mission (Single Select) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-white mb-4 px-2 justify-end md:justify-start">
                        <span className="text-2xl">🎯</span>
                        <div>
                            <h3 className="text-sm font-bold tracking-widest uppercase">Select Mission</h3>
                            <p className="text-xs text-white/40">Target Subject</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {MISSION_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                disabled={opt.disabled}
                                onClick={() => setSelectedTarget(opt.id)}
                                className={cn(
                                    "relative w-full text-left p-6 rounded-2xl border transition-all duration-300 group overflow-hidden",
                                    opt.disabled ? "opacity-30 cursor-not-allowed border-white/5 bg-white/5" : "cursor-pointer hover:bg-white/5",
                                    selectedTarget === opt.id
                                        ? cn("bg-black/80", opt.border, "shadow-[0_0_30px_rgba(236,72,153,0.2)] scale-[1.02]")
                                        : "border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-black/50 border border-white/10", opt.disabled && "grayscale")}>
                                            {opt.icon}
                                        </div>
                                        <div>
                                            <div className={cn("font-bold text-lg", opt.disabled ? "text-white/40" : "text-white")}>{opt.label}</div>
                                            <div className="text-sm text-white/50">{opt.sub}</div>
                                        </div>
                                    </div>

                                    {selectedTarget === opt.id && (
                                        <div className="w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse" />
                                    )}
                                </div>

                                {/* Hover Glow */}
                                {!opt.disabled && (
                                    <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="mt-16 text-center">
                <Button
                    onClick={handleConfirm}
                    disabled={selectedPersonas.length === 0 || !selectedTarget}
                    className={cn(
                        "h-16 px-12 rounded-full text-lg font-bold tracking-widest transition-all duration-500",
                        selectedPersonas.length > 0 && selectedTarget
                            ? "bg-white text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            : "bg-white/5 text-white/20"
                    )}
                >
                    {selectedPersonas.length > 0 && selectedTarget ? "INITIALIZE SYSTEM" : "SELECT CLASSES"}
                </Button>
            </div>
        </div>
    );
}
