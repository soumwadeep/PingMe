import { format, isValid, parseISO } from "date-fns";

export function getLocalExtractionContext() {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return {
    currentDate: format(now, "yyyy-MM-dd"),
    currentTime: format(now, "HH:mm"),
    timezone,
    locale: typeof navigator !== "undefined" ? navigator.language : "en-US",
    dayOfWeek: format(now, "EEEE"),
  };
}

export function formatCommitmentDate(date?: string | null) {
  if (!date) return "No date";
  const parsed = parseISO(date);
  return isValid(parsed) ? format(parsed, "EEE, MMM d") : "No date";
}

export function formatTime(time?: string | null) {
  if (!time) return "Anytime";
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  return format(date, "h:mm a");
}

export function timeOfDay(time?: string | null) {
  if (!time) return "Anytime";
  const hour = Number(time.slice(0, 2));
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}
