"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";
import { ArrowRight, Inbox, Search, Sparkles } from "lucide-react";
import { useCommitments } from "@/lib/hooks/useCommitments";
import type { Commitment } from "@/types/commitment";
import CommitmentCard from "@/components/commitments/CommitmentCard";
import CommitmentEditor from "@/components/commitments/CommitmentEditor";

const filters = [
  "all",
  "task",
  "event",
  "reminder",
  "deadline",
  "completed",
] as const;
type Filter = (typeof filters)[number];

export default function InboxPage() {
  const { items, loading, update, remove } = useCommitments();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Commitment | null>(null);
  const visible = useMemo(
    () =>
      items
        .filter((item) => {
          const matchesFilter =
            filter === "all" ||
            (filter === "completed" ? item.completed : item.type === filter);
          return (
            matchesFilter &&
            `${item.title} ${item.description || ""}`
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        })
        .sort((a, b) => {
          if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
          if (sort === "due")
            return (
              (a.date || "9999").localeCompare(b.date || "9999") ||
              (a.time || "99").localeCompare(b.time || "99")
            );
          if (sort === "priority")
            return (
              { high: 0, medium: 1, low: 2 }[a.priority] -
              { high: 0, medium: 1, low: 2 }[b.priority]
            );
          return b.createdAt.localeCompare(a.createdAt);
        }),
    [items, filter, sort, search],
  );

  return (
    <div className="pageShell shell">
      <header className="pageHeading">
        <div>
          <p className="eyebrow">Everything you’ve captured</p>
          <h1>Inbox</h1>
          <p>
            {items.length} {items.length === 1 ? "commitment" : "commitments"},
            kept in this browser.
          </p>
        </div>
        <Button
          component={Link}
          href="/#brain-dump"
          variant="contained"
          startIcon={<Sparkles size={17} />}
        >
          Add thought
        </Button>
      </header>
      <section className="inboxTools">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your commitments"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            },
          }}
        />
        <div className="filterChips">
          {filters.map((value) => (
            <Chip
              key={value}
              label={
                value[0].toUpperCase() +
                value.slice(1) +
                (value === "all" ? ` ${items.length}` : "")
              }
              clickable
              color={filter === value ? "primary" : "default"}
              variant={filter === value ? "filled" : "outlined"}
              onClick={() => setFilter(value)}
            />
          ))}
        </div>
        <FormControl size="small" className="sortSelect">
          <InputLabel>Sort</InputLabel>
          <Select
            value={sort}
            label="Sort"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="due">Due soon</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
          </Select>
        </FormControl>
      </section>
      {loading ? (
        <div className="loadingStack">
          <Skeleton height={76} variant="rounded" />
          <Skeleton height={76} variant="rounded" />
          <Skeleton height={76} variant="rounded" />
        </div>
      ) : visible.length ? (
        <div className="inboxList">
          {visible.map((item) => (
            <CommitmentCard
              item={item}
              showDate
              key={item.id}
              onToggle={() => update(item.id, { completed: !item.completed })}
              onOpen={() => setSelected(item)}
              onDelete={() => remove(item.id)}
            />
          ))}
        </div>
      ) : (
        <section className="emptyState">
          <div className="emptyIcon">
            <Inbox />
          </div>
          <h2>{items.length ? "No matches." : "Nothing here yet."}</h2>
          <p>
            {items.length
              ? "Try another search or filter."
              : "Tell PingMe something you don’t want to forget."}
          </p>
          {!items.length && (
            <Button
              component={Link}
              href="/#brain-dump"
              variant="contained"
              endIcon={<ArrowRight size={17} />}
            >
              Start a Brain Dump
            </Button>
          )}
        </section>
      )}
      {selected && (
        <CommitmentEditor
          key={selected.id}
          item={selected}
          open
          onClose={() => setSelected(null)}
          onSave={(patch) => update(selected.id, patch)}
          onDelete={() => remove(selected.id)}
        />
      )}
    </div>
  );
}
