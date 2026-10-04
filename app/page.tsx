import {
  BrainCircuit,
  BellRing,
  LockKeyhole,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import BrainDumpComposer from "@/components/brain-dump/BrainDumpComposer";

export default function Home() {
  return (
    <>
      <section className="hero shell" id="brain-dump">
        <div className="heroGlow" aria-hidden="true" />
        <p className="badge">
          <Sparkles size={14} /> Your AI memory companion
        </p>
        <h1>What’s on your mind?</h1>
        <p className="heroCopy">
          Dump everything here. PingMe will figure out what matters, when it
          matters, and remind you.
        </p>
        <BrainDumpComposer />
        <p className="trustLine">
          <LockKeyhole size={14} /> Your commitments stay on this device. AI is
          contacted only when you press Sort.
        </p>
      </section>

      <section className="explainSection shell">
        <div className="sectionIntro">
          <p className="eyebrow">Less organizing. More living.</p>
          <h2>Your thoughts aren’t todo lists.</h2>
          <p>
            Commitments show up mid-conversation, between errands, or five
            minutes before bed. PingMe meets them there.
          </p>
        </div>
        <div className="featureGrid">
          <article>
            <span>
              <MessageSquareText />
            </span>
            <p className="stepNumber">01</p>
            <h3>Dump it</h3>
            <p>
              Type or speak naturally. No forms, categories, or date pickers.
            </p>
          </article>
          <article>
            <span>
              <BrainCircuit />
            </span>
            <p className="stepNumber">02</p>
            <h3>AI sorts it</h3>
            <p>
              Gemma identifies tasks, deadlines, events, and reminders for your
              review.
            </p>
          </article>
          <article>
            <span>
              <BellRing />
            </span>
            <p className="stepNumber">03</p>
            <h3>Get reminded</h3>
            <p>Everything lands in a calm, chronological view of your day.</p>
          </article>
        </div>
      </section>

      <section className="privacySection">
        <div className="shell privacyInner">
          <div className="privacyArt">
            <div className="orbit one" />
            <div className="orbit two" />
            <LockKeyhole size={38} />
          </div>
          <div>
            <p className="eyebrow">Private by design</p>
            <h2>
              Your life shouldn’t become training data just because you needed a
              reminder.
            </h2>
            <p>
              Your commitments live locally in IndexedDB. Only the Brain Dump
              text you explicitly ask us to sort is sent to your configured
              Gemma endpoint. No account. No cloud task database.
            </p>
          </div>
        </div>
      </section>
      <footer className="footer shell">
        <strong>PingMe</strong>
        <span>Say it. Forget it. We’ll remember.</span>
        <span>Built for a friend · Hacktoberfest Weekend 2026</span>
      </footer>
    </>
  );
}
