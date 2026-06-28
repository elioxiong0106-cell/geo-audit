import type { RawAuditData } from "../mock/types"
import { generateMockReport } from "../mock/generator"
import { BRANDS, getBrandBySlug } from "../mock/brands"

const REAL_DATA_BRANDS = new Set(
  BRANDS.filter((b) => b.hasRealData).map((b) => b.slug)
)

export async function loadAuditData(brandSlug: string): Promise<{
  data: RawAuditData
  isReal: boolean
}> {
  const decoded = decodeURIComponent(brandSlug)
  const meta = getBrandBySlug(decoded)
  const normalizedSlug = meta?.slug || decoded

  if (REAL_DATA_BRANDS.has(normalizedSlug)) {
    try {
      const url = `/data/${encodeURIComponent(normalizedSlug)}.json`
      const resp = await fetch(url, { cache: "no-store" })
      if (resp.ok) {
        const data = (await resp.json()) as RawAuditData
        return { data, isReal: true }
      }
    } catch {
      // fall through to mock
    }
  }

  return { data: generateMockReport(normalizedSlug), isReal: false }
}
