import { extractionResponseSchema } from "@/lib/ai/schemas";
import { buildExtractionPrompt } from "@/lib/ai/prompts";
import { parseCommitmentsFallback } from "@/lib/ai/fallback-parser";
import type { CommitmentDraft, ExtractionContext } from "@/types/commitment";

type ExtractionResult = {
  commitments: CommitmentDraft[];
  mode: "gemma" | "demo";
};

function stripCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
}

function validated(raw: string, sourceText: string): CommitmentDraft[] {
  const parsed = extractionResponseSchema.parse(
    JSON.parse(stripCodeFence(raw)),
  );
  return parsed.commitments.map((item) => ({
    ...item,
    id: item.id ?? crypto.randomUUID(),
    sourceText,
  }));
}

export async function extractCommitments(
  text: string,
  context: ExtractionContext,
): Promise<ExtractionResult> {
  const baseUrl = process.env.AI_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!baseUrl || !apiKey || !model) {
    return {
      commitments: parseCommitmentsFallback(text, context),
      mode: "demo",
    };
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: buildExtractionPrompt(context) },
            { role: "user", content: text },
          ],
        }),
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok)
        throw new Error(`AI provider returned ${response.status}`);
      const body = await response.json();
      const content = body?.choices?.[0]?.message?.content;
      if (typeof content !== "string")
        throw new Error("AI provider returned no content");
      return { commitments: validated(content, text), mode: "gemma" };
    } catch (error) {
      lastError = error;
    }
  }
  console.error("Gemma extraction failed; using demo parser", lastError);
  return { commitments: parseCommitmentsFallback(text, context), mode: "demo" };
}
