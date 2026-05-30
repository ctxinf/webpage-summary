# React Rewrite: UI & Appearance Analysis

## 1. Goal
To rewrite the UI components of the original Vue-based `webpage-summary` extension using React, specifically focusing on replicating the exact appearance and layout in a modular way. 

## 2. Legacy UI Overview
The legacy UI consists of the following key visual components:
- **Floating Ball**: A small, draggable circular button on the right edge of the screen that summons the main panel. 
- **Summary Panel**: A draggable, resizable window that displays the AI chat interface.
  - **Header**: Contains status indicator, model/prompt selection display, and window controls (copy, minimize, close).
  - **Main Content**: Displays the chat messages and the current token usage/limits.
  - **Chat Input Box**: An expandable textarea at the bottom for follow-up prompts.

## 3. Implementation in React Worktree
To validate our React architecture, we have implemented samples of these legacy features in the `entrypoints/content/samples/` directory.

### Sample Directory Structure
- `samples/floating-ball/`: React implementation of the draggable floating ball.
- `samples/legacy-panel/`: React implementation that exactly replicates the legacy Vue Summary Panel interface layout and styling, utilizing `lucide-react` for icons and Tailwind for styling.
- `samples/omni-panel/`: An advanced, multi-mode panel (floating and sidebar).

### Feature Flags (Constants)
To adhere to the requirement of unifying sample toggles, these samples are controlled via feature flags defined in `constants/flag.ts`:
- `ENABLE_SAMPLES`
- `ENABLE_CONTENT_SAMPLES`
- `ENABLE_SAMPLE_FLOATING_BALL`
- `ENABLE_SAMPLE_OMNI_PANEL`
- `ENABLE_SAMPLE_LEGACY_PANEL`

These flags allow selective rendering of samples inside `ContentSamplePage.tsx`.

## 4. Next Steps
- Implement full application state management connecting the UI to the AI SDK and background scripts.
- Replace mockup values in the LegacyPanelSample with reactive data from `useWxtStorage`.
- Ensure shadow DOM isolation is fully robust across various websites to prevent CSS bleed.
