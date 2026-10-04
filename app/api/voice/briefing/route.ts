import { z } from "zod";
import { NextResponse } from "next/server";

const requestSchema = z.object({ text: z.string().trim().min(1).max(1500) });

export async function GET() {
  return NextResponse.json({
    configured: Boolean(
      process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID,
    ),
  });
}

export async function POST(request: Request) {
  try {
    const { text } = requestSchema.parse(await request.json());
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey || !voiceId)
      return NextResponse.json(
        { error: "Voice briefing is not configured." },
        { status: 503 },
      );
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.55, similarity_boost: 0.75 },
        }),
        signal: AbortSignal.timeout(30000),
      },
    );
    if (!response.ok)
      return NextResponse.json(
        { error: "Voice service is temporarily unavailable." },
        { status: 502 },
      );
    return new Response(response.body, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
