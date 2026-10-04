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
  const [cloudVoiceReady, setCloudVoiceReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const todaysItems = useMemo(() => items.filter((item) => item.date === today), [items, today]);
  const completed = todaysItems.filter((item) => item.completed).length;
  const important = todaysItems.filter((item) => item.priority === "high" && !item.completed).length;
  const top = todaysItems.find((item) => item.priority === "high" && !item.completed);
  const nextEvent = [...todaysItems].filter((item) => item.type === "event" && item.time && !item.completed).sort((a, b) => a.time!.localeCompare(b.time!))[0];
  const summary = todaysItems.length === 0 ? "Your day is clear." : `You have ${todaysItems.length} ${todaysItems.length === 1 ? "thing" : "things"} today.${top ? ` ${top.title} is your most important commitment.` : ""}${nextEvent ? ` ${nextEvent.title} starts at ${formatTime(nextEvent.time)}.` : ""}`;

  useEffect(() => {
    const deviceVoiceReady = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    const readinessTimer = window.setTimeout(() => setVoiceReady(deviceVoiceReady), 0);
    fetch("/api/voice/briefing").then((r) => r.json()).then((data) => {
      const configured = Boolean(data.configured);
      setCloudVoiceReady(configured);
      setVoiceReady(configured || deviceVoiceReady);
    }).catch(() => setVoiceReady(deviceVoiceReady));
    return () => { window.clearTimeout(readinessTimer); window.speechSynthesis?.cancel(); };
  }, []);

  const speakWithDevice = () => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) throw new Error("Device speech is unavailable");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = navigator.language || "en-US";
    utterance.rate = 0.96;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setMessage("Voice briefing is unavailable right now."); };
    window.speechSynthesis.speak(utterance);
  };

  const speak = async () => {
    setSpeaking(true);
    try {
      if (!cloudVoiceReady) { speakWithDevice(); return; }
      const response = await fetch("/api/voice/briefing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: summary }) });
      if (!response.ok) throw new Error();
      const audioUrl = URL.createObjectURL(await response.blob());
      const audio = new Audio(audioUrl);
      audio.onended = () => { URL.revokeObjectURL(audioUrl); setSpeaking(false); };
      audio.onerror = () => { URL.revokeObjectURL(audioUrl); try { speakWithDevice(); } catch { setSpeaking(false); setMessage("Voice briefing is unavailable right now."); } };
      await audio.play();
    } catch {
      try { speakWithDevice(); }
      catch { setSpeaking(false); setMessage("Voice briefing is unavailable right now."); }
    }
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
