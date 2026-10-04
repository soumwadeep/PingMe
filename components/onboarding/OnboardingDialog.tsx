"use client";

import { useState } from "react";
import { Button, Dialog, DialogContent, IconButton, LinearProgress } from "@mui/material";
import { ArrowRight, BrainCircuit, Check, MessageCircle, X } from "lucide-react";

const steps = [
  { Icon: MessageCircle, title: "Say what’s on your mind", copy: "Talk to PingMe like you’d talk to a friend." },
  { Icon: BrainCircuit, title: "AI figures out the details", copy: "Tasks, deadlines and reminders are extracted automatically." },
  { Icon: Check, title: "Get on with your day", copy: "We’ll keep track of what matters—right here in your browser." },
];

export default function OnboardingDialog() {
  const [open, setOpen] = useState(() => typeof window !== "undefined" && localStorage.getItem("pingme-onboarded") !== "true");
  const [step, setStep] = useState(0);
  const finish = () => { localStorage.setItem("pingme-onboarded", "true"); setOpen(false); };
  const current = steps[step];
  return <Dialog open={open} maxWidth="xs" fullWidth aria-labelledby="onboarding-title" slotProps={{ paper: { className: "onboardingPaper" } }}>
    <IconButton aria-label="Skip onboarding" onClick={finish} className="dialogClose"><X size={18} /></IconButton>
    <DialogContent>
      <LinearProgress variant="determinate" value={((step + 1) / steps.length) * 100} className="onboardingProgress" />
      <div className="onboardingIcon"><current.Icon size={28} /></div>
      <p className="eyebrow">Welcome to PingMe</p>
      <h2 id="onboarding-title">{current.title}</h2>
      <p>{current.copy}</p>
      <Button fullWidth variant="contained" endIcon={step < 2 ? <ArrowRight size={18} /> : <Check size={18} />} onClick={() => step < 2 ? setStep(step + 1) : finish()}>
        {step < 2 ? "Continue" : "Start Brain Dumping"}
      </Button>
      <div className="stepDots" aria-label={`Step ${step + 1} of 3`}>{steps.map((_, i) => <span key={i} className={i === step ? "active" : ""} />)}</div>
    </DialogContent>
  </Dialog>;
}
