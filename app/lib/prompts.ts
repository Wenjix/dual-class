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
