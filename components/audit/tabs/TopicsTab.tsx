"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { RawAuditData } from "@/lib/mock/types"
import { INTENT_LABEL, MODEL_LABEL } from "@/lib/mock/types"
import {
  extractKeywords,
  computeThemes,
  type ThemeItem,
} from "@/lib/data/keywords"

// Load chart + wordcloud plugin on the client only.
const WordCloudChart = dynamic(() => import("./WordCloudChart"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-sm text-zinc-600">
      加载词云...
    </div>
  ),
})

export default function TopicsTab({ data }: { data: RawAuditData }) {
  const keywords = useMemo(() => extractKeywords(data, 28), [data])
  const themes = useMemo(() => computeThemes(data), [data])
  const [activeTheme, setActiveTheme] = useState<ThemeItem | null>(null)

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">话题表现</h1>
        <p className="text-sm text-zinc-500">{data.brand} 在 AI 搜索中不同话题下的表现</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Word cloud (2/3) */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="text-base font-semibold mb-1">Keyword Frequency</h3>
            </div>
          </div>

          <div className="h-[480px]">
            {keywords.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-zinc-600">
                关键词不足
              </div>
            ) : (
              <WordCloudChart keywords={keywords} />
            )}
          </div>
        </div>

        {/* Top themes (1/3) */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-base font-semibold mb-1">Top themes</h3>
          <p className="text-sm text-zinc-500 mb-4">
            {data.brand} 最常出现的话题
          </p>
          {themes.length === 0 ? (
            <div className="text-sm text-zinc-600 py-8 text-center">
              暂无话题数据
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {themes.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setActiveTheme(t)}
                  className="flex items-center w-full py-3 hover:bg-zinc-800/30 cursor-pointer transition -mx-2 px-2 rounded text-left"
                >
                  <span className="text-zinc-500 text-sm w-6 font-mono-num">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-zinc-200 truncate pr-2">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Theme detail drawer */}
      <ThemeDrawer
        theme={activeTheme}
        brand={data.brand}
        onClose={() => setActiveTheme(null)}
      />
    </div>
  )
}


function ThemeDrawer({
  theme,
  brand,
  onClose,
}: {
  theme: ThemeItem | null
  brand: string
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {theme && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">
                  话题详情
                </div>
                <div className="text-base font-semibold truncate">{theme.name}</div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-white transition rounded hover:bg-zinc-900 shrink-0 ml-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Stat label="提及次数" value={theme.count} />
                <Stat label="相关问题" value={theme.matched} />
                <Stat
                  label="可见度均分"
                  value={`${theme.visibility.toFixed(0)}`}
                />
              </div>

              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
                该话题下的评测问题
              </div>
              <div className="space-y-3">
                {theme.questions.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
                  >
                    <div className="text-sm text-zinc-200 mb-2 leading-relaxed">
                      {q.question}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">
                        {INTENT_LABEL[q.intent as keyof typeof INTENT_LABEL] || q.intent}
                      </span>
                      <span className="text-zinc-400">
                        最高分模型:{" "}
                        <span className="text-emerald-400 font-mono-num">
                          {MODEL_LABEL[q.topModel as keyof typeof MODEL_LABEL]} · {q.topScore}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">
        {label}
      </div>
      <div className="text-lg font-semibold font-mono-num">{value}</div>
    </div>
  )
}
