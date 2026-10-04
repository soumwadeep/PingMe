"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Snackbar } from "@mui/material";
import { LoaderCircle, Mic, MicOff, Sparkles } from "lucide-react";
import { getLocalExtractionContext } from "@/lib/dates";
import { saveCommitments } from "@/lib/db";
import type { Commitment, CommitmentDraft } from "@/types/commitment";
import ExtractionPreview from "./ExtractionPreview";

const examples = [
  "Remind me tomorrow at 10 AM to call Mom.",
  "I need to submit the application before Friday.",
  "My interview is Monday at 2 PM. Remind me Sunday evening to prepare.",
];

export default function BrainDumpComposer() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [drafts, setDrafts] = useState<CommitmentDraft[] | null>(null);
  const [mode, setMode] = useState<"gemma" | "demo">("demo");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success" | "info"; text: string } | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  const extract = async () => {
    if (!text.trim() || loading) return;
    setLoading(true); setMessage(null);
    try {
      const response = await fetch("/api/ai/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, context: getLocalExtractionContext() }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Extraction failed");
      setDrafts(body.commitments); setMode(body.mode);
    } catch {
      setMessage({ type: "error", text: "PingMe couldn’t sort that right now. Your thought hasn’t been lost—try again in a moment." });
    } finally { setLoading(false); }
  };

  const save = async () => {
    if (!drafts?.length) return;
    setSaving(true);
    const now = new Date().toISOString();
    const commitments: Commitment[] = drafts.map((draft) => ({ ...draft, id: draft.id || crypto.randomUUID(), completed: false, aiGenerated: mode === "gemma", createdAt: now, updatedAt: now }));
    try {
      await saveCommitments(commitments);
      setMessage({ type: "success", text: "Added safely. That’s less for you to remember." });
      setText(""); setDrafts(null);
      window.dispatchEvent(new Event("pingme:commitments-changed"));
      setTimeout(() => router.push("/day"), 650);
    } catch {
      setMessage({ type: "error", text: "Your browser couldn’t save these yet. Your original thought is still here." });
    } finally { setSaving(false); }
  };

  const toggleSpeech = () => {
    if (recording) { recognition.current?.stop(); return; }
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) { setMessage({ type: "info", text: "Voice input isn’t supported in this browser yet." }); return; }
    const instance = new SpeechRecognitionClass();
    instance.continuous = true; instance.interimResults = true; instance.lang = navigator.language;
    const base = text.trim();
    instance.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) transcript += event.results[i][0].transcript;
      setText(`${base}${base ? " " : ""}${transcript}`.slice(0, 5000));
    };
    instance.onerror = () => setMessage({ type: "error", text: "I couldn’t hear that clearly. You can keep typing instead." });
    instance.onend = () => setRecording(false);
    recognition.current = instance; instance.start(); setRecording(true);
  };

  if (drafts) return <><ExtractionPreview drafts={drafts} mode={mode} saving={saving} onChange={setDrafts} onBack={() => setDrafts(null)} onSave={save} /><Snackbar open={!!message} autoHideDuration={4500} onClose={() => setMessage(null)}><Alert severity={message?.type}>{message?.text}</Alert></Snackbar></>;

  return <>
    <section className={`composer ${loading ? "processing" : ""}`} aria-busy={loading}>
      <label htmlFor="brain-dump-input" className="srOnly">What’s on your mind?</label>
      <textarea id="brain-dump-input" value={text} maxLength={5000} onChange={(event) => setText(event.target.value)} placeholder="Tomorrow remind me to send my resume at 10, buy medicine in the evening, and my interview is Monday at 2…" />
      {loading && <div className="processingOverlay"><div className="brainPulse"><Sparkles size={23} /></div><strong>Reading between the lines…</strong><span>Finding what matters and organizing your thoughts</span></div>}
      <div className="composerFooter">
        <Button onClick={toggleSpeech} color={recording ? "error" : "inherit"} className={recording ? "recording" : ""} startIcon={recording ? <MicOff size={18} /> : <Mic size={18} />}>{recording ? "Listening…" : "Speak"}</Button>
        <span className="charCount">{text.length > 4500 ? `${text.length}/5000` : "Stored only when you approve"}</span>
        <Button variant="contained" onClick={extract} disabled={!text.trim() || loading} startIcon={loading ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}>{loading ? "Sorting…" : "Sort My Brain"}</Button>
      </div>
    </section>
    <div className="examplePrompts" aria-label="Example prompts">{examples.map((example) => <button key={example} onClick={() => setText(example)}>{example}</button>)}</div>
    <Snackbar open={!!message} autoHideDuration={4500} onClose={() => setMessage(null)}><Alert severity={message?.type}>{message?.text}</Alert></Snackbar>
  </>;
}
