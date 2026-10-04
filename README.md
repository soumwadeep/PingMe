# PingMe

**Say it. Forget it. We’ll remember.**

PingMe is a local-first AI commitment assistant built for the Hacktoberfest Weekend 2026 DEV Challenge. Write or say a messy thought; PingMe uses Gemma-compatible open-weight AI to turn it into editable tasks, events, reminders, deadlines, and notes.

> Screenshot placeholders: add final desktop and mobile captures to `docs/images/` before the DEV submission.

## The problem

The things we need to remember usually begin in conversation, not productivity software. Manually opening a todo app, choosing a category, date, time, and reminder creates enough friction that small but important commitments disappear.

PingMe’s core flow is intentionally short:

1. Dump a thought naturally by text or voice.
2. Gemma extracts only explicit or strongly implied commitments.
3. Review and edit the structured result.
4. Approve it into a calm view of the day.

## What works

- Natural-language Brain Dump with Web Speech input where supported
- Provider-independent Gemma extraction through an OpenAI-compatible endpoint
- Zod request and model-output validation, code-fence cleanup, timeout, and one safe retry
- Clearly labelled demo parser when AI credentials are absent or temporarily unavailable
- Editable review before anything is stored
- Local IndexedDB persistence; no account or cloud task database
- My Day timeline with complete, edit, delete, and snooze controls
- Inbox search, type/completion filters, and sorting
- Optional ElevenLabs spoken daily summary
- Explicit browser-notification permission and test controls
- Light, dark, and system appearance modes
- Installable PWA shell with local page caching (AI inference still requires a network)
- Responsive desktop/mobile navigation, onboarding, empty/error/loading states, and reduced-motion support

## Architecture

```text
Browser
  Brain Dump → /api/ai/extract → Gemma-compatible inference endpoint
  Commitments ↔ IndexedDB (never persisted by the server)
  Daily brief → /api/voice/briefing → ElevenLabs (optional)
```

The UI knows only the extraction contract. The server adapter supplies local date, time, weekday, timezone, and locale context to the prompt, requests JSON-only output, and validates every field before it reaches the browser. API routes are stateless and suitable for ephemeral Render instances.

Important files:

- `lib/ai/commitment-extractor.ts` — Gemma-compatible provider adapter, retry, and validation
- `lib/ai/prompts.ts` — extraction-only system prompt
- `lib/ai/fallback-parser.ts` — transparent development/demo fallback
- `lib/db/index.ts` — IndexedDB repository
- `components/brain-dump/BrainDumpComposer.tsx` — primary capture workflow
- `app/day/page.tsx` — daily timeline and briefing
- `app/api/voice/briefing/route.ts` — server-side ElevenLabs proxy

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without AI credentials, PingMe deliberately runs in “Demo parser active” mode so the complete product flow remains demonstrable.

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `AI_PROVIDER` | For AI | Informational provider label; use `openai-compatible` |
| `AI_BASE_URL` | For AI | Inference base URL, without `/chat/completions` |
| `AI_API_KEY` | For AI | Server-only provider credential |
| `AI_MODEL` | For AI | Hosted Gemma model identifier |
| `ELEVENLABS_API_KEY` | For voice | Server-only ElevenLabs credential |
| `ELEVENLABS_VOICE_ID` | For voice | Voice used for daily briefings |
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical production URL for metadata |

Never prefix provider secrets with `NEXT_PUBLIC_`. The app does not expose secret configuration values or secret status details to the client.

## Gemma integration

Configure any OpenAI-compatible service that hosts a Gemma instruction model. The system prompt makes the model an extraction engine—not a chatbot—and asks it to return only structured JSON. Relative dates are resolved against browser-supplied local context, not the server’s UTC date. If the service is missing or fails after one retry, a limited rules parser handles simple demo phrases and is visibly identified as such.

## ElevenLabs integration

When both ElevenLabs variables are present, the My Day page sends its concise briefing to the server route and streams back MP3 audio. When absent, the button is disabled and the rest of PingMe works normally.

## Privacy model

Commitments live in the visitor’s IndexedDB. The server is stateless. Only text submitted with **Sort My Brain** is sent to the configured inference service. A daily summary is sent to ElevenLabs only when the visitor presses **Tell me my day**. The Settings page can erase all local commitment data.

This is local-first, not fully offline AI: cached application pages and saved commitments remain useful offline, but model extraction and ElevenLabs voice need a network.

## Deploy to Render

1. Push the repository to GitHub/GitLab.
2. Create a Render Web Service or use the included `render.yaml` Blueprint.
3. Add the desired server-side environment variables in Render.
4. Set `NEXT_PUBLIC_APP_URL` to the service’s HTTPS URL and redeploy.

The production commands are `npm run build` and `npm start`. No persistent disk is needed because user data stays in the browser.

For a public deployment, add upstream rate limiting to the AI and voice routes. The current hackathon routes validate input, cap requests at 5,000/1,500 characters, and apply provider timeouts, but intentionally carry no shared rate-limit database.

## Demo and submission

Use [docs/demo-script.md](docs/demo-script.md) for the 60–90 second walkthrough and [docs/hackathon.md](docs/hackathon.md) for submission material.

## Built for a Friend

My friend did not need another todo app. Their real problem was that commitments started inside conversations and disappeared before they reached a productivity tool. PingMe listens the way a dependable friend would, then remembers the structured details locally.

Open-weight AI is central rather than decorative: Gemma performs the difficult transformation from ambiguous everyday language into reviewable, typed commitments while allowing teams to choose where the model is hosted.

## Roadmap

- Service-worker notification scheduling with platform-specific background delivery
- Opt-in calendar export and richer recurring commitments
- More locale-aware deterministic date tests
- A small, privacy-preserving server rate limiter for public demos

MIT licensed. Built for Hacktoberfest Weekend 2026.
