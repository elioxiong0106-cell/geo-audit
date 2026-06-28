"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Link2 } from "lucide-react"
import type { RawAuditData } from "@/lib/mock/types"

interface Props {
  open: boolean
  onClose: () => void
  data: RawAuditData
  brand: string
  isReal: boolean
}

export default function ShareDialog({ open, onClose, data, brand, isReal }: Props) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href)
    }
  }, [open])

  function copy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <div className="text-sm font-semibold">分享 AI 可见性分析</div>
                <button
                  onClick={onClose}
                  className="text-zinc-500 hover:text-white transition p-1 rounded hover:bg-zinc-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview card */}
              <div className="p-5">
                <div className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-2xl pointer-events-none" />
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    GEO AI搜索可见性分析
                  </div>
                  <div className="text-base font-semibold mb-3">{brand}</div>
                  <div className="font-mono-num font-semibold text-3xl mb-4">
                    {data.stats.overall.visibility_pct.toFixed(1)}%
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-[11px]">
                    {(["deepseek", "minimax", "qwen", "kimi", "glm", "doubao"] as const).map((m) => (
                      <div
                        key={m}
                        className="text-center p-2 rounded bg-zinc-900/50 border border-zinc-800"
                      >
                        <div className="text-zinc-500 mb-1">
                          {m === "deepseek" ? "DeepSeek" : m === "minimax" ? "MiniMax" : m === "qwen" ? "千问" : m === "kimi" ? "Kimi" : m === "glm" ? "智谱" : "豆包"}
                        </div>
                        <div className="font-mono-num font-medium">
                          {(data.stats.by_model[m]?.visibility_pct || 0).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono truncate">
                    {url || "geo-audit.app/audit/" + brand}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={copy}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-100 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制链接
                      </>
                    )}
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-800 text-sm hover:bg-zinc-900 transition"
                  >
                    <Link2 className="w-4 h-4" />
                    打开链接
                  </a>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
