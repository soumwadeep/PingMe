import { z } from "zod";
import { format, isValid, parseISO } from "date-fns";

export const commitmentTypeSchema = z.enum(["task", "event", "reminder", "deadline", "note"]);
export const commitmentPrioritySchema = z.enum(["low", "medium", "high"]);
const nullableDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = parseISO(value);
  return isValid(parsed) && format(parsed, "yyyy-MM-dd") === value;
}, "Invalid calendar date").nullable().optional();
const nullableTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional();

export const commitmentDraftSchema = z.object({
  id: z.string().min(1).optional(),
  type: commitmentTypeSchema,
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(800).nullable().optional(),
  date: nullableDate,
  time: nullableTime,
  endTime: nullableTime,
  priority: commitmentPrioritySchema.default("medium"),
  reminderAt: z.string().datetime({ offset: true }).nullable().optional(),
  sourceText: z.string().max(5000).nullable().optional(),
});

export const extractionResponseSchema = z.object({
  commitments: z.array(commitmentDraftSchema).max(20),
});

export const extractRequestSchema = z.object({
  text: z.string().trim().min(1).max(5000),
  context: z.object({
    currentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    currentTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    timezone: z.string().min(1).max(100),
    locale: z.string().min(2).max(30),
    dayOfWeek: z.string().min(3).max(12),
  }),
});

export const commitmentSchema = commitmentDraftSchema.extend({
  id: z.string().min(1),
  completed: z.boolean(),
  aiGenerated: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
