"use client";

import { Button, Chip } from "@mui/material";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import CommitmentDraftCard from "./CommitmentDraftCard";
import type { CommitmentDraft } from "@/types/commitment";

export default function ExtractionPreview({
  drafts,
  mode,
  saving,
  onChange,
  onBack,
  onSave,
}: {
  drafts: CommitmentDraft[];
  mode: "gemma" | "demo";
  saving: boolean;
  onChange: (drafts: CommitmentDraft[]) => void;
  onBack: () => void;
  onSave: () => void;
}) {
  return (
    <section className="extractionPanel" aria-live="polite">
      <div className="previewHeading">
        <div>
          <p className="eyebrow">
            <Check size={14} /> Here’s what I found
          </p>
          <h2>Look right?</h2>
          <p>Edit anything before it joins your day.</p>
        </div>
        <Chip
          size="small"
          color={mode === "gemma" ? "primary" : "default"}
          label={mode === "gemma" ? "Gemma AI" : "Demo parser active"}
        />
      </div>
      <div className="draftList">
        {drafts.map((draft, index) => (
          <CommitmentDraftCard
            key={draft.id}
            draft={draft}
            onChange={(updated) =>
              onChange(drafts.map((item, i) => (i === index ? updated : item)))
            }
            onDelete={() => onChange(drafts.filter((_, i) => i !== index))}
          />
        ))}
        {!drafts.length && (
          <div className="inlineEmpty">
            <p>No commitments left in this review.</p>
          </div>
        )}
      </div>
      <div className="previewActions">
        <Button onClick={onBack} startIcon={<ArrowLeft size={17} />}>
          Back to thought
        </Button>
        <Button
          variant="contained"
          disabled={
            !drafts.length || saving || drafts.some((d) => !d.title.trim())
          }
          onClick={onSave}
          startIcon={<ShieldCheck size={17} />}
        >
          {saving ? "Saving safely…" : `Add ${drafts.length} to My Day`}
        </Button>
      </div>
    </section>
  );
}
