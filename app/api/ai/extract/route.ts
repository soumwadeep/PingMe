import { NextResponse } from "next/server";
import { extractRequestSchema } from "@/lib/ai/schemas";
import { extractCommitments } from "@/lib/ai/commitment-extractor";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    configured: Boolean(
      process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL,
    ),
    provider: process.env.AI_PROVIDER || "demo",
  });
}

export async function POST(request: Request) {
  try {
    const payload = extractRequestSchema.parse(await request.json());
    const result = await extractCommitments(payload.text, payload.context);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
