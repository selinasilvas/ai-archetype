import { useState, useEffect, useCallback } from "react";
import { trackQuizResult, trackMeetResult, getArchetypeDistribution } from './lib/supabase'
import { ShareCard } from './components/ShareCard'
import { ARCHETYPES, RELATIONSHIP_PROFILES } from './data/archetypes'
import { QUIZ_QUESTIONS as QUESTIONS, MEET_PROMPTS as PROMPTS, REFLECTION_QUESTIONS } from './data/questions'

// ─── LIGHTBOX ───
const Lightbox = ({ src, alt, onClose }) => (
  <div onClick={onClose} style={{
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.85)", display: "flex",
    alignItems: "center", justifyContent: "center",
    cursor: "zoom-out", padding: 24,
  }}>
    <img src={src} alt={alt} style={{
      maxHeight: "90vh", maxWidth: "90vw",
      objectFit: "contain", borderRadius: 4,
    }} onClick={e => e.stopPropagation()} />
    <div style={{
      position: "absolute", top: 20, right: 24,
      color: "rgba(255,255,255,0.6)", fontSize: 28,
      cursor: "pointer", lineHeight: 1,
    }}>×</div>
  </div>
);

// ─── ICON HELPER: renders illustration if available, emoji fallback ───
// Illustrations are 1080×1350 (4:5 portrait) — width is 80% of height
const AlchemistIcon = ({ data, size = 56 }) => {
  if (data.image) {
    return <img src={data.image} alt={data.name} style={{
      width: size * 0.8, height: size,
      objectFit: "cover", objectPosition: "top center",
      borderRadius: 2,
    }} />;
  }
  return <span style={{ fontSize: size * 0.85 }}>{data.emoji}</span>;
};

// ─── HERO ILLUSTRATION: large portrait display for result screens ───
const AlchemistHero = ({ data }) => {
  const [open, setOpen] = useState(false);
  if (data.image) {
    return (
      <>
        {open && <Lightbox src={data.image} alt={data.name} onClose={() => setOpen(false)} />}
        <div onClick={() => setOpen(true)} style={{
          margin: "0 auto 32px", width: 300, height: 375,
          cursor: "zoom-in", position: "relative",
        }}>
          <img src={data.image} alt={data.name} style={{
            width: "100%", height: "100%", objectFit: "contain",
            display: "block",
          }} />
          <div style={{
            position: "absolute", bottom: 8, right: 8,
            fontSize: 11, color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.05em",
          }}>tap to enlarge</div>
        </div>
      </>
    );
  }
  return <div style={{ marginBottom: 16 }}><AlchemistIcon data={data} size={80} /></div>;
};

function calculateArchetype(answers) {
  const totals = { depth: 0, breadth: 0, mode: 0, relationship: 0, trust: 0 };
  answers.forEach(a => { if (a) Object.keys(totals).forEach(k => { totals[k] += a.scores[k]; }); });
  let bestMatch = null, bestScore = -Infinity;
  const scores = {};
  Object.entries(ARCHETYPES).forEach(([key, arch]) => {
    let score = 0;
    Object.keys(totals).forEach(k => {
      if (arch.dims[k] === 0) score += (2 - Math.abs(totals[k]) * 0.15);
      else score += totals[k] * arch.dims[k];
    });
    scores[key] = score;
    if (score > bestScore) { bestScore = score; bestMatch = key; }
  });
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return { primary: bestMatch, runnerUp: sorted[1][0], dimensions: totals };
}

function calculateProfile(answers) {
  const counts = {};
  answers.forEach(a => { if (a) counts[a] = (counts[a] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return { primary: sorted[0]?.[0] || "cocreator", runnerUp: sorted[1]?.[0] || "mirror" };
}

// ─── SHARED COMPONENTS ───
const DimBar = ({ value, maxVal, colorA, colorB, labelA, labelB }) => {
  const pct = (Math.max(-1, Math.min(1, value / (maxVal || 1))) + 1) / 2 * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6 }}>
        <span>{labelA}</span><span>{labelB}</span>
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `linear-gradient(90deg, ${colorA}, ${colorB})`, borderRadius: 4, transition: "width 1s ease" }} />
        <div style={{ position: "absolute", left: "50%", top: -2, bottom: -2, width: 1, background: "rgba(255,255,255,0.2)" }} />
      </div>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ padding: 32, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 24, ...style }}>{children}</div>
);

const Label = ({ children, color }) => (
  <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: color || "rgba(240,237,230,0.55)", marginBottom: 16 }}>{children}</div>
);

// ─── MAIN APP ───
export default function App() {
  const [mode, setMode] = useState(null); // null, "quiz", "meet"
  const [stage, setStage] = useState("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(null); // null = quiz flow, "gallery" = all archetypes
  const [lightbox, setLightbox] = useState(null); // key of archetype/profile to show fullscreen
  const [copiedId, setCopiedId] = useState(null);
  const [meetStep, setMeetStep] = useState("prompts"); // prompts, reflect, result

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [currentQ, stage, meetStep]);

  const bg = "#0C0C14";
  const tp = "#F0EDE6";
  const ts = "rgba(240,237,230,0.55)";
  const glow = (c, t, l, s = 400) => ({ position: "fixed", width: s, height: s, borderRadius: "50%", background: c, filter: `blur(${s * 0.4}px)`, opacity: 0.1, top: t, left: l, pointerEvents: "none", zIndex: 0 });
  const wrap = { minHeight: "100vh", background: bg, color: tp, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", position: "relative", overflow: "hidden" };
  const fonts = <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />;

  const restart = () => { setMode(null); setStage("start"); setCurrentQ(0); setAnswers([]); setResult(null); setShowAll(false); setMeetStep("prompts"); setPage(null); };

  const handleQuizAnswer = (opt, idx) => {
    setSelectedIdx(idx);
    const na = [...answers, opt];
    setTimeout(() => {
      setSelectedIdx(null);
      if (currentQ < QUESTIONS.length - 1) { setAnswers(na); setCurrentQ(currentQ + 1); }
      else {
        setAnswers(na);
        const r = calculateArchetype(na);
        setResult(r);
        setStage("result");
        trackQuizResult({ archetype: r.primary, runnerUp: r.runnerUp, dimensions: r.dimensions });
      }
    }, 400);
  };

  const handleReflectAnswer = (profile, idx) => {
    setSelectedIdx(idx);
    const na = [...answers, profile];
    setTimeout(() => {
      setSelectedIdx(null);
      if (currentQ < REFLECTION_QUESTIONS.length - 1) { setAnswers(na); setCurrentQ(currentQ + 1); }
      else {
        setAnswers(na);
        const r = calculateProfile(na);
        setResult(r);
        setMeetStep("result");
        trackMeetResult({ profile: r.primary, runnerUp: r.runnerUp });
      }
    }, 400);
  };

  const copyPrompt = (text, id) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); });
  };

  const Btn = ({ children, onClick, primary = false, style: s = {} }) => (
    <button onClick={onClick} style={{
      background: primary ? tp : "transparent", border: `1px solid ${primary ? tp : "rgba(255,255,255,0.2)"}`,
      color: primary ? bg : tp, padding: "16px 48px", fontSize: 14, letterSpacing: "0.15em",
      textTransform: "uppercase", cursor: "pointer", borderRadius: 0, fontFamily: "inherit", fontWeight: 500,
      transition: "all 0.3s ease", ...s
    }}
      onMouseEnter={e => { if (!primary) e.target.style.background = "rgba(255,255,255,0.06)"; }}
      onMouseLeave={e => { if (!primary) e.target.style.background = "transparent"; }}
    >{children}</button>
  );

  const OptionBtn = ({ text, onClick, selected }) => (
    <button onClick={onClick} style={{
      background: selected ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${selected ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
      color: tp, padding: "16px 22px", fontSize: 15, cursor: "pointer", borderRadius: 2,
      fontFamily: "inherit", textAlign: "left", lineHeight: 1.5, transition: "all 0.25s ease",
      transform: selected ? "scale(0.98)" : "scale(1)", width: "100%"
    }}
      onMouseEnter={e => { if (selectedIdx === null) { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.borderColor = "rgba(255,255,255,0.15)"; } }}
      onMouseLeave={e => { if (selectedIdx === null) { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; } }}
    >{text}</button>
  );

  // ─── GALLERY PAGE ───
  if (page === "gallery") {
    const isProfiles = mode === "meet";
    const items = isProfiles ? RELATIONSHIP_PROFILES : ARCHETYPES;
    const title = isProfiles ? "All 6 Relationship Profiles" : "All 11 Archetypes";
    return (
      <div style={wrap}>
        {fonts}
        <div style={glow("#6A0572", "-10%", "-5%", 500)} /><div style={glow("#0077B6", "60%", "70%", 400)} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>
          <button onClick={() => setPage(null)} style={{ background: "none", border: "none", color: ts, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginBottom: 40, padding: 0 }}>← Back to Your Result</button>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: ts, marginBottom: 16 }}>The Alchemists</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(32px, 6vw, 46px)", fontWeight: 400, lineHeight: 1.1, margin: "0 0 16px 0", fontStyle: "italic" }}>{title}</h1>
            <p style={{ fontSize: 15, color: ts, lineHeight: 1.7, margin: 0 }}>Every position on the spectrum is a legitimate one.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {Object.entries(items).map(([k, a]) => (
              <div key={k} style={{ background: result?.primary === k ? `${a.color}14` : "rgba(255,255,255,0.02)", border: `1px solid ${result?.primary === k ? a.color + "35" : "rgba(255,255,255,0.06)"}`, borderRadius: 2, overflow: "hidden" }}>
                {/* Illustration — full width, 4:5, clickable */}
                <div
                  onClick={() => a.image && setLightbox(k)}
                  style={{ width: "100%", aspectRatio: "4/5", background: a.color + "18", position: "relative", overflow: "hidden", cursor: a.image ? "zoom-in" : "default" }}
                >
                  {a.image ? (
                    <>
                      <img src={a.image} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                      <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 2 }}>Tap to expand</div>
                    </>
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 80 }}>{a.emoji}</span>
                    </div>
                  )}
                </div>
                {/* Text */}
                <div style={{ padding: "20px 24px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, fontStyle: "italic", color: result?.primary === k ? a.accent : tp }}>{a.name}</span>
                    {result?.primary === k && <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", background: a.color + "40", color: a.accent, padding: "2px 8px", borderRadius: 2 }}>You</span>}
                    {result?.runnerUp === k && <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.08)", color: ts, padding: "2px 8px", borderRadius: 2 }}>Runner-up</span>}
                  </div>
                  <div style={{ fontSize: 17, color: a.accent, fontStyle: "italic", fontFamily: "'Instrument Serif', Georgia, serif", marginBottom: 10 }}>"{a.tagline}"</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(240,237,230,0.65)" }}>{a.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Btn onClick={() => setPage(null)}>← Back to Your Result</Btn>
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && items[lightbox]?.image && (
          <div
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}
          >
            <div style={{ position: "relative", maxWidth: 480, width: "100%" }}>
              <img
                src={items[lightbox].image}
                alt={items[lightbox].name}
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", objectPosition: "top center", borderRadius: 2, display: "block" }}
              />
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, fontStyle: "italic", color: items[lightbox].accent }}>{items[lightbox].name}</div>
                <div style={{ fontSize: 12, color: "rgba(240,237,230,0.4)", marginTop: 8, letterSpacing: "0.08em" }}>Tap anywhere to close</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── INTRO ───
  if (!mode) {
    return (
      <div style={wrap}>
        {fonts}
        <div style={glow("#6A0572", "-10%", "-5%", 500)} /><div style={glow("#0077B6", "60%", "70%", 400)} /><div style={glow("#FF6B35", "30%", "50%", 300)} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", textAlign: "center", maxWidth: 640, margin: "0 auto", opacity: fadeIn ? 1 : 0, transition: "opacity 0.6s ease" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: ts, marginBottom: 24, fontWeight: 500 }}>The Alchemists</div>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(40px, 8vw, 60px)", fontWeight: 400, lineHeight: 1.1, margin: "0 0 24px 0", fontStyle: "italic" }}>
            Every Alchemist Has a<br />Different Relationship<br />with the Elements
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: ts, maxWidth: 480, margin: "0 0 48px 0" }}>
            Two ways to discover yours — take one or both.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 460 }}>
            <button onClick={() => { setMode("quiz"); setStage("quiz"); }} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              color: tp, padding: "28px 32px", cursor: "pointer", borderRadius: 2,
              fontFamily: "inherit", textAlign: "left", transition: "all 0.3s ease"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>🔮</div>
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, fontStyle: "italic", marginBottom: 6 }}>Discover Your Alchemist</div>
              <div style={{ fontSize: 13, color: ts, lineHeight: 1.5 }}>11 archetypes from Distiller to Guardian. 12 questions about how you relate to AI — you don't need to use AI to take this.</div>
              <div style={{ fontSize: 11, color: "rgba(240,237,230,0.3)", marginTop: 8 }}>~3 minutes</div>
            </button>
            <button onClick={() => { setMode("meet"); setMeetStep("prompts"); }} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              color: tp, padding: "28px 32px", cursor: "pointer", borderRadius: 2,
              fontFamily: "inherit", textAlign: "left", transition: "all 0.3s ease"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>🪞</div>
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, fontStyle: "italic", marginBottom: 6 }}>Meet Your AI</div>
              <div style={{ fontSize: 13, color: ts, lineHeight: 1.5 }}>Ask your AI 6 prompts about your relationship, then reflect on what comes back. Discover the dynamic you've co-created.</div>
              <div style={{ fontSize: 11, color: "rgba(240,237,230,0.3)", marginTop: 8 }}>~10 minutes · requires an AI you've chatted with</div>
            </button>
          </div>
          <div style={{ marginTop: 56, fontSize: 11, color: "rgba(240,237,230,0.25)", letterSpacing: "0.05em", lineHeight: 1.6 }}>
            Grounded in research from Anthropic, OpenAI, NBER & Pew Research Center · Illustrated by Selina Sprout
          </div>
        </div>
      </div>
    );
  }

  // ─── MODE 1: QUIZ ───
  if (mode === "quiz" && stage === "quiz") {
    const q = QUESTIONS[currentQ];
    return (
      <div style={wrap}>
        {fonts}<div style={glow("#6A0572", "-10%", "-5%", 500)} /><div style={glow("#0077B6", "60%", "70%", 400)} />
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", zIndex: 10 }}>
          <div style={{ height: "100%", width: `${(currentQ / QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #6A0572, #0077B6)", transition: "width 0.5s ease" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 560, margin: "0 auto", opacity: fadeIn ? 1 : 0, transition: "opacity 0.4s ease" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: ts, marginBottom: 40 }}>{currentQ + 1} / {QUESTIONS.length}</div>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(22px, 4.5vw, 30px)", fontWeight: 400, lineHeight: 1.35, margin: "0 0 40px 0", textAlign: "center", fontStyle: "italic" }}>{q.question}</h2>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((o, i) => <OptionBtn key={i} text={o.text} selected={selectedIdx === i} onClick={() => handleQuizAnswer(o, i)} />)}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "quiz" && stage === "result" && result) {
    const arch = ARCHETYPES[result.primary];
    const runner = ARCHETYPES[result.runnerUp];
    const mx = Math.max(...Object.values(result.dimensions).map(Math.abs), 1);
    return (
      <div style={wrap}>
        {fonts}<div style={glow(arch.color, "-5%", "-5%", 600)} /><div style={glow(arch.accent, "50%", "60%", 400)} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "60px 24px 80px", opacity: fadeIn ? 1 : 0, transition: "opacity 0.8s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Label>Your Alchemist</Label>
            <AlchemistHero data={arch} />
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 7vw, 52px)", fontWeight: 400, lineHeight: 1.1, margin: "0 0 12px 0", fontStyle: "italic" }}>{arch.name}</h1>
            <div style={{ fontSize: 18, color: arch.accent, fontStyle: "italic", fontFamily: "'Instrument Serif', Georgia, serif" }}>"{arch.tagline}"</div>
          </div>
          <Card><p style={{ fontSize: 16, lineHeight: 1.75, margin: 0, color: "rgba(240,237,230,0.85)" }}>{arch.description}</p></Card>
          <Card>
            <Label>Your Dimensions</Label>
            <DimBar value={result.dimensions.depth} maxVal={mx} colorA="#FF6B35" colorB="#2D6A4F" labelA="Surface" labelB="Deep" />
            <DimBar value={result.dimensions.breadth} maxVal={mx} colorA="#1D3557" colorB="#E63946" labelA="Specialist" labelB="Cross-Domain" />
            <DimBar value={result.dimensions.mode} maxVal={mx} colorA="#BC6C25" colorB="#6A0572" labelA="Execution" labelB="Reflection" />
            <DimBar value={result.dimensions.relationship} maxVal={mx} colorA="#0077B6" colorB="#C77DFF" labelA="Solo" labelB="Collaborative" />
            <DimBar value={result.dimensions.trust} maxVal={mx} colorA="#9B2226" colorB="#95D5B2" labelA="Skeptical" labelB="Open" />
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <Card style={{ marginBottom: 0 }}>
              <Label color={arch.accent}>Strengths</Label>
              {arch.strengths.map((s, i) => <div key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(240,237,230,0.75)", marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${arch.color}44` }}>{s}</div>)}
            </Card>
            <Card style={{ marginBottom: 0 }}>
              <Label>Growth Edge</Label>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "rgba(240,237,230,0.75)" }}>{arch.blindSpot}</p>
            </Card>
          </div>
          <Card style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Label>From the Research</Label>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "rgba(240,237,230,0.55)", fontStyle: "italic" }}>{arch.percentNote}</p>
          </Card>
          <Card style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Label>Runner-Up</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AlchemistIcon data={runner} size={36} />
              <div>
                <div style={{ fontSize: 18, fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic" }}>{runner.name}</div>
                <div style={{ fontSize: 13, color: ts }}>{runner.tagline}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: "12px 0 0", color: "rgba(240,237,230,0.55)" }}>{runner.description}</p>
          </Card>
          <div style={{ marginBottom: 24 }}>
            <button onClick={() => setPage("gallery")} style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: tp, padding: "16px 24px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, fontFamily: "inherit", textAlign: "center", transition: "all 0.3s ease" }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.02)"}
            >Explore All 11 Alchemists →</button>
          </div>

          {/* Shareable Result Card */}
          <Card style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Label>Share Your Result</Label>
            <ShareCard archetype={arch} dimensions={result.dimensions} mode="quiz" />
          </Card>

          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={restart}>Start Over</Btn>
              <Btn onClick={() => { setMode("meet"); setMeetStep("prompts"); setCurrentQ(0); setAnswers([]); setResult(null); }} primary>Now Try "Meet Your AI" →</Btn>
            </div>
            <div style={{ marginTop: 40, fontSize: 11, color: "rgba(240,237,230,0.3)", letterSpacing: "0.05em", lineHeight: 1.8 }}>
              Every alchemist's practice is a valid one.<br />There's no wrong way to relate to the elements — only unexplored ones.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MODE 2: MEET YOUR AI ───
  if (mode === "meet" && meetStep === "prompts") {
    return (
      <div style={wrap}>
        {fonts}<div style={glow("#C77DFF", "-5%", "-5%", 500)} /><div style={glow("#DDA15E", "60%", "65%", 400)} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "60px 24px 80px", opacity: fadeIn ? 1 : 0, transition: "opacity 0.6s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🪞</div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 400, lineHeight: 1.15, margin: "0 0 16px 0", fontStyle: "italic" }}>Meet Your AI</h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: ts, maxWidth: 440, margin: "0 auto" }}>
              Copy each prompt below and send it to your AI — Claude, ChatGPT, Gemini, whoever you talk to. Then come back and reflect on what you learned.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            {PROMPTS.map((p, i) => (
              <div key={p.id} style={{ padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "rgba(240,237,230,0.3)", fontWeight: 500 }}>{i + 1}/6</span>
                    <span style={{ fontSize: 14, fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: "#C77DFF" }}>{p.label}</span>
                  </div>
                  <button onClick={() => copyPrompt(p.prompt, p.id)} style={{
                    background: copiedId === p.id ? "rgba(149,213,178,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copiedId === p.id ? "rgba(149,213,178,0.3)" : "rgba(255,255,255,0.1)"}`,
                    color: copiedId === p.id ? "#95D5B2" : ts, padding: "6px 14px", fontSize: 11,
                    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2,
                    fontFamily: "inherit", transition: "all 0.3s ease"
                  }}>{copiedId === p.id ? "Copied ✓" : "Copy"}</button>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.65, margin: "0 0 12px 0", color: "rgba(240,237,230,0.85)" }}>"{p.prompt}"</p>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: "rgba(240,237,230,0.4)", fontStyle: "italic" }}>{p.insight}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, color: ts, marginBottom: 24, lineHeight: 1.6 }}>
              Done? Come back and reflect on what your AI told you.
            </p>
            <Btn primary onClick={() => { setMeetStep("reflect"); setCurrentQ(0); setAnswers([]); }}>
              I've Run the Prompts →
            </Btn>
            <div style={{ marginTop: 16 }}>
              <Btn onClick={restart}>← Back to Start</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "meet" && meetStep === "reflect") {
    const q = REFLECTION_QUESTIONS[currentQ];
    return (
      <div style={wrap}>
        {fonts}<div style={glow("#C77DFF", "-10%", "-5%", 500)} /><div style={glow("#DDA15E", "60%", "70%", 400)} />
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", zIndex: 10 }}>
          <div style={{ height: "100%", width: `${(currentQ / REFLECTION_QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #C77DFF, #DDA15E)", transition: "width 0.5s ease" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", maxWidth: 560, margin: "0 auto", opacity: fadeIn ? 1 : 0, transition: "opacity 0.4s ease" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: ts, marginBottom: 40 }}>Reflection {currentQ + 1} / {REFLECTION_QUESTIONS.length}</div>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(22px, 4.5vw, 28px)", fontWeight: 400, lineHeight: 1.35, margin: "0 0 40px 0", textAlign: "center", fontStyle: "italic" }}>{q.question}</h2>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((o, i) => <OptionBtn key={i} text={o.text} selected={selectedIdx === i} onClick={() => handleReflectAnswer(o.profile, i)} />)}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "meet" && meetStep === "result" && result) {
    const prof = RELATIONSHIP_PROFILES[result.primary];
    const runner = RELATIONSHIP_PROFILES[result.runnerUp];
    return (
      <div style={wrap}>
        {fonts}<div style={glow(prof.color, "-5%", "-5%", 600)} /><div style={glow(prof.accent, "50%", "60%", 400)} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "60px 24px 80px", opacity: fadeIn ? 1 : 0, transition: "opacity 0.8s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Label>Your AI Relationship Profile</Label>
            <AlchemistHero data={prof} />
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(32px, 6vw, 46px)", fontWeight: 400, lineHeight: 1.15, margin: "0 0 12px 0", fontStyle: "italic" }}>{prof.name}</h1>
          </div>
          <Card><p style={{ fontSize: 16, lineHeight: 1.75, margin: 0, color: "rgba(240,237,230,0.85)" }}>{prof.description}</p></Card>
          <Card style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Label color={prof.accent}>Signature Pattern</Label>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "rgba(240,237,230,0.7)" }}>{prof.signature}</p>
          </Card>
          {runner && <Card style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Label>Secondary Dynamic</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AlchemistIcon data={runner} size={36} />
              <div>
                <div style={{ fontSize: 18, fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic" }}>{runner.name}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: "12px 0 0", color: "rgba(240,237,230,0.55)" }}>{runner.description}</p>
          </Card>}
          <Card>
            <Label>What This Reveals</Label>
            <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0, color: "rgba(240,237,230,0.75)" }}>
              Your AI relationship profile isn't about the AI — it's about you. The dynamic you've built reflects your communication style, your values, your intellectual needs, and what you've given yourself permission to explore. Every profile is valid. But knowing yours can help you decide: is this the relationship you want, or is there an unexplored mode that might serve you even better?
            </p>
          </Card>

          {/* Shareable Result Card */}
          <Card style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Label>Share Your Result</Label>
            <ShareCard profile={prof} mode="meet" />
          </Card>

          {/* All profiles */}
          <div style={{ marginBottom: 24 }}>
            <button onClick={() => setPage("gallery")} style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: tp, padding: "16px 24px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, fontFamily: "inherit", textAlign: "center", transition: "all 0.3s ease" }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.02)"}
            >Explore All 6 Relationship Profiles →</button>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={restart}>Start Over</Btn>
              {!answers.quizDone && <Btn primary onClick={() => { setMode("quiz"); setStage("quiz"); setCurrentQ(0); setAnswers([]); setResult(null); }}>Discover Your Alchemist →</Btn>}
            </div>
            <div style={{ marginTop: 40, fontSize: 11, color: "rgba(240,237,230,0.3)", letterSpacing: "0.05em", lineHeight: 1.8 }}>
              Your AI reflects you back. What you see in the mirror<br />says as much about the person looking as the glass itself.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
