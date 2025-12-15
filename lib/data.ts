export const MOCK_GAMER_DATA = {
    "meta": {
        "user_persona": "League of Legends Support Main",
        "topic": "Transformer Attention Mechanism",
        "theme_color": "neon-green"
    },
    "visual_card": {
        "left_label": "THE TEAM FIGHT",
        "right_label": "THE ATTENTION HEAD",
        "image_prompt": "Split screen. LEFT: A chaotic MOBA game teamfight (League of Legends style) top-down view. A magical green healing beam connects the player character to a teammate. RIGHT: A data visualization of a Neural Network where a green connection line links a 'Query' node to a 'Value' node. CRITICAL: The green beam in the game and the green line in the data viz must look identical.",
        "render_text_elements": [
            { "text": "PRIORITY: HIGH", "location": "on the healing beam" },
            { "text": "WEIGHT: 0.98", "location": "on the neural connection" }
        ]
    },
    "explanation": {
        "hook": "Attention is just Triage.",
        "analogy": "In a team fight, you can't heal everyone. You calculate who needs it most (The Carry) and ignore who doesn't (The Full-HP Tank).",
        "mapping": [
            { "game_term": "The Healer", "tech_term": "The Query (Q)" },
            { "game_term": "Teammates", "tech_term": "The Keys (K)" },
            { "game_term": "Health Bar %", "tech_term": "Attention Score" },
            { "game_term": "The Heal Spell", "tech_term": "The Value Vector (V)" }
        ]
    },
    "quiz": {
        "question": "Your 'Carry' is at 10% HP, but your 'Tank' is at 100% HP. Who do you heal?",
        "options": [
            { "id": "correct", "label": "Heal the Carry (High Weight)", "isCorrect": true },
            { "id": "wrong", "label": "Heal the Tank (Low Weight)", "isCorrect": false }
        ],
        // The "Error Mirror" Image
        "fail_state": {
            "image_prompt": "A League of Legends healer casting a massive green ultimate spell on a Tank character who already has full health. Next to them, a 'Carry' character is greyed out/dead. Text 'MANA WASTED' in red game font.",
            "feedback_title": "Inefficient Compute!",
            "feedback_text": "You just spent all your attention resources on a token that didn't need it. In AI, attending to a low-value token dilutes the context."
        },
        // Keeping old fields for backward compatibility if needed, though mostly replaced by above
        "correct_answer": "Heal the Carry (High Weight)",
        "wrong_answer_visual_prompt": "A Healer wasting their ultimate ability on a target that is already fully healed. Text 'WASTED COMPUTE' floating above."
    }
};

export const MOCK_SPORTS_DATA = {
    "meta": {
        "user_persona": "Pro Quarterback",
        "topic": "Transformer Attention Mechanism",
        "theme_color": "broadcast-blue" // New theme for Sports
    },
    "visual_card": {
        "left_label": "THE FIELD READ",
        "right_label": "THE ATTENTION MASK",
        // Note the "Broadcast" visual style prompt
        "image_prompt": "Split screen. LEFT: A vivid NFL broadcast view from behind the Quarterback. Yellow 'route lines' are drawn on the field. RIGHT: A clean blue/white data dashboard showing a matrix of probabilities. CRITICAL: The yellow route line on the field must match the yellow data connection line on the right.",
        "render_text_elements": [
            { "text": "OPEN: 99%", "location": "above the receiver" },
            { "text": "WEIGHT: 0.99", "location": "on the data node" }
        ]
    },
    "explanation": {
        "hook": "Attention is just Reading Coverage.",
        "analogy": "The QB (Model) ignores the 50,000 screaming fans (Noise) and the covered receivers (Masked Tokens) to focus purely on the open route (High Weight).",
        "mapping": [
            { "game_term": "The QB", "tech_term": "The Model" },
            { "game_term": "Receivers", "tech_term": "Tokens" },
            { "game_term": "Defenders", "tech_term": "Masking" },
            { "game_term": "The Route", "tech_term": "Vector Relationship" }
        ]
    },
    "quiz": {
        "question": "The receiver is in triple coverage (Masked). Do you throw the ball?",
        "options": [
            { "id": "wrong", "label": "Yes, force the throw", "isCorrect": false },
            { "id": "correct", "label": "No, check down (Masking)", "isCorrect": true }
        ],
        // The "Error Mirror" Image
        "fail_state": {
            "image_prompt": "American Football view. A Quarterback throwing the ball directly into a crowd of 3 defenders. The ball is being intercepted. Text 'INTERCEPTION' in big bold broadcast graphics.",
            "feedback_title": "Hallucination Detected!",
            "feedback_text": "You forced a connection where none existed. In AI, attending to masked tokens creates noise and hallucinations."
        },
        "correct_answer": "No, check down (Masking)",
        "wrong_answer_visual_prompt": "A Quarterback throwing an interception directly to a defender. Text 'HALLUCINATION' in bold red TV graphics."
    }
};
