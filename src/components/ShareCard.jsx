import { useRef, useState, useCallback } from 'react'
import { toPng } from 'html-to-image'

export function ShareCard({ archetype, dimensions, mode = 'quiz', profile = null }) {
  const cardRef = useRef(null)
  const [generating, setGenerating] = useState(false)
  const [shareStatus, setShareStatus] = useState(null)

  const data = mode === 'quiz' ? archetype : profile
  if (!data) return null

  // Card is 540×675 — native 4:5 ratio matching the illustrations
  const CARD_W = 540
  const CARD_H = 675

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return null
    setGenerating(true)
    try {
      const opts = {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0C0C14',
        width: CARD_W,
        height: CARD_H,
      }
      // First call forces images into cache; second call captures correctly
      await toPng(cardRef.current, opts)
      const dataUrl = await toPng(cardRef.current, opts)
      return dataUrl
    } catch (e) {
      console.error('Image generation failed:', e)
      return null
    } finally {
      setGenerating(false)
    }
  }, [])

  const handleDownload = useCallback(async () => {
    const dataUrl = await generateImage()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.download = `my-ai-${mode === 'quiz' ? 'archetype' : 'relationship'}.png`
    link.href = dataUrl
    link.click()
    setShareStatus('downloaded')
    setTimeout(() => setShareStatus(null), 2000)
  }, [generateImage, mode])

  const handleCopyLink = useCallback(() => {
    const url = window.location.origin + (mode === 'quiz'
      ? `?result=${archetype?.name?.toLowerCase().replace(/\s+/g, '-')}`
      : `?profile=${profile?.name?.toLowerCase().replace(/\s+/g, '-')}`)
    navigator.clipboard.writeText(url).then(() => {
      setShareStatus('copied')
      setTimeout(() => setShareStatus(null), 2000)
    })
  }, [archetype, profile, mode])

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) { handleCopyLink(); return }
    const dataUrl = await generateImage()
    if (!dataUrl) {
      try {
        await navigator.share({
          title: `I'm ${data.name}`,
          text: `I took The Alchemists quiz and I'm ${data.name}: "${data.tagline}"`,
          url: window.location.origin
        })
      } catch (e) { /* cancelled */ }
      return
    }
    try {
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `my-ai-archetype.png`, { type: 'image/png' })
      await navigator.share({
        title: `I'm ${data.name}`,
        text: `I took The Alchemists quiz and I'm ${data.name}: "${data.tagline}"`,
        files: [file],
        url: window.location.origin
      })
    } catch (e) { /* cancelled */ }
  }, [data, generateImage, handleCopyLink])

  // Illustration fills the full card, text overlays at the bottom
  return (
    <div style={{ marginBottom: 32 }}>
      {/* Renderable card — portrait 4:5, illustration full-bleed */}
      <div ref={cardRef} style={{
        width: CARD_W,
        height: CARD_H,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 6,
        border: `1px solid ${data.color}30`,
        background: '#0C0C14',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        color: '#F0EDE6',
      }}>
        {/* Full-bleed illustration */}
        {data.image ? (
          <img
            src={data.image}
            alt={data.name}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 120,
          }}>{data.emoji}</div>
        )}

        {/* Gradient overlay — bottom 45% */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '55%',
          background: `linear-gradient(to bottom, transparent 0%, #0C0C14 45%)`,
          pointerEvents: 'none',
        }} />

        {/* Ambient colour glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
          background: `linear-gradient(to bottom, transparent 0%, ${data.color}22 100%)`,
          pointerEvents: 'none',
        }} />

        {/* Text content — sits over gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '0 36px 28px',
          zIndex: 1,
        }}>
          {/* Label */}
          <div style={{
            fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(240,237,230,0.45)', marginBottom: 6,
          }}>
            {mode === 'quiz' ? 'My AI Archetype' : 'My AI Relationship'}
          </div>

          {/* Name */}
          <div style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 32, fontStyle: 'italic', fontWeight: 400,
            lineHeight: 1.1, marginBottom: 5,
          }}>{data.name}</div>

          {/* Tagline */}
          <div style={{
            fontSize: 13, fontStyle: 'italic',
            fontFamily: "'Instrument Serif', Georgia, serif",
            color: data.accent, marginBottom: 16, opacity: 0.9,
          }}>"{data.tagline}"</div>

          {/* Dimensions (quiz only) */}
          {mode === 'quiz' && dimensions && (
            <div style={{ marginBottom: 16 }}>
              {[
                { value: dimensions.depth,        colorA: '#FF6B35', colorB: '#2D6A4F', label: 'Surface ↔ Deep' },
                { value: dimensions.breadth,      colorA: '#1D3557', colorB: '#E63946', label: 'Specialist ↔ Cross-Domain' },
                { value: dimensions.mode,         colorA: '#BC6C25', colorB: '#6A0572', label: 'Execution ↔ Reflection' },
                { value: dimensions.relationship, colorA: '#0077B6', colorB: '#C77DFF', label: 'Solo ↔ Collaborative' },
                { value: dimensions.trust,        colorA: '#9B2226', colorB: '#95D5B2', label: 'Skeptical ↔ Open' },
              ].map(({ value, colorA, colorB, label }) => {
                const pct = (Math.max(-1, Math.min(1, value / Math.max(...Object.values(dimensions).map(Math.abs), 1))) + 1) / 2 * 100;
                return (
                  <div key={label} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.4)', marginBottom: 3 }}>{label}</div>
                    <div style={{ position: 'relative', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.round(pct)}%`, background: `linear-gradient(90deg, ${colorA}, ${colorB})`, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Meet mode — signature text */}
          {mode !== 'quiz' && (
            <div style={{ fontSize: 12, lineHeight: 1.65, color: 'rgba(240,237,230,0.5)', marginBottom: 16 }}>
              {data.signature || data.description?.slice(0, 100) + '…'}
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(240,237,230,0.2)', letterSpacing: '0.05em' }}>aiarchetype.com</div>
            <div style={{ fontSize: 9, color: 'rgba(240,237,230,0.2)', letterSpacing: '0.05em' }}>What's yours? →</div>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={handleDownload} disabled={generating} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#F0EDE6', padding: '10px 20px', fontSize: 12, letterSpacing: '0.1em',
          textTransform: 'uppercase', cursor: generating ? 'wait' : 'pointer',
          borderRadius: 2, fontFamily: 'inherit', opacity: generating ? 0.5 : 1
        }}>
          {generating ? 'Generating…' : shareStatus === 'downloaded' ? 'Saved ✓' : '↓ Save Image'}
        </button>
        <button onClick={handleCopyLink} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#F0EDE6', padding: '10px 20px', fontSize: 12, letterSpacing: '0.1em',
          textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit'
        }}>
          {shareStatus === 'copied' ? 'Copied ✓' : '🔗 Copy Link'}
        </button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button onClick={handleNativeShare} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#F0EDE6', padding: '10px 20px', fontSize: 12, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit'
          }}>
            ↗ Share
          </button>
        )}
      </div>
    </div>
  )
}

