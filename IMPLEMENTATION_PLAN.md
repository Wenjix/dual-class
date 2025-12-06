# Dual Class: Implementation To-Do List for Coding Agent

> **Project:** Dual Class Gemini Metaphor Engine  
> **Timeline:** 6 hours (Hackathon MVP)  
> **Stack:** Next.js + TypeScript + Tailwind CSS + shadcn/ui  
> **AI Models:** Gemini 3 Pro (text) + Gemini 3 Pro Image Preview ("Nano Banana Pro")

---

## Phase 1: Project Setup (Hour 1)

### 1.1 Initialize Next.js Project
- [ ] Create new Next.js project with TypeScript: `npx create-next-app@latest dual-class --typescript --tailwind --eslint --app --src-dir=false`
- [ ] Verify the project runs locally with `npm run dev`

### 1.2 Install shadcn/ui
- [ ] Initialize shadcn/ui: `npx shadcn@latest init`
- [ ] Install required components:
  - [ ] Button: `npx shadcn@latest add button`
  - [ ] Input: `npx shadcn@latest add input`
  - [ ] Card: `npx shadcn@latest add card`
  - [ ] Badge: `npx shadcn@latest add badge`

### 1.3 Create File Structure
```
/app
├── page.tsx
├── globals.css
├── /components
│   ├── InputForm.tsx
│   ├── MetaphorCard.tsx
│   └── QuizPanel.tsx
/public
├── /images
│   ├── chef_attention.png
│   └── captain_attention.png
├── /data
│   ├── chef_response.json
│   └── captain_response.json
```
- [ ] Create `/app/components/` directory
- [ ] Create empty component files: `InputForm.tsx`, `MetaphorCard.tsx`, `QuizPanel.tsx`
- [ ] Create `/public/images/` and `/public/data/` directories

### 1.4 Add Custom Animations to globals.css
- [ ] Add `shake` keyframe animation for incorrect answers
- [ ] Add transition utilities for fade/scale effects

### 1.5 Configure Environment Variables
- [ ] Create `.env.local` file (gitignored)
- [ ] Add `GOOGLE_GEMINI_API_KEY=your_api_key_here`
- [ ] Install Google AI SDK: `npm install @google/genai`

---

## Phase 2: Frontend Shell & Static Display (Hour 2)

### 2.1 Build InputForm Component
- [ ] Create two input fields:
  - "Teach me..." (Concept input)
  - "...as a..." (Persona input)
- [ ] Add "Generate" button with loading state
- [ ] Style with Tailwind for clean, centered layout
- [ ] Export `onSubmit` callback with `{ concept, persona }` payload

### 2.2 Build MetaphorCard Component
- [ ] Create split-screen card layout:
  - **Left side:** Text explanation (metaphor_logic + explanation_text)
  - **Right side:** Generated image (imageUrl)
- [ ] Add persona badge/header
- [ ] Add CSS transition classes for fade/scale animation
- [ ] Accept props: `{ persona, concept, explanation_text, imageUrl, isSwitching }`

### 2.3 Build QuizPanel Component
- [ ] Display quiz question text
- [ ] Add text input field for user answer
- [ ] Add submit button (or Enter key handler)
- [ ] Conditional rendering:
  - [ ] Green badge with `animate-pulse` for correct answers
  - [ ] Red border + shake animation for incorrect answers
- [ ] Accept props: `{ question, correctAnswer, onSubmit }`

### 2.4 Assemble Main Page (page.tsx)
- [ ] Import all components
- [ ] Center layout with responsive container
- [ ] Manage application state with `useState`:
  - `concept`, `persona` (inputs)
  - `metaphorData` (API response object)
  - `isLoading`, `isSwitching` (UI states)
  - `quizResult` (null | 'correct' | 'incorrect')

### 2.5 Test with Static Data
- [ ] Hardcode `chef_response.json` data
- [ ] Verify MetaphorCard renders correctly with static image
- [ ] Verify QuizPanel appears and accepts input

---

## Phase 3: Pre-generated Assets (Hour 2-3)

### 3.1 Create Chef Response JSON
- [ ] Create `/public/data/chef_response.json`:
```json
{
  "persona": "Chef",
  "concept": "Transformer Attention Mechanism",
  "metaphor_logic": "In cooking, attention is like how a chef prioritizes ingredients based on what pairs best with the main dish...",
  "explanation_text": "Imagine you're a chef preparing a signature steak dish. The attention mechanism works like your instinct to pair ingredients...",
  "imageUrl": "/images/chef_attention.png",
  "visual_style": "Molecular gastronomy diagram showing ingredient pairing weights",
  "quiz_question": "Look at the image. Which ingredient has the highest attention weight to the steak?",
  "quiz_answer": "Wine Reduction",
  "quiz_explanation": "Just like the attention mechanism assigns the highest weight to the most relevant token, the wine reduction has the strongest pairing connection to the steak."
}
```

### 3.2 Create Captain Response JSON
- [ ] Create `/public/data/captain_response.json`:
```json
{
  "persona": "Starship Captain",
  "concept": "Transformer Attention Mechanism",
  "metaphor_logic": "On a starship bridge, attention is like how the captain focuses on the most critical threat or opportunity from all sensor data...",
  "explanation_text": "Picture yourself as a starship captain on the bridge. Your tactical display shows dozens of ships, asteroids, and signals...",
  "imageUrl": "/images/captain_attention.png",
  "visual_style": "Starship bridge tactical display with attention beams",
  "quiz_question": "Look at the tactical display. Which vessel has the highest attention priority from your ship?",
  "quiz_answer": "Enemy Cruiser",
  "quiz_explanation": "The attention mechanism highlights the most relevant threat, just like how the tactical AI prioritizes the enemy cruiser above all other contacts."
}
```

### 3.3 Generate/Add Images
- [ ] Create or source `/public/images/chef_attention.png` (molecular gastronomy style diagram)
- [ ] Create or source `/public/images/captain_attention.png` (starship tactical display)

> [!IMPORTANT]
> **For Demo Stability:** Use the `generate_image` tool or a pre-made asset. These images are critical for the demo flow.

---

## Phase 4: Gemini API Integration (Hour 3)

### 4.1 Create Gemini Client Utility
- [ ] Create `/app/lib/gemini.ts` for API utilities
- [ ] Initialize `GoogleGenAI` client with API key from environment
- [ ] Create helper functions for text and image generation

### 4.2 Create Metaphor Generation Prompt
- [ ] Create `/app/lib/prompts.ts` with system prompt:
```typescript
export const METAPHOR_SYSTEM_PROMPT = `
You are the Dual Class Metaphor Engine. Given a technical concept and a persona,
create an educational explanation using a metaphor from that persona's domain.

Respond ONLY with valid JSON in this exact format:
{
  "persona": "<the persona>",
  "concept": "<the concept>",
  "metaphor_logic": "<1-2 sentences explaining WHY this metaphor works>",
  "explanation_text": "<3-4 paragraph explanation using the metaphor>",
  "image_prompt": "<detailed prompt for generating a visual diagram>",
  "visual_style": "<description of the visual style>",
  "quiz_question": "<question answerable by looking at the image>",
  "quiz_answer": "<correct answer, 1-3 words>",
  "quiz_explanation": "<why this answer is correct>"
}
`;
```

### 4.3 Create API Route with Gemini Integration
- [ ] Create `/app/api/generate/route.ts`
- [ ] Implement POST handler:
  1. Parse `{ concept, persona }` from request body
  2. **Call Gemini 3 Pro** with metaphor system prompt
  3. Parse the JSON response from Gemini
  4. **Call Gemini 3 Pro Image Preview** with `image_prompt`
  5. Convert image to base64 data URL or save to `/public`
  6. Inject `imageUrl` into response
  7. Return final JSON to client

### 4.4 Gemini 3 Pro Image Generation
```typescript
// Using gemini-3-pro-image-preview
const imageResponse = await ai.models.generateContent({
  model: 'gemini-3-pro-image-preview',
  contents: imagePrompt,
  config: {
    responseModalities: ['image', 'text'],
  }
});
// Extract image from response parts
```
- [ ] Handle image response and convert to displayable format
- [ ] Store generated images in `/public/images/generated/` or use base64

### 4.5 Implement Demo Mode Fallback
```typescript
// Fallback for reliability during demo
const DEMO_PERSONAS = ['chef', 'starship captain', 'captain'];
if (DEMO_PERSONAS.some(p => persona.toLowerCase().includes(p))) {
  // Return pre-cached response for maximum reliability
  return cachedResponse;
}
// Otherwise, call live Gemini API
```
- [ ] Pre-cache Chef and Captain responses
- [ ] Use cached responses as fallback if API fails
- [ ] Add optional `?demo=true` query param to force demo mode

### 4.6 Connect Frontend to API
- [ ] Update `InputForm` to call `/api/generate` on submit
- [ ] Display loading spinner with status text ("Generating explanation...", "Creating visual...")
- [ ] Update `metaphorData` state with response
- [ ] Handle errors gracefully with retry option

---

## Phase 5: Quiz & Feedback Animations (Hour 4)

### 5.1 Quiz State Management
- [ ] Track `userAnswer` input state
- [ ] Track `quizResult` state: `null | 'correct' | 'incorrect'`
- [ ] Reset quiz state when new metaphor is loaded

### 5.2 Answer Validation
- [ ] Implement case-insensitive comparison
- [ ] Allow partial matches (e.g., "wine reduction" matches "Wine Reduction")
- [ ] Consider fuzzy matching for demo robustness

### 5.3 Correct Answer Animation
- [ ] Show green Badge component with "✓ Correct!" text
- [ ] Apply `animate-pulse` class for 600ms
- [ ] Optionally display `quiz_explanation`

### 5.4 Incorrect Answer Animation
- [ ] Add red border to input field
- [ ] Apply `shake` keyframe animation:
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```
- [ ] Reset animation after 500ms to allow retry

---

## Phase 6: Context Switch Animation (Hour 5)

### 6.1 Add Context Switch Button
- [ ] Create "Switch Context" button (placed below MetaphorCard or in header)
- [ ] Disable button during loading/switching states
- [ ] Style as secondary/outline variant

### 6.2 Implement Switch Logic
- [ ] On click, set `isSwitching = true`
- [ ] Apply CSS transition to MetaphorCard: `opacity-0 scale-95`
- [ ] After 200ms timeout:
  - [ ] Swap metaphor data (Chef ↔ Captain)
  - [ ] Reset quiz state
  - [ ] Set `isSwitching = false`
- [ ] Card fades back in with new content

### 6.3 Ensure Fast Transition
- [ ] Total transition time must be < 250ms
- [ ] Use `transition-all duration-200 ease-out` on card

---

## Phase 7: Final Testing & Polish (Hour 6)

### 7.1 End-to-End Testing
- [ ] Run through complete user flow 5-10 times:
  1. Enter "Transformer Attention Mechanism" + "Chef"
  2. Click Generate → See explanation + image
  3. Answer quiz correctly → See green pulse
  4. Answer quiz incorrectly → See shake animation
  5. Click "Switch Context" → See transition to Captain
  6. Answer new quiz question
- [ ] Test on different screen sizes (responsive check)

### 7.2 UI Polish
- [ ] Ensure smooth loading states
- [ ] Check all animations feel snappy (< 250ms)
- [ ] Verify images load without CORS issues
- [ ] Add subtle hover effects on buttons

### 7.3 Demo Backup
- [ ] Record a screen capture of successful demo flow
- [ ] Save as backup in case of live demo issues

---

## Stretch Goals (If Time Permits)

### Optional: Attention Highlight Toggle
- [ ] Add second set of images: `chef_attention_highlight.png`, `captain_attention_highlight.png`
- [ ] Add toggle button to switch between base and highlight images
- [ ] Animate the transition

### Optional: Inline Video Demo
- [ ] Add `/public/videos/space_metaphor_loop.mp4`
- [ ] Create separate section in UI to showcase video
- [ ] Use as "future vision" demo element

### Optional: Advanced Gemini Features
- [ ] Enable Grounding with Google Search for real-time data in explanations
- [ ] Use Gemini's "thinking mode" for complex concepts
- [ ] Support up to 14 reference images for advanced image composition

---

## Quick Reference: Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main container, state management |
| `app/components/InputForm.tsx` | Concept + Persona inputs |
| `app/components/MetaphorCard.tsx` | Split-screen explanation display |
| `app/components/QuizPanel.tsx` | Quiz question + feedback |
| `app/api/generate/route.ts` | API endpoint for metaphor generation |
| `app/lib/gemini.ts` | Gemini API client utilities |
| `app/lib/prompts.ts` | System prompts for Gemini |
| `app/globals.css` | Custom animations (shake, transitions) |
| `public/data/*.json` | Pre-generated responses for demo fallback |
| `.env.local` | API keys (gitignored) |

---

## Verification Plan

### Automated Verification
Since this is a greenfield project with no existing tests, we'll rely on:

1. **Build Check:**
   ```bash
   npm run build
   ```
   - Verifies TypeScript compiles without errors
   - Verifies all imports resolve correctly

2. **Lint Check:**
   ```bash
   npm run lint
   ```
   - Catches common code issues

### Manual Verification

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test the complete demo flow in browser at `http://localhost:3000`:**
   - [ ] Enter "Transformer Attention Mechanism" as concept
   - [ ] Enter "Chef" as persona
   - [ ] Click Generate → Verify card appears with text + image
   - [ ] Verify quiz question appears
   - [ ] Type correct answer → Verify green pulse animation
   - [ ] Type incorrect answer → Verify red shake animation
   - [ ] Click "Switch Context" → Verify smooth transition
   - [ ] Verify new Captain content appears
   - [ ] Verify new quiz question appears

3. **Responsive check:**
   - [ ] Resize browser to mobile width → Verify layout adapts

---

> [!TIP]
> **Demo Strategy:** The API has dual-mode support. For the main demo, use "Chef" or "Starship Captain" which will use cached responses for reliability. For the "wow moment," enter a custom persona to show live Gemini generation!
