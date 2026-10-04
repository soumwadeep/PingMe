"use client";

import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { timeOfDay } from "@/lib/dates";
import type { Commitment } from "@/types/commitment";
import CommitmentCard from "./CommitmentCard";
import CommitmentEditor from "./CommitmentEditor";

const sections = ["Morning", "Afternoon", "Evening", "Anytime"];

export default function CommitmentTimeline({ items, onUpdate, onDelete }: { items: Commitment[]; onUpdate: (id: string, patch: Partial<Commitment>) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [selected, setSelected] = useState<Commitment | null>(null);
  const [toast, setToast] = useState(false);
  return <>
    <div className="timeline">{sections.map((section) => {
      const matches = items.filter((item) => timeOfDay(item.time) === section).sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
      if (!matches.length) return null;
      return <section className="timelineSection" key={section}><div className="timelineLabel"><span />{section}</div><div className="timelineItems">{matches.map((item) => <CommitmentCard key={item.id} item={item} onToggle={async () => { await onUpdate(item.id, { completed: !item.completed }); if (!item.completed) setToast(true); }} onOpen={() => setSelected(item)} />)}</div></section>;
    })}</div>
    {selected && <CommitmentEditor key={selected.id} item={selected} open onClose={() => setSelected(null)} onSave={(patch) => onUpdate(selected.id, patch)} onDelete={() => onDelete(selected.id)} />}
    <Snackbar open={toast} autoHideDuration={2500} onClose={() => setToast(false)}><Alert severity="success">Nice. One less thing to remember.</Alert></Snackbar>
  </>;
}
