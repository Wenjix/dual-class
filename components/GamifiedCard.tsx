"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GamifiedCardProps {
    data: any;
    overrideImage?: string;
    isErrorState?: boolean;
}

export function GamifiedCard({ data, overrideImage, isErrorState }: GamifiedCardProps) {
    const isGamer = data.meta.theme_color === 'neon-green';

    // Theme configuration
    const theme = isGamer ? {
        text: isErrorState ? 'text-red-500' : 'text-[#39ff14]',
        border: isErrorState ? 'border-red-500' : 'border-[#39ff14]',
        bg: 'bg-black',
        shadow: isErrorState ? 'shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(57,255,20,0.3)]',
        accentBg: isErrorState ? 'bg-red-500' : 'bg-[#39ff14]',
        accentText: 'text-black',
        subtleBorder: isErrorState ? 'border-red-500/30' : 'border-[#39ff14]/30',
        hoverBg: isErrorState ? 'hover:bg-red-500/10' : 'hover:bg-[#39ff14]/10',
        leftOverlayClass: isErrorState ? 'bg-red-900/10' : 'bg-green-900/10 group-hover:bg-green-900/20',
        rightOverlayClass: isErrorState ? 'bg-red-900/10' : 'bg-blue-900/10 group-hover:bg-blue-900/20',
        selection: 'selection:bg-[#39ff14] selection:text-black'
    } : {
        text: isErrorState ? 'text-red-600' : 'text-broadcast-blue',
        border: isErrorState ? 'border-red-600' : 'border-broadcast-blue',
        bg: 'bg-white',
        shadow: isErrorState ? 'shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'shadow-[0_0_20px_rgba(0,87,184,0.3)]',
        accentBg: isErrorState ? 'bg-red-500' : 'bg-broadcast-yellow',
        accentText: 'text-black',
        subtleBorder: isErrorState ? 'border-red-500/30' : 'border-broadcast-blue/30',
        hoverBg: isErrorState ? 'hover:bg-red-500/10' : 'hover:bg-broadcast-blue/10',
        leftOverlayClass: isErrorState ? 'bg-red-500/10' : 'bg-yellow-500/10 group-hover:bg-yellow-500/20',
        rightOverlayClass: isErrorState ? 'bg-red-500/10' : 'bg-blue-500/10 group-hover:bg-blue-500/20',
        selection: 'selection:bg-broadcast-yellow selection:text-black'
    };

    return (
        <div className={cn(
            "w-full max-w-4xl mx-auto p-6 font-mono border rounded-lg transition-all duration-500",
            theme.bg, theme.text, theme.border, theme.shadow
        )}>
            {/* Header */}
            <div className={cn("mb-8 border-b pb-4", theme.border)}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-80">USER_PERSONA: {data.meta.user_persona}</span>
                    <span className="text-sm opacity-80">TOPIC: {data.meta.topic}</span>
                </div>
                <h1 className="text-3xl font-bold uppercase tracking-widest flex items-center gap-2">
                    Dual Class // <span className={cn(isGamer ? "text-white" : "text-black")}>{data.explanation.hook}</span>
                </h1>
            </div>

            {/* Visual Card Section */}
            <div className={cn(
                "relative w-full aspect-video border mb-8 rounded overflow-hidden",
                theme.bg,
                theme.subtleBorder,
                isErrorState && "border-red-500 animate-pulse"
            )}>
                {/* Content: Image or Split Fallback */}
                {data.visual_card.image_src || overrideImage ? (
                    <div className="absolute inset-0 w-full h-full">
                        <img
                            src={overrideImage || data.visual_card.image_src}
                            alt="Visual Metaphor"
                            className="w-full h-full object-cover"
                        />
                        {/* Fail State Overlay Effect */}
                        {overrideImage && (
                            <div className="absolute inset-0 bg-red-900/10 z-10 pointer-events-none" />
                        )}
                        {/* Labels Overlay (Top Corners) - Hide if Override/Fail */}
                        {!overrideImage && (
                            <>
                                <div className="absolute top-2 left-2 z-20 text-xs font-bold bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/20 text-white/90 shadow-lg">
                                    {data.visual_card.left_label}
                                </div>
                                <div className="absolute top-2 right-2 z-20 text-xs font-bold bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/20 text-white/90 shadow-lg">
                                    {data.visual_card.right_label}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    /* Fallback: CSS Split Screen */
                    <div className="absolute inset-0 flex w-full h-full">
                        {/* Left: Game World */}
                        <div className={cn("w-1/2 h-full border-r-2 relative bg-black", theme.border)}>
                            <div className="absolute top-2 left-2 text-xs font-bold bg-black/50 px-2 py-1 rounded border border-white/20 text-white/70">
                                {data.visual_card.left_label}
                            </div>
                            <div className="flex items-center justify-center h-full text-center p-4">
                                <span className="text-sm opacity-50 font-mono text-white">[IMG: {data.visual_card.left_label}]</span>
                            </div>
                        </div>

                        {/* Right: Tech World */}
                        <div className="w-1/2 h-full relative bg-slate-900">
                            <div className="absolute top-2 right-2 text-xs font-bold bg-black/50 px-2 py-1 rounded border border-white/20 text-white/70">
                                {data.visual_card.right_label}
                            </div>
                            <div className="flex items-center justify-center h-full text-center p-4">
                                <span className="text-sm opacity-50 font-mono text-white">[IMG: {data.visual_card.right_label}]</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shared Overlays (Text Elements) - Render on top of image or split divs */}
                {/* Hide overlays in Fail State (Override) */}
                {!overrideImage && data.visual_card.render_text_elements?.map((el: any, idx: number) => (
                    <div
                        key={idx}
                        className={cn(
                            "absolute z-10 px-2 py-1 font-bold text-xs tracking-wider border bg-black/80 backdrop-blur-sm shadow-xl",
                            theme.border,
                            theme.text
                        )}
                        style={{
                            top: idx === 0 ? '40%' : '60%',
                            left: idx === 0 ? '25%' : '75%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {el.text}
                    </div>
                ))}
            </div>

            {/* Explanation & Mapping Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className={cn("text-xl font-bold mb-4 border-b pb-2", theme.subtleBorder)}>Mission Briefing</h2>
                    <p className={cn("text-lg leading-relaxed", isGamer ? "text-white/90" : "text-black/80")}>
                        {data.explanation.analogy}
                    </p>
                </div>

                <div>
                    <h2 className={cn("text-xl font-bold mb-4 border-b pb-2", theme.subtleBorder)}>Translation Matrix</h2>
                    <div className="w-full text-sm">
                        <div className="grid grid-cols-2 gap-4 mb-2 opacity-60">
                            <div className="uppercase">Game Term</div>
                            <div className="uppercase">Tech Term</div>
                        </div>
                        <div className="space-y-2">
                            {data.explanation.mapping.map((item: any, idx: number) => (
                                <div key={idx} className={cn("grid grid-cols-2 gap-4 p-2 border rounded transition-colors", theme.subtleBorder, theme.hoverBg)}>
                                    <div className={cn("font-bold", isGamer ? "text-white" : "text-black")}>{item.game_term}</div>
                                    <div className={cn("font-mono", theme.text)}>{item.tech_term}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
