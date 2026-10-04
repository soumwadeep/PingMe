"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { BellRing, Check, Clock3, Save, Trash2, X } from "lucide-react";
import type { Commitment, CommitmentPriority, CommitmentType } from "@/types/commitment";

export default function CommitmentEditor({ item, open, onClose, onSave, onDelete }: { item: Commitment | null; open: boolean; onClose: () => void; onSave: (patch: Partial<Commitment>) => Promise<void>; onDelete: () => Promise<void> }) {
  const [draft, setDraft] = useState<Commitment | null>(item);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!draft) return null;
  const update = <K extends keyof Commitment>(key: K, value: Commitment[K]) => setDraft({ ...draft, [key]: value });
  const save = async (patch: Partial<Commitment> = draft) => { setBusy(true); await onSave(patch); setBusy(false); onClose(); };
  const remove = async () => { setBusy(true); await onDelete(); setBusy(false); setConfirmDelete(false); onClose(); };
  return <>
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { className: "editorDrawer" } }}>
      <div className="drawerHeader"><div><p className="eyebrow">{draft.type}</p><h2>Edit commitment</h2></div><IconButton onClick={onClose} aria-label="Close editor"><X /></IconButton></div>
      <div className="drawerBody">
        <TextField label="Title" value={draft.title} onChange={(e) => update("title", e.target.value)} fullWidth slotProps={{ htmlInput: { maxLength: 160 } }} />
        <TextField label="Notes" value={draft.description ?? ""} onChange={(e) => update("description", e.target.value)} fullWidth multiline minRows={3} />
        <div className="editorGrid">
          <FormControl><InputLabel>Type</InputLabel><Select label="Type" value={draft.type} onChange={(e) => update("type", e.target.value as CommitmentType)}>{["task", "event", "reminder", "deadline", "note"].map((type) => <MenuItem value={type} key={type}>{type[0].toUpperCase() + type.slice(1)}</MenuItem>)}</Select></FormControl>
          <FormControl><InputLabel>Priority</InputLabel><Select label="Priority" value={draft.priority} onChange={(e) => update("priority", e.target.value as CommitmentPriority)}>{["low", "medium", "high"].map((priority) => <MenuItem value={priority} key={priority}>{priority[0].toUpperCase() + priority.slice(1)}</MenuItem>)}</Select></FormControl>
          <TextField type="date" label="Date" value={draft.date ?? ""} onChange={(e) => update("date", e.target.value || null)} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField type="time" label="Time" value={draft.time ?? ""} onChange={(e) => update("time", e.target.value || null)} slotProps={{ inputLabel: { shrink: true } }} />
        </div>
        <div className="drawerQuickActions">
          <Button variant="outlined" startIcon={<Check size={17} />} onClick={() => save({ completed: !draft.completed })}>{draft.completed ? "Mark active" : "Complete"}</Button>
          <Button variant="outlined" startIcon={<Clock3 size={17} />} onClick={() => save({ date: format(addDays(new Date(), 1), "yyyy-MM-dd"), completed: false })}>Snooze to tomorrow</Button>
          <Button variant="outlined" color="error" startIcon={<Trash2 size={17} />} onClick={() => setConfirmDelete(true)}>Delete</Button>
        </div>
        {draft.sourceText && <div className="sourceNote"><BellRing size={17} /><div><strong>From your Brain Dump</strong><p>“{draft.sourceText}”</p></div></div>}
      </div>
      <div className="drawerFooter"><Button onClick={onClose}>Cancel</Button><Button variant="contained" startIcon={<Save size={17} />} disabled={busy || !draft.title.trim()} onClick={() => save()}>{busy ? "Saving…" : "Save changes"}</Button></div>
    </Drawer>
    <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}><DialogTitle>Delete this commitment?</DialogTitle><DialogContent>This removes it permanently from this browser.</DialogContent><DialogActions><Button onClick={() => setConfirmDelete(false)}>Keep it</Button><Button color="error" onClick={remove} disabled={busy}>Delete</Button></DialogActions></Dialog>
  </>;
}
