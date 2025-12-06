# Product Requirements Document: Dual Class Gemini Metaphor Engine

**Author:** Manus AI
**Version:** 1.1 (Hackathon Streamlined)
**Date:** 2025-12-06

## 1. Overview

### 1.1. Project Goal

To build a web application called "Dual Class" that serves as a Just-In-Time Learning Engine. The application will demonstrate the teaching capabilities of Gemini 3 and the visual power of Nano Banana Pro by translating complex technical concepts into a user's native mental language and creating visual aids for that lesson.

This project is designed for a 6-hour hackathon and must be built as a Minimum Viable Product (MVP) focused on a polished, high-impact demo.

### 1.2. Core Promise

"Dual Class" proves that Gemini can be a **Teacher** by creating derivative explanations tailored to the user, and it uses **Multi-Modality** to create visual aids and evaluations for that lesson. It answers the question: "How can we teach complex topics to anyone, regardless of their background?"

## 2. Core Features (MVP)

The MVP consists of three specific, sequential interactions designed for maximum demo impact.

### 2.1. Feature 1: The Translation (The Hook)

- **Description:** The user inputs a technical concept and a persona. The system generates a split-screen card containing a text explanation based on a metaphor and a corresponding visual diagram.
- **User Story:** As a user, I want to learn about a complex topic, so that I can understand it in the context of a profession I already know.
- **Acceptance Criteria:**
    - The UI must have input fields for "Concept" and "Persona".
    - Clicking "Generate" triggers a call to the Gemini Metaphor Engine.
    - The result is displayed in a split-screen card with the text explanation on the left and the generated image on the right.

### 2.2. Feature 2: The Visual Eval (The Teacher Mechanism)

- **Description:** After the explanation is displayed, a visual quiz question appears. The user must answer the question by examining the generated image, proving they understand the concept's structure.
- **User Story:** As a user, I want to test my understanding of the new concept, so that I can confirm I have learned it correctly.
- **Acceptance Criteria:**
    - A quiz question appears after the explanation card is rendered.
    - The question must be answerable only by inspecting the generated image.
    - The user inputs their answer into a text field.
    - The system provides immediate, simple animated feedback (e.g., a green pulse for correct, a red border/shake for incorrect).

### 2.3. Feature 3: The Context Switch (The Flex)

- **Description:** The user can trigger a "context switch," causing the system to re-explain the *same concept* using a different persona and visual metaphor.
- **User Story:** As a user, if I don't understand the first explanation, I want to see it explained in a different way.
- **Acceptance Criteria:**
    - A "Switch Context" button is available.
    - Clicking the button triggers a fast, simple UI transition (e.g., fade-out/fade-in).
    - The explanation card is re-rendered with a new metaphor, text, and visual.
    - The transition must be fast (<250ms).

## 3. User Flow

1.  **Landing:** User sees a clean interface with two input fields: "Teach me..." (Concept) and "...as a..." (Persona).
2.  **Input:** User enters "Transformer Attention Mechanism" and "Chef".
3.  **Generate:** User clicks the "Generate" button. A loading animation is displayed.
4.  **Translation:** The split-screen card appears. Left side shows the text explanation (Chef metaphor). Right side shows the Nano Banana generated image (molecular gastronomy chart).
5.  **Visual Eval:** A quiz panel appears below the card with the question: "Look at the image. Which ingredient has the highest attention weight to the steak?"
6.  **Answer:** User types "Wine Reduction" into the answer field and hits Enter.
7.  **Feedback:** A green badge with a pulse animation appears.
8.  **Context Switch:** User clicks the "Switch Context" button.
9.  **Transition:** The card fades out, the data swaps, and it fades back in with the new content.
10. **New Context:** The card now shows the "Starship Captain" metaphor, with a new explanation and a new image (starship bridge tactical display).
11. **New Eval:** A new quiz question appears related to the starship image.

## 4. Technical Architecture

### 4.1. Tech Stack

| Component      | Technology          | Justification                                      |
| :------------- | :------------------ | :------------------------------------------------- |
| **Frontend**   | Next.js (React)     | Fast setup, serverless functions for API calls.    |
| **Styling**    | Tailwind CSS        | Rapid UI development and simple animations.        |
| **UI Library** | shadcn/ui           | Pre-built, accessible components for speed.        |
| **State Mgmt** | React `useState`    | Sufficient for the simple state of this MVP.       |

### 4.2. Data Flow & API Calls

```mermaid
graph TD
    A[User Enters Persona/Concept] --> B{Frontend UI};
    B -->|onClick("Generate")| C[API Route: /api/generate];
    C -->|POST Request| D[Gemini API: Metaphor Engine];
    D -->|Returns JSON| C;
    subgraph "API Route Logic"
        C --> E{Parse Gemini JSON};
        E -->|image_prompt| F[Nano Banana Pro API];
        F -->|Returns Image URL| E;
        E -->|Returns Final JSON to Frontend| B;
    end
    B --> G[Display Explanation & Image];
    G --> H[Display Quiz];
    H --> I{User Answers Quiz};
    I --> J[Client-Side Validation];
    J --> K[Show Feedback];
```

### 4.3. API Specifications

- **Endpoint:** Use an OpenAI-compatible endpoint for Gemini 3.
- **System Prompt:** The full system prompt is located in `/home/ubuntu/metaphor_engine_prompt.md`.
- **Output (JSON):** The backend API route is responsible for calling the Nano Banana API and injecting the `imageUrl` into this object before sending it to the client.

```json
{
  "persona": "Chef",
  "concept": "Transformer Attention Mechanism",
  "metaphor_logic": "...",
  "explanation_text": "...",
  "imageUrl": "https://path/to/generated/image.png",
  "visual_style": "...",
  "quiz_question": "...",
  "quiz_answer": "...",
  "quiz_explanation": "..."
}
```

## 5. Frontend Component Breakdown

```
- /app
  - page.tsx (Main container, manages state)
  - /components
    - MetaphorCard.tsx (Main display, animated via CSS)
    - InputForm.tsx (Inputs and Generate button)
    - QuizPanel.tsx (Quiz question, input, and feedback animations)
  - /styles
    - globals.css (for keyframe animations like 'shake')
```

## 6. Asset Requirements

For demo stability, the following assets must be **pre-generated** and cached locally in the `/public` directory.

### 6.1. Core Assets (MVP)

1.  **Chef Image:** `/public/images/chef_attention.png`
2.  **Space Captain Image:** `/public/images/captain_attention.png`
3.  **Chef JSON Response:** `/public/data/chef_response.json`
4.  **Space Captain JSON Response:** `/public/data/captain_response.json`

### 6.2. Optional Assets (Stretch Goals)

1.  **Highlight Images:**
    - `/public/images/chef_attention_highlight.png`
    - `/public/images/captain_attention_highlight.png`
2.  **Looping Video:**
    - `/public/videos/space_metaphor_loop.mp4` (3-5 second clip of attention beams moving)

## 7. Implementation Plan (for Coding Agent)

**Phase 1: Project Setup (Hour 1)**
1.  Initialize a new Next.js project with TypeScript and Tailwind CSS.
2.  Install `shadcn/ui`.
3.  Create the file structure from Section 5 and add a `globals.css` for custom animations.

**Phase 2: Frontend Shell & Static Display (Hour 2)**
1.  Build the static UI components (`InputForm`, `MetaphorCard`, `QuizPanel`).
2.  Style the main layout (`page.tsx`) to center the components.
3.  Load the pre-generated `chef_response.json` and `chef_attention.png` and display them statically to ensure the UI looks correct.

**Phase 3: API & Data Pipeline (Hour 3)**
1.  Create the Next.js API route at `/pages/api/generate.ts`.
2.  **Implement "demo mode"**: If the persona is "Chef" or "Starship Captain", return the pre-generated JSON from the `/public/data` directory. This ensures a fast and reliable demo.
3.  Connect the `InputForm` to this API route.

**Phase 4: Quiz & Feedback Animations (Hour 4)**
1.  Implement the state management for the `QuizPanel`.
2.  Implement client-side answer validation.
3.  **Correct Answer:** Show a green badge and apply the `animate-pulse` Tailwind class for 600ms.
4.  **Incorrect Answer:** Define a `shake` keyframe animation in `globals.css` (`translate-x` back and forth) and apply it on incorrect submission.

**Phase 5: Context Switch Animation (Hour 5)**
1.  Implement the `ContextSwitchButton`.
2.  On click, set an `isSwitching` state to `true`.
3.  Use `setTimeout` for 200ms. Inside the timeout:
    a. Swap the metaphor data (from Chef to Captain).
    b. Set `isSwitching` back to `false`.
4.  Use the `isSwitching` state to apply Tailwind classes to the `MetaphorCard` for a simple fade/scale transition (e.g., `opacity-0 scale-95` when `isSwitching` is true).

**Phase 6: Final Testing & Stretch Goals (Hour 6)**
1.  Run through the entire user flow 5-10 times.
2.  Record a video of the complete, successful demo as a backup.
3.  **If time permits:** Implement the optional enhancements from Section 8.

## 8. Optional Enhancements (Stretch Goals)

- **Attention Highlight Toggle:** Add a button to toggle between the base image and the `_highlight` variant to visually emphasize the attention mechanism.
- **Inline Video:** Add a separate section to the demo pitch where you play the pre-generated `space_metaphor_loop.mp4` to showcase Veo 3.1's potential, explaining it's not part of the core UI but a vision of what's next.
