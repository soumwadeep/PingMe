"use client";

import { Checkbox, Chip } from "@mui/material";
import { Bell, CalendarClock, CalendarDays, FileText, Flag, Timer } from "lucide-react";
import { formatCommitmentDate, formatTime } from "@/lib/dates";
import type { Commitment } from "@/types/commitment";

const icons = { task: CalendarDays, event: CalendarClock, reminder: Bell, deadline: Timer, note: FileText };

export default function CommitmentCard({ item, showDate = false, onToggle, onOpen }: { item: Commitment; showDate?: boolean; onToggle: () => void; onOpen: () => void }) {
  const Icon = icons[item.type];
  return <article className={`commitmentCard ${item.completed ? "completed" : ""} priority-${item.priority}`}>
    <Checkbox checked={item.completed} onChange={onToggle} slotProps={{ input: { "aria-label": `Mark ${item.title} ${item.completed ? "incomplete" : "complete"}` } }} className="completeCheck" />
    <button className="commitmentMain" onClick={onOpen} aria-label={`Open ${item.title}`}>
      <span className={`typeIcon ${item.type}`}><Icon size={18} /></span>
      <span className="commitmentText"><strong>{item.title}</strong><span>{showDate && `${formatCommitmentDate(item.date)} · `}{formatTime(item.time)} <i>·</i> {item.type}</span></span>
      {item.priority === "high" && <Chip size="small" icon={<Flag size={13} />} label="Important" className="priorityChip" />}
    </button>
  </article>;
}
