"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Alert, Button, Skeleton, Snackbar } from "@mui/material";
import { ArrowRight, CalendarCheck, Flag, Sparkles, Volume2 } from "lucide-react";
import { useCommitments } from "@/lib/hooks/useCommitments";
import { formatTime } from "@/lib/dates";
import CommitmentTimeline from "@/components/commitments/CommitmentTimeline";

export default function DayPage() {
  const { items, loading, error, update, remove } = useCommitments();
  const [voiceReady, setVoiceReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const todaysItems = useMemo(() => items.filter((item) => item.date === today), [items, today]);
  const completed = todaysItems.filter((item) => item.completed).length;
  const important = todaysItems.filter((item) => item.priority === "high" && !item.completed).length;
  const top = todaysItems.find((item) => item.priority === "high" && !item.completed);
  const nextEvent = [...todaysItems].filter((item) => item.type === "event" && item.time && !item.completed).sort((a, b) => a.time!.localeCompare(b.time!))[0];
  const summary = todaysItems.length === 0 ? "Your day is clear." : `You have ${todaysItems.length} ${todaysItems.length === 1 ? "thing" : "things"} today.${top ? ` ${top.title} is your most important commitment.` : ""}${nextEvent ? ` ${nextEvent.title} starts at ${formatTime(nextEvent.time)}.` : ""}`;

  useEffect(() => { fetch("/api/voice/briefing").then((r) => r.json()).then((data) => setVoiceReady(Boolean(data.configured))).catch(() => undefined); }, []);
  const speak = async () => {
    setSpeaking(true);
    try {
      const response = await fetch("/api/voice/briefing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: summary }) });
      if (!response.ok) throw new Error();
      const audio = new Audio(URL.createObjectURL(await response.blob()));
      audio.onended = () => setSpeaking(false);
      await audio.play();
    } catch { setSpeaking(false); setMessage("Voice briefing is unavailable right now."); }
  };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return <div className="pageShell shell">
    <header className="pageHeading"><div><p className="eyebrow">{format(new Date(), "EEEE, MMMM d")}</p><h1>My Day</h1><p>{greeting}, here’s your day.</p></div><Button component={Link} href="/#brain-dump" variant="contained" startIcon={<Sparkles size={17} />}>Brain Dump</Button></header>
    {error && <Alert severity="error">{error}</Alert>}
    {loading ? <div className="loadingStack"><Skeleton height={120} variant="rounded" /><Skeleton height={76} variant="rounded" /><Skeleton height={76} variant="rounded" /></div> : <>
      <section className="dayDashboard">
        <div className="statsRow"><div><CalendarCheck /><strong>{todaysItems.length}</strong><span>things today</span></div><div><span className="statCheck">✓</span><strong>{completed}</strong><span>completed</span></div><div><Flag /><strong>{important}</strong><span>important</span></div></div>
        <div className="dailyBrief"><div><p className="eyebrow"><Sparkles size={14} /> Daily briefing</p><p>{summary}</p></div><Button variant="outlined" startIcon={<Volume2 size={18} />} disabled={!voiceReady || speaking || !todaysItems.length} onClick={speak}>{speaking ? "Speaking…" : "Tell me my day"}</Button></div>
      </section>
      {todaysItems.length ? <CommitmentTimeline items={todaysItems} onUpdate={update} onDelete={remove} /> : <section className="emptyState"><div className="emptyIcon"><CalendarCheck /></div><h2>Your day is clear.</h2><p>Enjoy it—or dump what’s on your mind and let PingMe organize it.</p><Button component={Link} href="/#brain-dump" variant="contained" endIcon={<ArrowRight size={17} />}>Brain Dump</Button></section>}
    </>}
    <Snackbar open={!!message} autoHideDuration={3500} onClose={() => setMessage(null)}><Alert severity="error">{message}</Alert></Snackbar>
  </div>;
}
