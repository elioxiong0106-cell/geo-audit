import type { RawAuditData } from "../mock/types"

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface TrendPoint {
  date: string
  score: number
}

/**
 * Generate deterministic 30-day trend ending at the current value.
 * Same brand always produces same series. Volatility is small (±3pp).
 */
export function buildTrend(brand: string, currentValue: number): TrendPoint[] {
  const rand = mulberry32(hashCode(brand) + 7)
  const days = 30
  const series: number[] = []

  // Start ~5pp below current, then random walk converging to current
  let v = Math.max(0, Math.min(100, currentValue - 5 + (rand() - 0.5) * 4))
  for (let i = 0; i < days; i++) {
    series.push(v)
    const progress = i / (days - 1)
    const target = currentValue
    const drift = (target - v) * 0.15
    const noise = (rand() - 0.5) * 4
    v = Math.max(0, Math.min(100, v + drift + noise))
  }
  // Force the last point to be current value
  series[days - 1] = currentValue

  const now = new Date()
  return series.map((score, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      score: Math.round(score * 10) / 10,
    }
  })
}

/**
 * Compute week-over-week delta. Compares last 7-day avg vs prior 7-day avg.
 */
export function weekOverWeekDelta(trend: TrendPoint[]): number {
  if (trend.length < 14) return 0
  const recent = trend.slice(-7).reduce((a, b) => a + b.score, 0) / 7
  const prior = trend.slice(-14, -7).reduce((a, b) => a + b.score, 0) / 7
  return Math.round((recent - prior) * 10) / 10
}
