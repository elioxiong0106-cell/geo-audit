"use client"

import { useEffect, useState } from "react"
import Dashboard from "@/components/audit/Dashboard"
import { loadAuditData } from "@/lib/data/loader"
import type { RawAuditData } from "@/lib/mock/types"
import { Loader2 } from "lucide-react"

export default function ExamplePage() {
  const [data, setData] = useState<RawAuditData | null>(null)
  const [isReal, setIsReal] = useState(false)

  useEffect(() => {
    loadAuditData("携程").then(({ data, isReal }) => {
      setData(data)
      setIsReal(isReal)
    })
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500 gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        加载示例审计...
      </div>
    )
  }

  return <Dashboard data={data} isReal={isReal} brand="携程" />
}
