export interface ErrorMirrorContext {
  persona: string
  concept: string
  metaphor_logic: string
  quiz_question: string
  quiz_answer: string
  quiz_options: Array<{
    id: string
    text: string
    is_correct: boolean
  }>
}

export function buildErrorMirrorPrompt(context: ErrorMirrorContext): string {
  const wrongOptions = context.quiz_options.filter(o => !o.is_correct)
  
  return `You are the Dual Class Error Analysis Engine. Given a quiz context about a technical concept explained through a metaphor, generate detailed error states that help learners understand WHY their wrong answers reveal misconceptions.

CONTEXT:
- Persona: ${context.persona}
- Concept: ${context.concept}  
- Metaphor Logic: ${context.metaphor_logic}
- Quiz Question: ${context.quiz_question}
- Correct Answer: ${context.quiz_answer}
- Wrong Options: ${wrongOptions.map(o => `${o.id.toUpperCase()}) ${o.text}`).join(', ')}

Respond ONLY with valid JSON in this exact format:
{
  "error_states": [
    {
      "wrong_option_id": "<id of wrong option, e.g., 'a'>",
      "misconception_title": "<short title describing the type of error, e.g., 'Sweetness Bias'>",
      "explanation_text": "<2-3 sentences explaining WHY this choice reveals a misconception. Use the metaphor to explain the error. Reference the correct answer.>",
      "wrong_label": "<short label like 'YOUR CHOICE: KETCHUP → STEAK'>",
      "correct_label": "<short label like 'CORRECT: WINE → STEAK (80%)'>"
    }
  ],
  "fallback_error": {
    "wrong_option_id": "fallback",
    "misconception_title": "Common Misconception",
    "explanation_text": "<generic explanation for any wrong answer>",
    "wrong_label": "INCORRECT CHOICE",
    "correct_label": "<correct label with the right answer>"
  },
  "image_prompts": {
    "correct_connection": "<detailed image prompt for generating a visual showing the CORRECT connection. Must be in the ${context.persona.toLowerCase()} metaphor style. Show the strongest/most important relationship highlighted with bright glow. Use warm pink (#F55DA8) and cool cyan (#1DE3D4) dual lighting.>",
    "wrong_connections": [
      {
        "option_id": "<wrong option id>",
        "prompt": "<detailed image prompt showing THIS specific wrong connection. The wrong element should be highlighted but shown as disconnected or weakly connected. Use the same dual lighting style.>"
      }
    ]
  },
  "why_text": "<Write 3-4 sentences following this structure:

SENTENCE 1 - Visual Cue: Start with 'Notice...' or 'Look at...' and describe the KEY VISUAL ELEMENT (e.g., 'Notice the 80% label glowing on the wine reduction pan'). Anchor to what they SEE.

SENTENCE 2 - Metaphor: Explain WHY this element has highest weight in ${context.persona.toLowerCase()} domain (e.g., 'Wine reduction complements steak because its acidity cuts through fat and depth enhances char').

SENTENCE 3 - Bridge to Concept: Explicitly connect to ${context.concept} (e.g., 'Attention weights work exactly like this: the transformer assigns highest weight (80%) to most relevant token').

SENTENCE 4 - Reinforce: Add final sentence reinforcing the parallel (e.g., 'Just as the chef focuses effort on primary pairing, attention mechanism focuses resources on tokens that matter most').

CRITICAL: Reference specific visual elements (labels, glows, positions). Use concrete ${context.persona.toLowerCase()} details. Make metaphor-to-concept bridge EXPLICIT.>",
  "why_image_prompt": "<CRITICAL: Generate a ${context.persona.toLowerCase()}-specific visual showing the CORRECT ANSWER element.

For CHEF persona + WINE REDUCTION answer:
- Close-up of professional kitchen scene focused on the wine reduction pan
- Wine reduction pan with VISIBLE BRIGHT GLOW and clear '80%' label/badge
- Show thick connection arrow or bright aura to indicate highest weight
- Steak faintly visible in background (what wine reduction pairs with)
- Cinematic dual lighting: warm pink (#F55DA8) from left, cool cyan (#1DE3D4) from right
- Style: Photorealistic culinary photography, molecular gastronomy aesthetic
- Dark background (#0f1015 to #1a1b23) for contrast
- Communicate visually: 'This is the PRIMARY pairing with highest attention'

For OTHER personas: Apply same logic using their metaphor domain (starship bridge for captain, etc.)

DO NOT generate: brain diagrams, abstract concepts, or generic visuals>"
}

IMPORTANT REQUIREMENTS:
1. Generate an error_state for EACH wrong option (${wrongOptions.length} total)
2. Each misconception_title should be unique and descriptive (e.g., "Distance vs Relevance", "Minor vs Major Pairing")
3. Explanations should use the ${context.persona.toLowerCase()} metaphor to explain the error
4. Image prompts must be detailed and specify:
   - The ${context.persona.toLowerCase()} visual style
   - Specific elements to show
   - Dual lighting (pink left, cyan right)
   - What to highlight or emphasize
5. The correct_connection image should show the RIGHT answer glowing/highlighted
6. Wrong_connection images should show the mistaken element with visual indication of error`
}

export function buildMetaphorPrompt(concept: string, persona: string, lessonStepMode: "fixed" | "dynamic" = "dynamic"): string {
  const lessonStepInstruction = lessonStepMode === "fixed"
    ? "exactly 3 lesson steps"
    : "3-5 lesson steps based on the complexity of the concept";

  return `You are the Dual Class Metaphor Engine. Given a technical concept and a persona, create an educational explanation using a metaphor from that persona's domain.

Concept: ${concept}
Persona: ${persona}

Respond ONLY with valid JSON in this exact format:
{
  "persona": "<the persona>",
  "concept": "<the concept>",
  "metaphor_logic": "<1-2 sentences explaining WHY this metaphor works>",
  "explanation_text": "<3-4 paragraph explanation using the metaphor>",
  "image_prompt": "<detailed prompt for generating a visual diagram in the style of this persona, MUST include numbered elements like ① ② ③ that correspond to the lesson steps>",
  "visual_style": "<description of the visual style>",
  "quiz_question": "<question answerable by looking at the image>",
  "quiz_answer": "<correct answer, 1-3 words>",
  "quiz_explanation": "<why this answer connects the metaphor to the concept>",
  "lesson_steps": [
    {
      "step_number": 1,
      "title": "<short step title, e.g., 'Attention Weights'>",
      "metaphor_text": "<2-3 sentences explaining this step using the ${persona.toLowerCase()} metaphor>",
      "literal_text": "<2-3 sentences explaining the actual technical concept>",
      "image_callout": 1
    }
  ],
  "mapping_pairs": [
    {
      "concept_term": "<technical term, e.g., 'Token'>",
      "metaphor_term": "<${persona.toLowerCase()} equivalent, e.g., 'Ingredient'>",
      "note": "<optional: brief explanation of the mapping>"
    }
  ],
  "visual_callouts": [
    {
      "id": 1,
      "position": "<one of: 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'>",
      "label": "<what this callout points to, e.g., 'Tokens/Ingredients'>"
    }
  ],
  "quiz_options": [
    {
      "id": "a",
      "text": "<first option>",
      "is_correct": false
    },
    {
      "id": "b",
      "text": "<second option>",
      "is_correct": true
    },
    {
      "id": "c",
      "text": "<third option>",
      "is_correct": false
    },
    {
      "id": "d",
      "text": "<fourth option>",
      "is_correct": false
    }
  ]
}

IMPORTANT REQUIREMENTS:
1. Generate ${lessonStepInstruction}, each with step_number (1, 2, 3, etc.)
2. Generate 4-6 mapping pairs that clearly show the concept↔metaphor relationship
3. Generate exactly 3 visual callouts with different positions on a 9-grid
4. Generate exactly 4 quiz options with only ONE marked as is_correct: true
5. Ensure the image_prompt explicitly requests numbered badges (①②③) at specific locations
6. Make the quiz question reference visual elements in the image

Example for Chef explaining Transformer Attention:
- Lesson steps: "Ingredient Relationships", "Attention Weights", "Multi-Head Processing"
- Mapping pairs: Token→Ingredient, Attention Weight→Pairing Strength, Layer→Cooking Pass
- Visual callouts: ① at "top-left" (Ingredients), ② at "center" (Attention Weights), ③ at "bottom-right" (Final Dish)
- Quiz: "In the image, which ingredient has the highest attention weight to the steak?" with options including "Wine Reduction" (correct)`
}
