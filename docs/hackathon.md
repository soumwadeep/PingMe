# Hacktoberfest Weekend 2026 — PingMe

## Problem

Small commitments are often spoken casually: “send that tonight,” “call Mom tomorrow,” or “the interview is Monday at two.” Traditional task apps ask people to translate those thoughts into fields at the exact moment they are busiest. The resulting friction makes important details disappear.

## Who I built it for

I built PingMe for a friend who did not need more productivity features. They needed a dependable bridge between natural conversation and a trustworthy daily plan.

## Why another todo app wasn’t enough

Todo apps begin after the user has already organized the thought. PingMe begins before organization. Its primary interface is a blank, forgiving Brain Dump; type or speak naturally, inspect what the assistant understood, and approve it.

## Why open-source AI

Open-weight models make the intelligence inspectable and the hosting choice portable. That matters for a product handling personal thoughts. PingMe is honest about its boundary: commitments are local, while submitted Brain Dump text goes to the configured model host.

## How Gemma is used

Gemma is the primary understanding engine. It receives an extraction-only prompt plus local date, time, day, timezone, and locale context. It identifies explicit or strongly implied commitments, resolves relative dates, classifies type and conservative priority, and returns JSON only. Zod validates the response before it reaches the review UI. The provider layer supports any OpenAI-compatible Gemma host.

## How Render is used

Render hosts the stateless Next.js application and its server routes. AI and ElevenLabs credentials remain server-side. IndexedDB stays in the visitor’s browser, so Render’s ephemeral filesystem is not used for persistence. `render.yaml` captures the build, start, health check, Node version, and environment contract.

## How ElevenLabs is used

ElevenLabs is an optional, genuine extension of the daily-planning experience. PingMe creates a concise summary from today’s commitments and sends it for speech only when the user presses **Tell me my day**. Missing credentials disable the control without affecting the app.

## Architecture

- Next.js App Router and TypeScript for UI and stateless server routes
- MUI theme tokens plus focused CSS for the responsive visual system
- IndexedDB through `idb` for local commitment persistence
- Zod at API and AI-output boundaries
- Gemma-compatible OpenAI chat-completions adapter
- Web Speech API for optional capture
- Browser Notification API behind explicit permission
- ElevenLabs text-to-speech proxy with server-only credentials
- Web App Manifest and service worker for installation and application-shell caching

## Challenges

Natural dates depend on context. “Monday” on a Sunday in Kolkata should not be resolved from a server’s previous UTC date. PingMe has the browser supply its local context and makes the extraction rules explicit. A hackathon demo also cannot become unusable with one provider outage, so the app retries once and then exposes a limited, labelled deterministic parser.

## What I learned

The best AI interface here is not a chatbot. It is a narrow transformation with a strong review step. Local-first storage also changes the product tone: privacy becomes an understandable property the user can see, not a vague promise.

## What’s next

The next step is durable background reminder scheduling across browsers, followed by opt-in calendar export, richer locale/date test coverage, and public-deployment rate limiting. The core will remain focused: natural thought → reviewed AI structure → organized commitment.
