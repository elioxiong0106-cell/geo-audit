"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RawAuditData } from "@/lib/mock/types"
import { SAMPLE_CITATIONS, type SampleSource } from "@/lib/mock/citations-sample"

const MODEL_COUNT = 6

export default function CitationsTab({ data }: { data: RawAuditData }) {
  const citation = SAMPLE_CITATIONS[data.brand]
  const [active, setActive] = useState<SampleSource | null>(null)

  if (!citation) {
    return (
      <div className="space-y-6 max-w-7xl">
        <Header brand={data.brand} />
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500 text-sm">
          暂无该品牌的引用源数据
        </div>
      </div>
    )
  }

  const { sources, ownedCount, earnedCount } = citation
  const maxCount = sources[0]?.count || 1
  const totalDomains = sources.length

  return (
    <div className="space-y-6 max-w-7xl">
      <Header brand={data.brand} />

      {/* Breakdown bar */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-base font-semibold">引用源构成</h3>
          <SampleBadge />
        </div>
        <p className="text-sm text-zinc-500 mb-5">
          从 {MODEL_COUNT} 个 AI 模型回答中提取，共 {totalDomains} 个独立域名
        </p>

        <div className="h-3 rounded-full overflow-hidden flex mb-4 bg-zinc-800">
          <div
            className="bg-sky-500 transition-all"
            style={{ width: `${(earnedCount / totalDomains) * 100}%` }}
          />
          <div
            className="bg-emerald-500 transition-all"
            style={{ width: `${(ownedCount / totalDomains) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-zinc-300">Earned · 自然引用</span>
            <span className="text-zinc-500 font-mono">{earnedCount} 个</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-300">Owned · 自有域名</span>
            <span className="text-zinc-500 font-mono">{ownedCount} 个</span>
          </div>
        </div>
      </div>

      {/* Domain table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-5">
          <h3 className="text-base font-semibold mb-1">引用域名 Top {totalDomains}</h3>
          <p className="text-sm text-zinc-500">点击查看来源详情</p>
        </div>

        <div className="grid grid-cols-[32px_1fr_80px_200px] gap-4 text-[11px] uppercase tracking-widest text-zinc-500 pb-3 border-b border-zinc-800 mb-1">
          <span>#</span>
          <span>Domain</span>
          <span className="text-right">引用次数</span>
          <span></span>
        </div>

        {sources.map((item, i) => (
          <button
            key={item.domain}
            onClick={() => setActive(item)}
            className="grid grid-cols-[32px_1fr_80px_200px] gap-4 items-center py-3 hover:bg-zinc-800/30 -mx-2 px-2 rounded transition w-full text-left border-b border-zinc-900 last:border-0"
          >
            <span className="text-sm text-zinc-500 font-mono">{i + 1}</span>
            <div className="flex items-center gap-3 min-w-0">
              <Favicon domain={item.domain} />
              <span className="text-sm text-zinc-200 truncate">{item.domain}</span>
              {item.type === "Owned" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  Owned
                </span>
              )}
              {item.type === "Earned" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                  Earned
                </span>
              )}
            </div>
            <span className="text-sm font-mono text-right text-zinc-300">{item.count}</span>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  item.type === "Owned" ? "bg-emerald-500" : "bg-sky-500"
                )}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <Favicon domain={active.domain} />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">引用域名</div>
                    <div className="text-base font-semibold">{active.domain}</div>
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="p-2 text-zinc-500 hover:text-white transition rounded hover:bg-zinc-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="引用次数" value={String(active.count)} />
                  <Stat label="类型" value={active.type} color={active.type === "Owned" ? "text-emerald-400" : "text-sky-400"} />
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">类型说明</div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {active.type === "Owned"
                      ? `这是 ${data.brand} 自有域名。AI 直接引用品牌官网，代表权威信息源。建议在此持续发布高质量内容。`
                      : `第三方平台。AI 在回答品类问题时自然引用了这个网站。在这里发布内容有助于提升 AI 中的品牌曝光。`}
                  </p>
                </div>
                <a href={`https://${active.domain}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition">
                  <ExternalLink className="w-3.5 h-3.5" />
                  访问 {active.domain}
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Header({ brand }: { brand: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">引用源</h1>
        <p className="text-sm text-zinc-500">
          AI 在回答关于「{brand}」品类问题时最常引用的外部网站——在这些平台发布内容可提升 AI 中的品牌曝光。
        </p>
      </div>
      <SampleBadge />
    </div>
  )
}

function SampleBadge() {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] shrink-0 whitespace-nowrap">
      <FlaskConical className="w-3 h-3" />
      示例数据
    </div>
  )
}

function Favicon({ domain }: { domain: string }) {
  return (
    <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
        alt="" width={16} height={16} className="w-4 h-4" loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
      />
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">{label}</div>
      <div className={cn("text-base font-semibold font-mono", color || "text-white")}>{value}</div>
    </div>
  )
}
