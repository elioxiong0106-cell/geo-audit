import type { RawAuditData } from "../mock/types"
import { BRANDS } from "../mock/brands"
import { generateMockReport } from "../mock/generator"

export interface RankingItem {
  brand: string
  slug: string
  score: number
  delta: number
  isReal: boolean
}

const REAL_DATA_BRANDS = new Set(BRANDS.filter((b) => b.hasRealData).map((b) => b.slug))

/**
 * Load all brand summaries for ranking. Real-data brands fetch from public/data.
 * Mock brands use deterministic generator.
 */
export async function loadRanking(currentBrand?: string): Promise<RankingItem[]> {
  const items: RankingItem[] = []

  await Promise.all(
    BRANDS.map(async (b) => {
      try {
        if (REAL_DATA_BRANDS.has(b.slug)) {
          const resp = await fetch(`/data/${encodeURIComponent(b.slug)}.json`, {
            cache: "force-cache",
          })
          if (resp.ok) {
            const data = (await resp.json()) as RawAuditData
            items.push({
              brand: b.name,
              slug: b.slug,
              score: data.stats.overall.visibility_pct,
              delta: deterministicDelta(b.slug),
              isReal: true,
            })
            return
          }
        }
      } catch {
        // fall through
      }
      const mock = generateMockReport(b.slug)
      items.push({
        brand: b.name,
        slug: b.slug,
        score: mock.stats.overall.visibility_pct,
        delta: deterministicDelta(b.slug),
        isReal: false,
      })
    })
  )

  return items.sort((a, b) => b.score - a.score)
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function deterministicDelta(brand: string): number {
  const h = hashCode(brand + "delta")
  const r = (h % 1000) / 1000 // 0..1
  // distribute: 30% up, 30% down, 40% flat
  const signed = (r - 0.5) * 12 // -6 .. +6
  return Math.round(signed * 10) / 10
}
