export const commitmentTypes = [
  "task",
  "event",
  "reminder",
  "deadline",
  "note",
] as const;
export const commitmentPriorities = ["low", "medium", "high"] as const;

export type CommitmentType = (typeof commitmentTypes)[number];
export type CommitmentPriority = (typeof commitmentPriorities)[number];

export interface CommitmentDraft {
  id: string;
  type: CommitmentType;
  title: string;
  description?: string | null;
  date?: string | null;
  time?: string | null;
  endTime?: string | null;
  priority: CommitmentPriority;
  reminderAt?: string | null;
  sourceText?: string | null;
}

export interface Commitment extends CommitmentDraft {
  completed: boolean;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractionContext {
  currentDate: string;
  currentTime: string;
  timezone: string;
  locale: string;
  dayOfWeek: string;
}
