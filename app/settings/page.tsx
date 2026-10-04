"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Snackbar } from "@mui/material";
import { BellRing, Bot, CheckCircle2, Database, Moon, ShieldCheck, Sun, Volume2 } from "lucide-react";
import { useAppearance } from "@/app/providers";
import { clearCommitments } from "@/lib/db";
import { enableNotifications, notificationState, testNotification } from "@/lib/notifications";

export default function SettingsPage() {
  const { appearance, setAppearance } = useAppearance();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => notificationState());
  const [ai, setAi] = useState<boolean | null>(null);
  const [voice, setVoice] = useState<boolean | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/ai/extract").then((r) => r.json()).then((data) => setAi(Boolean(data.configured))).catch(() => setAi(null));
    fetch("/api/voice/briefing").then((r) => r.json()).then((data) => setVoice(Boolean(data.configured))).catch(() => setVoice(null));
  }, []);
  const erase = async () => { await clearCommitments(); localStorage.removeItem("pingme-onboarded"); setConfirm(false); setMessage("All local PingMe data was deleted from this browser."); window.dispatchEvent(new Event("pingme:commitments-changed")); };

  return <div className="pageShell settingsPage shell">
    <header className="pageHeading"><div><p className="eyebrow">Make it yours</p><h1>Settings</h1><p>Simple controls, clear privacy, no account required.</p></div></header>
    <div className="settingsGrid">
      <section className="settingsCard"><div className="settingsIcon"><Sun /></div><div className="settingsContent"><h2>Appearance</h2><p>Choose the look that feels easiest on your eyes.</p><RadioGroup row value={appearance} onChange={(e) => setAppearance(e.target.value as "light" | "dark" | "system")}><FormControlLabel value="light" control={<Radio />} label="Light" /><FormControlLabel value="dark" control={<Radio />} label="Dark" /><FormControlLabel value="system" control={<Radio />} label="System" /></RadioGroup></div><Moon className="decorIcon" /></section>
      <section className="settingsCard"><div className="settingsIcon"><BellRing /></div><div className="settingsContent"><div className="settingTitle"><h2>Notifications</h2><Chip size="small" label={permission} color={permission === "granted" ? "success" : "default"} /></div><p>PingMe can remind you even when you’re busy doing something else. Permission is requested only when you choose.</p><div className="buttonRow"><Button variant="contained" disabled={permission === "granted" || permission === "denied" || permission === "unsupported"} onClick={async () => setPermission(await enableNotifications())}>Enable notifications</Button><Button variant="outlined" disabled={permission !== "granted"} onClick={() => { try { testNotification(); } catch { setMessage("Notifications are not available."); } }}>Test notification</Button></div>{permission === "denied" && <Alert severity="info">Notifications are blocked. You can re-enable them in your browser’s site settings.</Alert>}</div></section>
      <section className="settingsCard"><div className="settingsIcon"><Bot /></div><div className="settingsContent"><div className="settingTitle"><h2>AI</h2><Chip size="small" label={ai ? "Connected" : ai === false ? "Demo mode" : "Unavailable"} color={ai ? "success" : "warning"} /></div><strong>Powered by Gemma</strong><p>PingMe uses open-weight AI to understand your commitments. In demo mode, a clearly labelled local rules parser handles common phrases.</p></div></section>
      <section className="settingsCard"><div className="settingsIcon"><Volume2 /></div><div className="settingsContent"><div className="settingTitle"><h2>Voice</h2><Chip size="small" label={voice ? "ElevenLabs ready" : voice === false ? "Not configured" : "Unavailable"} color={voice ? "success" : "default"} /></div><p>Optional natural spoken daily briefings. Audio text is sent only when you press “Tell me my day.”</p></div></section>
      <section className="settingsCard privacySettings"><div className="settingsIcon"><ShieldCheck /></div><div className="settingsContent"><h2>Privacy & local data</h2><p>Your commitments live in your browser using IndexedDB. PingMe sends Brain Dump text to the configured AI endpoint only when you ask it to organize your thoughts.</p><div className="privacyPoints"><span><CheckCircle2 /> No account</span><span><Database /> Local-first commitments</span></div><Button color="error" variant="outlined" onClick={() => setConfirm(true)}>Delete all local data</Button></div></section>
    </div>
    <Dialog open={confirm} onClose={() => setConfirm(false)}><DialogTitle>Delete all local data?</DialogTitle><DialogContent>This permanently removes every commitment and resets onboarding in this browser. This cannot be undone.</DialogContent><DialogActions><Button onClick={() => setConfirm(false)}>Cancel</Button><Button color="error" onClick={erase}>Delete everything</Button></DialogActions></Dialog>
    <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage(null)}><Alert severity="success">{message}</Alert></Snackbar>
  </div>;
}
