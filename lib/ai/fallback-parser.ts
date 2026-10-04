import { addDays, format, getDay, parseISO } from "date-fns";
import type {
  CommitmentDraft,
  CommitmentType,
  ExtractionContext,
} from "@/types/commitment";

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function resolveDate(text: string, context: ExtractionContext) {
  const base = parseISO(context.currentDate);
  const lower = text.toLowerCase();
  if (/\btomorrow\b/.test(lower)) return format(addDays(base, 1), "yyyy-MM-dd");
  if (/\btoday\b|\btonight\b/.test(lower)) return context.currentDate;
  const weekday = weekdays.findIndex((day) =>
    new RegExp(`\\b${day}\\b`, "i").test(lower),
  );
  if (weekday >= 0) {
    let delta = (weekday - getDay(base) + 7) % 7;
    if (delta === 0) delta = 7;
    return format(addDays(base, delta), "yyyy-MM-dd");
  }
  const iso = lower.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  return iso?.[1] ?? null;
}

function resolveTime(text: string) {
  const lower = text.toLowerCase();
  const match = lower.match(
    /\b(?:at\s*)?(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b|\b(?:at\s*)?([01]?\d|2[0-3]):([0-5]\d)\b/,
  );
  if (match) {
    if (match[4]) return `${match[4].padStart(2, "0")}:${match[5]}`;
    let hour = Number(match[1]);
    if (match[3] === "pm" && hour !== 12) hour += 12;
    if (match[3] === "am" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${match[2] ?? "00"}`;
  }
  const bare = lower.match(/\bat\s*(1[0-2]|0?[1-9])\b/);
  if (bare) {
    let hour = Number(bare[1]);
    if (hour >= 1 && hour <= 7) hour += 12;
    return `${String(hour).padStart(2, "0")}:00`;
  }
  if (/\bmorning\b/.test(lower)) return "09:00";
  if (/\bafternoon\b/.test(lower)) return "14:00";
  if (/\bevening\b/.test(lower)) return "19:00";
  if (/\btonight\b/.test(lower)) return "20:00";
  return null;
}

function cleanTitle(text: string) {
  const withoutTiming = text
    .replace(
      /\b(?:today|tomorrow|tonight|this (?:morning|afternoon|evening)|(?:on |by |before )?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/gi,
      "",
    )
    .replace(/\b(?:at\s*)?(?:1[0-2]|0?[1-9])(?::[0-5]\d)?\s*(?:am|pm)\b/gi, "")
    .replace(/\bat\s*(?:1[0-2]|0?[1-9])\b/gi, "")
    .replace(/\b(?:in the )?(?:morning|afternoon|evening)\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/^[,.;:\s]+|[,.;:\s]+$/g, "")
    .trim();
  return withoutTiming
    .replace(
      /^(and\s+)?(?:please\s+)?(?:remind me(?:\s+to)?|i need to|need to|remember to|don't let me forget to)\s*/i,
      "",
    )
    .replace(/^my\s+/i, "")
    .replace(/\s+is$/i, "")
    .trim();
}

function inferType(text: string): CommitmentType {
  const lower = text.toLowerCase();
  if (/interview|meeting|appointment|call with|event/.test(lower))
    return "event";
  if (/\bby\b|\bbefore\b|deadline|due/.test(lower)) return "deadline";
  if (/remind me/.test(lower)) return "reminder";
  if (/note that|remember that/.test(lower)) return "note";
  return "task";
}

export function parseCommitmentsFallback(
  text: string,
  context: ExtractionContext,
): CommitmentDraft[] {
  const sharedDate = resolveDate(text, context);
  const clauses = text
    .replace(/\.(?=\s+[A-Z])/g, "|")
    .split(/\s*(?:,\s*(?:and\s+)?|\s+and\s+|;|\|)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);

  return clauses.slice(0, 12).map((clause) => ({
    id: crypto.randomUUID(),
    type: inferType(clause),
    title: cleanTitle(clause) || clause.slice(0, 120),
    description: null,
    date: resolveDate(clause, context) ?? sharedDate,
    time: resolveTime(clause),
    endTime: null,
    priority: /\burgent\b|\bimportant\b|\basap\b|interview/i.test(clause)
      ? "high"
      : "medium",
    reminderAt: null,
    sourceText: text,
  }));
}
