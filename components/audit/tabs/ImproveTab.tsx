"use client"

import type { RawAuditData } from "@/lib/mock/types"
import { Lightbulb, CheckSquare, Square, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AISuggestion {
  title: string
  impact: 1 | 2 | 3 | 4 | 5
  ease: 1 | 2 | 3 | 4 | 5
  diagnosis: string
  actions: string[]
  channels?: string[]
}

interface SuggestionsCache {
  brand: string
  generated_at: string
  model: string
  suggestions: AISuggestion[]
}

// Legacy shape from buildRecommendations
interface Recommendation {
  impact: 1 | 2 | 3 | 4 | 5
  effort: 1 | 2 | 3 | 4 | 5
  title: string
  description: string
  steps: string[]
  domain?: string
}

// ─── Dots meter ───────────────────────────────────────────────────────────────

function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
      <span>{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={cn("w-1.5 h-1.5 rounded-full", i < value ? "bg-violet-400" : "bg-zinc-800")} />
        ))}
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function SuggestionCard({
  index,
  title,
  impact,
  ease,
  diagnosis,
  steps,
  channels,
  done,
  onToggle,
}: {
  index: number
  title: string
  impact: number
  ease: number
  diagnosis: string
  steps: string[]
  channels?: string[]
  done: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-9 h-9 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <Meter value={impact} label="影响" />
            <span className="text-zinc-700">·</span>
            <Meter value={ease} label="易实施" />
          </div>
          <h3 className="text-base font-semibold mb-2">{title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{diagnosis}</p>
        </div>
      </div>

      <div className="ml-13 pl-13 mt-4 pt-4 border-t border-zinc-800">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">行动步骤</div>
        <div className="space-y-2">
          {steps.map((step, j) => {
            const key = `${index}-${j}`
            const checked = !!done[key]
            return (
              <button
                key={j}
                onClick={() => onToggle(key)}
                className="w-full flex items-start gap-3 text-sm text-zinc-300 hover:text-white transition text-left"
              >
                {checked
                  ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  : <Square className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />}
                <span className={checked ? "line-through text-zinc-600" : ""}>{step}</span>
              </button>
            )
          })}
        </div>
        {channels && channels.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs flex-wrap">
            <span className="text-zinc-500">相关投放渠道:</span>
            {channels.map((ch) => (
              <span key={ch} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {ch}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Fallback: rule-based recommendations ─────────────────────────────────────

function buildFallback(data: RawAuditData): Recommendation[] {
  const recs: Recommendation[] = []
  const byIntent = data.stats.by_intent

  const scenarioVis = byIntent.scenario?.visibility_pct || 0
  if (scenarioVis < 50) {
    recs.push({
      impact: 5, effort: 2,
      title: "补齐「真实场景」类内容的品牌植入",
      description: `品牌在场景型问题上的可见度仅 ${scenarioVis.toFixed(0)}%。用户描述真实需求时几乎没有想到你——这是 AI 推荐能力的最大缺口。`,
      steps: ["梳理 scenario 类未提及的具体问题，提取场景关键词", "围绕 5-10 个高频场景创作小红书 / 知乎长文", "在文中自然提及品牌名 + 差异化卖点"],
      domain: "xiaohongshu.com / zhihu.com",
    })
  }

  const categoryVis = byIntent.category?.visibility_pct || 0
  if (categoryVis < 80) {
    recs.push({
      impact: 4, effort: 3,
      title: "在品类型问题中提高被主动推荐的概率",
      description: `用户问「哪个 App 好用」这类品类问题时，AI 提及你的比例只有 ${categoryVis.toFixed(0)}%。`,
      steps: ["在权威媒体或评测博客中争取品类对比文章的出现位置", "确保官网在 AI 联网搜索中可被检索", "优化结构化元数据"],
    })
  }

  const modelScores = Object.entries(data.stats.by_model).sort(
    (a, b) => (b[1]?.visibility_pct || 0) - (a[1]?.visibility_pct || 0)
  )
  if (modelScores.length >= 2) {
    const best = modelScores[0]
    const worst = modelScores[modelScores.length - 1]
    const gap = (best[1]?.visibility_pct || 0) - (worst[1]?.visibility_pct || 0)
    if (gap > 10) {
      recs.push({
        impact: 3, effort: 4,
        title: `在 ${worst[0]} 上扩大品牌召回`,
        description: `品牌在 ${best[0]} 上可见度 ${(best[1]?.visibility_pct || 0).toFixed(0)}%，但在 ${worst[0]} 上只有 ${(worst[1]?.visibility_pct || 0).toFixed(0)}%，差距 ${gap.toFixed(0)} 个百分点。`,
        steps: [`分析 ${worst[0]} 在该品类高频引用的网站`, "在目标网站投放品牌内容 / 合作植入", "持续监控，3 周后复测"],
      })
    }
  }

  recs.push({
    impact: 4, effort: 5,
    title: "让 AI 把你的官网当成权威信息源",
    description: "当前引用源中，品牌官网的引用比例很低——AI 在「了解你」时主要依赖第三方报道。",
    steps: ["为关键产品页面补充结构化数据 (Schema.org)", "在 robots.txt 中允许 AI 爬虫（GPTBot / ClaudeBot）", "建立产品 FAQ 页，直接回答用户高频问题"],
    domain: "你的官网",
  })

  return recs
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImproveTab({ data }: { data: RawAuditData }) {
  const [cache, setCache] = useState<SuggestionsCache | null>(null)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`/data/${encodeURIComponent(data.brand)}_suggestions.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => { setCache(json); setLoading(false) })
      .catch(() => setLoading(false))
  }, [data.brand])

  const toggle = (key: string) => setDone((d) => ({ ...d, [key]: !d[key] }))

  // While fetching
  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <Header />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/30 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // AI-generated suggestions
  if (cache) {
    return (
      <div className="space-y-6 max-w-7xl">
        <Header ai generatedAt={cache.generated_at} model={cache.model} />
        <div className="space-y-4">
          {cache.suggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              index={i}
              title={s.title}
              impact={s.impact}
              ease={s.ease}
              diagnosis={s.diagnosis}
              steps={s.actions}
              channels={s.channels}
              done={done}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>
    )
  }

  // Fallback: rule-based
  const recs = buildFallback(data)
  return (
    <div className="space-y-6 max-w-7xl">
      <Header />
      <div className="space-y-4">
        {recs.map((r, i) => (
          <SuggestionCard
            key={i}
            index={i}
            title={r.title}
            impact={r.impact}
            ease={6 - r.effort as 1 | 2 | 3 | 4 | 5}
            diagnosis={r.description}
            steps={r.steps}
            channels={r.domain ? [r.domain] : undefined}
            done={done}
            onToggle={toggle}
          />
        ))}
      </div>
      <div className="text-center text-xs text-zinc-600 pt-6">
        建议基于规则自动生成 · 可运行 generate_suggestions.py 获取 AI 定制建议
      </div>
    </div>
  )
}

function Header({ ai, generatedAt, model }: { ai?: boolean; generatedAt?: string; model?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">优化建议</h1>
        <p className="text-sm text-zinc-500">
          基于本次审计数据的 GEO 优化方向，按影响力 × 易实施度排序
        </p>
      </div>
      {ai && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[11px] shrink-0 whitespace-nowrap">
          <Sparkles className="w-3 h-3" />
          AI 生成
        </div>
      )}
    </div>
  )
}
