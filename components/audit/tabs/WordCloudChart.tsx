"use client"

import { useMemo, useRef, useLayoutEffect, useState } from "react"

interface Keyword {
  text: string
  value: number
}

interface PlacedWord extends Keyword {
  x: number
  y: number
  fontSize: number
  color: string
  weight: number
  rotation: number
}

// Deterministic hash for stable layout
function hash(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i)
  return Math.abs(h)
}

function sizeFor(v: number, max: number): number {
  const ratio = Math.pow((v - 20) / Math.max(1, max - 20), 0.65)
  return Math.round(13 + ratio * 32) // 13–45px
}

function colorFor(v: number, max: number): string {
  const ratio = (v - 20) / Math.max(1, max - 20)
  // emerald gradient: deep green → bright emerald → teal
  if (ratio > 0.75) return "#34d399"  // emerald-400
  if (ratio > 0.5)  return "#6ee7b7"  // emerald-300
  if (ratio > 0.25) return "#a7f3d0"  // emerald-200
  return "#d1fae5"                     // emerald-100
}

function weightFor(v: number, max: number): number {
  const ratio = (v - 20) / Math.max(1, max - 20)
  return ratio > 0.6 ? 700 : ratio > 0.3 ? 600 : 400
}

// Approximate text width in pixels
function textWidth(text: string, fontSize: number, weight: number): number {
  const charWidth = fontSize * (weight >= 600 ? 0.68 : 0.62)
  return text.length * charWidth
}

// Archimedean spiral placement with collision detection
function spiralLayout(
  keywords: Keyword[],
  W: number,
  H: number
): PlacedWord[] {
  const maxVal = Math.max(...keywords.map((k) => k.value))
  const placed: PlacedWord[] = []
  const cx = W / 2
  const cy = H / 2

  for (const kw of keywords) {
    const fontSize = sizeFor(kw.value, maxVal)
    const weight = weightFor(kw.value, maxVal)
    const h = hash(kw.text)
    const maxRot = fontSize < 20 ? 20 : fontSize < 28 ? 8 : 0
    const rotation = maxRot === 0 ? 0 : ((h % (maxRot * 2)) - maxRot)
    const ww = textWidth(kw.text, fontSize, weight) + 6
    const wh = fontSize * 1.35 + 4

    let bestX = cx, bestY = cy

    // Spiral outward — larger step to spread words to edges
    const maxR = Math.sqrt(W * W + H * H) / 2
    for (let r = 0; r <= maxR; r += 4) {
      const startAngle = (h % 628) / 100
      const steps = Math.max(1, Math.round((2 * Math.PI * Math.max(1, r)) / 10))
      let found = false
      for (let si = 0; si < steps; si++) {
        const angle = startAngle + (si / steps) * 2 * Math.PI
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle) * 0.65

        if (x - ww / 2 < 2 || x + ww / 2 > W - 2) continue
        if (y - wh / 2 < 2 || y + wh / 2 > H - 2) continue

        const rad = Math.PI * rotation / 180
        const cosR = Math.abs(Math.cos(rad))
        const sinR = Math.abs(Math.sin(rad))
        const effW = ww * cosR + wh * sinR
        const effH = ww * sinR + wh * cosR

        const collision = placed.some((p) => {
          const pRad = Math.PI * p.rotation / 180
          const pCosR = Math.abs(Math.cos(pRad))
          const pSinR = Math.abs(Math.sin(pRad))
          const pw = textWidth(p.text, p.fontSize, p.weight) + 6
          const ph = p.fontSize * 1.35
          const pEffW = pw * pCosR + ph * pSinR
          const pEffH = pw * pSinR + ph * pCosR
          const dx = Math.abs(p.x - x)
          const dy = Math.abs(p.y - y)
          return dx < (effW + pEffW) / 2 + 4 && dy < (effH + pEffH) / 2 + 2
        })

        if (!collision) {
          bestX = x
          bestY = y
          found = true
          break
        }
      }
      if (found) break
    }

    placed.push({
      ...kw,
      x: bestX,
      y: bestY,
      fontSize,
      color: colorFor(kw.value, maxVal),
      weight,
      rotation,
    })
  }

  // Scale positions to fill the container
  return expandToFill(placed, W, H)
}

// Stretch placement bounding box to fill container with padding
function expandToFill(placed: PlacedWord[], W: number, H: number): PlacedWord[] {
  if (placed.length < 2) return placed
  const pad = 16
  const xs = placed.map((p) => p.x)
  const ys = placed.map((p) => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const bw = maxX - minX || 1
  const bh = maxY - minY || 1
  const scaleX = (W - pad * 2) / bw
  const scaleY = (H - pad * 2) / bh
  // Use the smaller scale to preserve aspect ratio, then apply both axes independently for true fill
  const cxOld = (minX + maxX) / 2
  const cyOld = (minY + maxY) / 2
  return placed.map((p) => ({
    ...p,
    x: W / 2 + (p.x - cxOld) * scaleX * 0.92,
    y: H / 2 + (p.y - cyOld) * scaleY * 0.88,
  }))
}

export default function WordCloudChart({ keywords }: { keywords: Keyword[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight })
    })
    obs.observe(el)
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
    return () => obs.disconnect()
  }, [])

  const words = useMemo(
    () =>
      size && keywords.length > 0
        ? spiralLayout(keywords, size.w, size.h)
        : [],
    [keywords, size]
  )

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden select-none">
      {words.map((w) => (
        <span
          key={w.text}
          className="absolute cursor-default transition-opacity duration-150 hover:opacity-100"
          style={{
            left: w.x,
            top: w.y,
            transform: `translate(-50%, -50%) rotate(${w.rotation}deg)`,
            fontSize: w.fontSize,
            fontWeight: w.weight,
            color: w.color,
            opacity: 0.55 + ((w.value - 20) / 75) * 0.45,
            lineHeight: 1,
            whiteSpace: "nowrap",
            letterSpacing: w.fontSize > 24 ? "-0.02em" : "normal",
          }}
          title={w.text}
        >
          {w.text}
        </span>
      ))}
    </div>
  )
}
