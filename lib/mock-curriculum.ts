export interface QuestLevel {
    id: number;
    title: string;
    topic: string;
    thumbnail: string;
    status: "LOCKED" | "UNLOCKED" | "COMPLETED";
    description: string;
}

export interface Curriculum {
    source_title: string;
    persona: string;
    levels: QuestLevel[];
}

export const MOCK_CURRICULUM: Curriculum = {
    source_title: "Stanford CS224n: Chapter 8",
    persona: "Gamer",
    levels: [
        {
            id: 1,
            title: "Level 1: The Healer's Dilemma",
            topic: "Self-Attention (Q, K, V)",
            thumbnail: "/assets/gamer_hero_thumb.png", // Keep for backward compat if needed, though mostly unused in new design
            status: "UNLOCKED",
            description: "Learn how tokens value each other using support mechanics."
        },
        {
            id: 2,
            title: "Level 2: The Raid Coordination",
            topic: "Multi-Head Attention",
            thumbnail: "/assets/gamer_raid_thumb.png",
            status: "LOCKED",
            description: "Parallelize your attention channels to track multiple threats at once."
        },
        {
            id: 3,
            title: "Level 3: The Fog of War",
            topic: "Masked Attention (Decoder)",
            thumbnail: "/assets/gamer_fog_thumb.png",
            status: "LOCKED",
            description: "Prevent future token leakage using vision masking techniques."
        }
    ]
};
