"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import LoadingFlow from "@/components/audit/LoadingFlow"
import Dashboard from "@/components/audit/Dashboard"
import { loadAuditData } from "@/lib/data/loader"
import type { RawAuditData } from "@/lib/mock/types"
import { Loader2 } from "lucide-react"

export default function AuditBrandClient() {
  const params = useParams<{ brand: string }>()
  const brandRaw = params.brand
  const brand = decodeURIComponent(brandRaw || "")

  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false
    const flag = sessionStorage.getItem("geo_show_loading")
    if (flag) {
      sessionStorage.removeItem("geo_show_loading")
      return true
    }
    return false
  })
  const [data, setData] = useState<RawAuditData | null>(null)
  const [isReal, setIsReal] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadAuditData(brand).then(({ data, isReal }) => {
      if (cancelled) return
      setData(data)
      setIsReal(isReal)
    })
    return () => { cancelled = true }
  }, [brand])

  if (loading || !data) {
    return (
      <>
        <AnimatePresence>
          {loading && (
            <LoadingFlow brand={brand} onComplete={() => setLoading(false)} />
          )}
        </AnimatePresence>
        {!loading && !data && (
          <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
          </div>
        )}
      </>
    )
  }

  return <Dashboard data={data} isReal={isReal} brand={brand} />
}
