# CropSaviour — Base44 Dev Environment

## What this is
A Next.js 16 (App Router) frontend-only app — AI-powered plant disease detection assistant. No database, no separate backend server. All AI calls (plant identification, chatbot) happen client-side via the OpenRouter API.

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- The web service uses `node:22-slim`, bind-mounts the repo, runs `npm install --legacy-peer-deps` then `npx next dev -H 0.0.0.0 -p 3000`.
- Preview is on host port 3000.
- Health check: `curl http://localhost:3000/` — should return the homepage HTML.

## Key details
- **Next.js dev server** binds `0.0.0.0` and `allowedDevOrigins` is configured in `next.config.mjs` to accept the preview origin via `BASE44_PUBLIC_HOST_SUFFIX`.
- **No database or migrations** — pure frontend.
- **OpenRouter API key** (`NEXT_PUBLIC_OPENROUTER_API_KEY`): the app has a hardcoded fallback key so it boots and renders all pages without it. AI features (image-based plant detection, chatbot) need a valid key to work reliably. Provide via the Base44 secrets dashboard.
- **TensorFlow models** live in `public/models/` and run client-side in the browser for some disease detection pages.
- `.npmrc` sets `legacy-peer-deps=true` — required for install to succeed.
- `next.config.mjs` ignores ESLint and TypeScript build errors during dev.

## Project structure
- `app/` — Next.js App Router pages (home, explore, detect/[plant])
- `app/api/tts/` — server route for text-to-speech (Play.ht, currently has placeholder credentials)
- `components/` — React components (UI kit in `components/ui/`)
- `services/` — client-side API service wrappers (OpenRouter, Gemini-named but uses OpenRouter)
- `contexts/` — language context (en/hi translations)
- `hooks/` — React hooks including TensorFlow model loaders
- `public/models/` — TensorFlow.js model files for client-side inference
