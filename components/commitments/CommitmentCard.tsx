"use client";

import { useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Bell,
  CalendarClock,
  CalendarDays,
  FileText,
  Flag,
  Pencil,
  Timer,
  Trash2,
} from "lucide-react";
import { formatCommitmentDate, formatTime } from "@/lib/dates";
import type { Commitment } from "@/types/commitment";

const icons = {
  task: CalendarDays,
  event: CalendarClock,
  reminder: Bell,
  deadline: Timer,
  note: FileText,
};

export default function CommitmentCard({
  item,
  showDate = false,
  onToggle,
  onOpen,
  onDelete,
}: {
  item: Commitment;
  showDate?: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onDelete: () => Promise<void>;
}) {
  const Icon = icons[item.type];
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const remove = async () => {
    setDeleting(true);
    try {
      await onDelete();
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <article
        className={`commitmentCard ${item.completed ? "completed" : ""} priority-${item.priority}`}
      >
        <Checkbox
          checked={item.completed}
          onChange={onToggle}
          slotProps={{
            input: {
              "aria-label": `Mark ${item.title} ${item.completed ? "incomplete" : "complete"}`,
            },
          }}
          className="completeCheck"
        />
        <button
          className="commitmentMain"
          onClick={onOpen}
          aria-label={`Edit ${item.title}`}
        >
          <span className={`typeIcon ${item.type}`}>
            <Icon size={18} />
          </span>
          <span className="commitmentText">
            <strong>{item.title}</strong>
            <span>
              {showDate && `${formatCommitmentDate(item.date)} · `}
              {formatTime(item.time)} <i>·</i> {item.type}
            </span>
          </span>
          {item.priority === "high" && (
            <Chip
              size="small"
              icon={<Flag size={13} />}
              label="Important"
              className="priorityChip"
            />
          )}
        </button>
        <div
          className="commitmentActions"
          aria-label={`Actions for ${item.title}`}
        >
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={onOpen}
              aria-label={`Edit ${item.title}`}
            >
              <Pencil size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => setConfirmDelete(true)}
              aria-label={`Delete ${item.title}`}
            >
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </div>
      </article>
      <Dialog
        open={confirmDelete}
        onClose={() => !deleting && setConfirmDelete(false)}
        aria-labelledby={`delete-${item.id}-title`}
      >
        <DialogTitle id={`delete-${item.id}-title`}>
          Delete “{item.title}”?
        </DialogTitle>
        <DialogContent>
          This task will be permanently removed from this browser.
        </DialogContent>
        <DialogActions>
          <Button disabled={deleting} onClick={() => setConfirmDelete(false)}>
            Keep it
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleting}
            onClick={remove}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
