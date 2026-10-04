"use client";

import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { Bell, CalendarClock, CalendarDays, FileText, Trash2 } from "lucide-react";
import type { CommitmentDraft, CommitmentPriority, CommitmentType } from "@/types/commitment";

const icons = { task: CalendarDays, event: CalendarClock, reminder: Bell, deadline: CalendarClock, note: FileText };

export default function CommitmentDraftCard({ draft, onChange, onDelete }: { draft: CommitmentDraft; onChange: (draft: CommitmentDraft) => void; onDelete: () => void }) {
  const Icon = icons[draft.type];
  const update = <K extends keyof CommitmentDraft>(key: K, value: CommitmentDraft[K]) => onChange({ ...draft, [key]: value });
  return <article className="draftCard">
    <div className={`typeIcon ${draft.type}`}><Icon size={19} /></div>
    <div className="draftFields">
      <TextField value={draft.title} onChange={(e) => update("title", e.target.value)} label="Title" size="small" fullWidth slotProps={{ htmlInput: { maxLength: 160 } }} />
      <div className="draftGrid">
        <FormControl size="small"><InputLabel>Type</InputLabel><Select label="Type" value={draft.type} onChange={(e) => update("type", e.target.value as CommitmentType)}>{["task", "event", "reminder", "deadline", "note"].map((type) => <MenuItem key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</MenuItem>)}</Select></FormControl>
        <TextField label="Date" type="date" size="small" value={draft.date ?? ""} onChange={(e) => update("date", e.target.value || null)} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="Time" type="time" size="small" value={draft.time ?? ""} onChange={(e) => update("time", e.target.value || null)} slotProps={{ inputLabel: { shrink: true } }} />
        <FormControl size="small"><InputLabel>Priority</InputLabel><Select label="Priority" value={draft.priority} onChange={(e) => update("priority", e.target.value as CommitmentPriority)}><MenuItem value="low">Low</MenuItem><MenuItem value="medium">Medium</MenuItem><MenuItem value="high">High</MenuItem></Select></FormControl>
      </div>
    </div>
    <Tooltip title="Remove"><IconButton onClick={onDelete} aria-label={`Remove ${draft.title}`}><Trash2 size={18} /></IconButton></Tooltip>
  </article>;
}
