"use client"

import type { RawAuditData, ModelName } from "@/lib/mock/types"
import { MODEL_LABEL, MODEL_FULL_NAME, MODEL_COLORS, ALL_MODELS } from "@/lib/mock/types"
import CountUp from "react-countup"
import { useState, useMemo } from "react"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts"

// ─── Intent dimensions (4 only, no overall / avg) ─────────────────────────────
const INTENT_DIMS = [
  { key: "direct",     label: "直接型" },
  { key: "category",   label: "品类型" },
  { key: "comparison", label: "对比型" },
  { key: "scenario",   label: "场景型" },
] as const

type IntentKey = typeof INTENT_DIMS[number]["key"]

// Per-model, per-intent visibility from results_by_question
function intentScore(m: ModelName, intent: IntentKey, data: RawAuditData): number {
  const items = data.results_by_question.filter(
    (r) => r.intent === intent && r.scores[m] !== undefined
  )
  if (!items.length) return 0
  const scores = items.map((r) => r.scores[m]?.score || 0)
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

// ─── Auto-generated insight sentence ─────────────────────────────────────────
function buildInsight(
  models: ModelName[],
  sorted: { m: ModelName; vis: number }[],
  data: RawAuditData
): string {
  if (!sorted.length) return ""
  const best = sorted[0]

  // Find intent with lowest overall visibility
  const intentVis = INTENT_DIMS.map((d) => {
    const all = models.flatMap((m) => {
      const items = data.results_by_question.filter(
        (r) => r.intent === d.key && r.scores[m] !== undefined
      )
      return items.map((r) => r.scores[m]?.score || 0)
    })
    const avg = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0
    return { key: d.key, label: d.label, avg }
  })
  const weakestIntent = intentVis.sort((a, b) => a.avg - b.avg)[0]

  // Find model with highest score on weakestIntent
  const modelOnWeak = models
    .map((m) => ({ m, s: intentScore(m, weakestIntent.key as IntentKey, data) }))
    .sort((a, b) => b.s - a.s)[0]

  // Find intent where that model scores highest
  const modelStrongIntent = INTENT_DIMS
    .map((d) => ({ label: d.label, s: intentScore(modelOnWeak.m, d.key, data) }))
    .sort((a, b) => b.s - a.s)[0]

  return (
    `${MODEL_LABEL[best.m]} 在各类意图下推荐最均衡（总体可见度 ${best.vis.toFixed(0)}%）；` +
    `${MODEL_LABEL[modelOnWeak.m]} 在${modelStrongIntent.label}上明显更倾向推荐该品牌，` +
    `但在${weakestIntent.label}上几乎不提及——这是该品牌在${weakestIntent.label}搜索下的可见度缺口。`
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ModelsTab({ data }: { data: RawAuditData }) {
  const models: ModelName[] = ALL_MODELS.filter(
    (m) => data.stats.by_model[m] && (data.stats.by_model[m]?.count ?? 0) > 0
  )

  const sorted = useMemo(
    () =>
      models
        .map((m) => ({ m, vis: data.stats.by_model[m]?.visibility_pct || 0 }))
        .sort((a, b) => b.vis - a.vis),
    [models, data]
  )
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  // Legend toggle state
  const [hidden, setHidden] = useState<Set<ModelName>>(new Set())
  const toggle = (m: ModelName) =>
    setHidden((prev) => {
      const next = new Set(prev)
      next.has(m) ? next.delete(m) : next.add(m)
      return next
    })

  // Radar data
  const radarData = INTENT_DIMS.map((d) => {
    const obj: Record<string, number | string> = { dimension: d.label }
    models.forEach((m) => {
      obj[m] = intentScore(m, d.key, data)
    })
    return obj
  })

  // Insight text
  const insight = useMemo(
    () => buildInsight(models, sorted, data),
    [models, sorted, data]
  )

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">模型对比</h1>
        <p className="text-sm text-zinc-500">同一品牌在 6 家国产 AI 上的表现差异</p>
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {models.map((m) => {
          const stat = data.stats.by_model[m]
          return (
            <div key={m} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: MODEL_COLORS[m] }} />
                <div className="text-sm font-semibold">{MODEL_LABEL[m]}</div>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mb-4 truncate">{MODEL_FULL_NAME[m]}</div>
              <div className="font-mono font-semibold text-4xl mb-1" style={{ color: MODEL_COLORS[m] }}>
                <CountUp end={stat?.visibility_pct || 0} duration={1.2} decimals={0} suffix="%" />
              </div>
              <div className="text-xs text-zinc-400 mb-3">可见度</div>
              <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wide">均分</div>
                  <div className="font-mono text-base">{stat?.avg_score.toFixed(1) || "0.0"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wide">题数</div>
                  <div className="font-mono text-base">{stat?.count || 0}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 4-dimension Radar */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
        <div className="mb-1">
          <h3 className="text-base font-semibold">四类意图下的模型表现</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-5">
          对比各模型在不同提问意图下对该品牌的推荐倾向（分值越高表现越好）
        </p>

        {/* Clickable legend */}
        <div className="flex flex-wrap gap-2 mb-5">
          {models.map((m) => {
            const isBest = m === best?.m
            const isWorst = m === worst?.m && best?.m !== worst?.m
            const isHidden = hidden.has(m)
            return (
              <button
                key={m}
                onClick={() => toggle(m)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] transition"
                style={{
                  borderColor: isHidden ? "#3f3f46" : MODEL_COLORS[m] + "66",
                  background: isHidden ? "transparent" : MODEL_COLORS[m] + "15",
                  color: isHidden ? "#52525b" : MODEL_COLORS[m],
                  opacity: isHidden ? 0.5 : 1,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: isHidden ? "#52525b" : MODEL_COLORS[m] }}
                />
                {MODEL_LABEL[m]}
                {isBest && !isHidden && <span className="text-[9px] opacity-70">最高</span>}
                {isWorst && !isHidden && <span className="text-[9px] opacity-70">最低</span>}
              </button>
            )
          })}
        </div>

        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "#d4d4d8", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#52525b", fontSize: 10 }} stroke="#27272a" />
              {models.map((m) => {
                if (hidden.has(m)) return null
                const isBest = m === best?.m
                const isWorst = m === worst?.m && best?.m !== worst?.m
                const isHighlight = isBest || isWorst
                return (
                  <Radar
                    key={m}
                    name={MODEL_LABEL[m]}
                    dataKey={m}
                    stroke={isHighlight ? MODEL_COLORS[m] : "#52525b"}
                    fill={isHighlight ? MODEL_COLORS[m] : "transparent"}
                    fillOpacity={isHighlight ? 0.18 : 0}
                    strokeWidth={isHighlight ? 2 : 1}
                    strokeOpacity={isHighlight ? 1 : 0.35}
                    dot={isHighlight}
                  />
                )
              })}
              <Tooltip
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [`${value}`, name]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Auto insight */}
        {insight && (
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
            {insight}
          </p>
        )}
      </div>

      {/* Insight block */}
      {best && worst && best.m !== worst.m && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">模型差异洞察</div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <strong className="text-white">{MODEL_LABEL[best.m]}</strong> 上的可见度最高 (
            <span className="font-mono" style={{ color: MODEL_COLORS[best.m] }}>{best.vis.toFixed(0)}%</span>)，
            <strong className="text-white"> {MODEL_LABEL[worst.m]}</strong> 上的可见度最低 (
            <span className="font-mono" style={{ color: MODEL_COLORS[worst.m] }}>{worst.vis.toFixed(0)}%</span>)，
            差距 <span className="text-amber-400 font-mono">{(best.vis - worst.vis).toFixed(0)} 个百分点</span>。
            国产 AI 的训练语料覆盖与品牌召回偏好并不一致，GEO 优化需要针对不同模型分别制定内容投放策略。
          </p>
        </div>
      )}
    </div>
  )
}
