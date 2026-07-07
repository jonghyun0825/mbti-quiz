# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A single-page Korean-language MBTI personality quiz. Pure static HTML/CSS/JS — no build tools, no package manager, no dependencies, no server. The three files (`index.html`, `style.css`, `script.js`) are the entire deployed site.

## Running / testing

There is no build or test command. To try changes, open `index.html` directly in a browser (double-click, or `start index.html` on Windows). Any edit to `script.js`/`style.css`/`index.html` is live on next page reload — nothing to compile.

## Deployment

Deployed via GitHub Pages, but **not** through a local git workflow — this directory is not a git repository. The live site is kept in sync by manually re-uploading the three files through the GitHub web UI (repo page → "Add file" → "Upload files"), which overwrites the same-named files and Pages redeploys automatically. Do not assume `git`/`gh` commands will work here or try to init a repo unless the user asks — the deploy process is upload-based by design.

## Architecture

Everything is driven by a linear state machine over three full-screen "card" views in `index.html`, toggled via the `.hidden` class: `#start-screen` → `#question-screen` → `#result-screen`. All logic lives in `script.js`:

- **`questions`** (array): each entry has an `axis` (`"EI"`, `"SN"`, `"TF"`, or `"JP"`) and two `options`, each carrying the single-letter `value` it contributes to that axis. Adding/editing questions only requires editing this array — the rendering loop (`showQuestion`) is generic over it.
- **State**: `currentQuestionIndex` and `answers` (array of single letters, one per answered question, in order) are the only mutable state. Navigating backward (`backBtn`) decrements the index and `pop()`s the last answer, then re-renders via `showQuestion()` — so back/forward is just index + array manipulation, not a history stack.
- **Scoring** (`calculateType`/`getCounts`): tallies letters from `answers` and picks the majority letter per axis (ties default to the first letter of the pair: E, S, T, J).
- **`typeDescriptions`**: maps each of the 16 four-letter types to a display name/blurb, used both for the main result and for rendering compatibility matches.
- **`compatibilityMap`**: maps each type to 3 "compatible" types, rendered in the result screen's `#compatibilityList`. This is illustrative/for-fun data, not a scientific model — keep entries symmetric-ish and distinct from the type itself when editing.

When adding a question, a result field, or similar, prefer extending these data structures (`questions`, `typeDescriptions`, `compatibilityMap`) over changing the rendering functions, which are written to be generic over them.
