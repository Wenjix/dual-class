"use client";

import { cn } from "@/lib/utils";


interface DualClassHUDProps {
    gamerXp: number;   // 0-100
    athleteXp: number; // 0-100
    className?: string;
}

export function DualClassHUD({ gamerXp, athleteXp, className }: DualClassHUDProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-top-5 duration-700 delay-300", className)}>

            {/* Gamer-Engineer Class */}
            <div className="relative overflow-hidden rounded-xl border border-neon-green/30 bg-black/40 p-4 group hover:bg-neon-green/5 transition-colors">
                <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-xl">
                            ⚔️
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-widest text-neon-green font-bold">Class</div>
                            <div className="text-white font-bold">Gamer-Engineer</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-white/40 font-mono">Lvl 1</div>
                        <div className="text-neon-green font-mono">{gamerXp}/100 XP</div>
                    </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)] transition-all duration-1000 ease-out relative"
                        style={{ width: `${gamerXp}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full -translate-x-full animate-shimmer" />
                    </div>
                </div>

                {/* BG Decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-6xl">🎮</span>
                </div>
            </div>

            {/* Athlete-Engineer Class */}
            <div className="relative overflow-hidden rounded-xl border border-broadcast-blue/30 bg-black/40 p-4 group hover:bg-broadcast-blue/5 transition-colors">
                <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-broadcast-blue/10 border border-broadcast-blue/30 flex items-center justify-center text-xl">
                            🏈
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-widest text-broadcast-blue font-bold">Class</div>
                            <div className="text-white font-bold">Athlete-Engineer</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-white/40 font-mono">Lvl 1</div>
                        <div className="text-broadcast-blue font-mono">{athleteXp}/100 XP</div>
                    </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-broadcast-blue shadow-[0_0_10px_rgba(0,87,184,0.5)] transition-all duration-1000 ease-out relative"
                        style={{ width: `${athleteXp}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full -translate-x-full animate-shimmer" />
                    </div>
                </div>

                {/* BG Decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-6xl">🏆</span>
                </div>
            </div>

        </div>
    );
}
