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

            {/* Visual Card (Split Screen Placeholder) */}
            <div className={cn("relative w-full aspect-video border mb-8 rounded overflow-hidden flex", theme.bg, theme.subtleBorder)}>
                {/* Full visual override for error state or single image prompt */}
                {overrideImage ? (
                    <div className={cn("w-full h-full flex items-center justify-center p-8 text-center relative overflow-hidden group", theme.leftOverlayClass)}>
                        <div className="absolute inset-0 bg-black/20 z-0"></div>
                        <p className={cn("relative z-10 text-lg font-bold max-w-2xl px-8 py-4 border bg-black/50 backdrop-blur-sm shadow-xl rounded", theme.text, theme.border)}>
                            [FAIL STATE IMG: {overrideImage}]
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Left: Game World */}
                        <div className={cn("w-1/2 relative border-r p-4 flex flex-col justify-between group transition-colors", theme.subtleBorder)}>
                            <div className={cn("absolute inset-0 transition-all", theme.leftOverlayClass)}></div>
                            <span className={cn("relative z-10 px-2 py-1 text-xs w-fit border font-bold", theme.bg, theme.border, theme.text)}>{data.visual_card.left_label}</span>

                            {/* Visual Placeholder for Image Prompt */}
                            <div className="flex-1 flex items-center justify-center text-center p-4">
                                <p className="text-xs opacity-60 max-w-[80%]">
                                    [IMG: {data.visual_card.image_prompt.split(".")[1] || "Game World Visualization"}]
                                </p>
                            </div>
                        </div>

                        {/* Right: Tech World */}
                        <div className={cn("w-1/2 relative p-4 flex flex-col justify-between group transition-colors")}>
                            <div className={cn("absolute inset-0 transition-all", theme.rightOverlayClass)}></div>
                            <span className={cn("relative z-10 px-2 py-1 text-xs w-fit border self-end font-bold", theme.bg, theme.border, theme.text)}>{data.visual_card.right_label}</span>

                            {/* Visual Placeholder for Image Prompt */}
                            <div className="flex-1 flex items-center justify-center text-center p-4">
                                <p className="text-xs opacity-60 max-w-[80%]">
                                    [IMG: Data Visualization]
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Render Text Elements Overlay (Only if not in error state) */}
                {!isErrorState && !overrideImage && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {/* Simulation of the text overlays */}
                        {data.visual_card.render_text_elements.map((el: any, i: number) => (
                            <div key={i} className={cn("absolute text-xs border px-1 animate-pulse font-bold bg-black", isGamer ? "text-[#39ff14] border-[#39ff14]" : "text-broadcast-yellow border-broadcast-yellow")} style={{ top: `${40 + (i * 10)}%`, left: i % 2 === 0 ? '20%' : '70%' }}>
                                {el.text}
                            </div>
                        ))}
                        <div className={cn("w-full h-[2px] absolute top-1/2 opacity-50 dashed-line", isGamer ? "bg-[#39ff14]" : "bg-broadcast-yellow")}></div>
                    </div>
                )}
            </div>

            {/* Explanation & Mapping */}
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
