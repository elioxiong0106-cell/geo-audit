"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { ArrowDown, ArrowUp, TrendingUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RawAuditData } from "@/lib/mock/types"
import { buildTrend, weekOverWeekDelta } from "@/lib/data/trend"
import { loadRanking, type RankingItem } from "@/lib/data/ranking"
import { computeTopics } from "@/lib/data/topics"

export default function HomeTab({ data }: { data: RawAuditData }) {
  const overall = data.stats.overall
  const visibility = overall.visibility_pct
  const trend = useMemo(() => buildTrend(data.brand, visibility), [data.brand, visibility])
  const wow = useMemo(() => weekOverWeekDelta(trend), [trend])
  const topics = useMemo(() => computeTopics(data), [data])

  const [ranking, setRanking] = useState<RankingItem[]>([])
  useEffect(() => {
    loadRanking().then(setRanking)
  }, [])

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">品牌可见性总览</h1>
      </div>

      {/* Row 1: Visibility (2/3) + Ranking (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VisibilityCard
          value={visibility}
          wow={wow}
          trend={trend}
        />
        <RankingCard items={ranking} currentBrand={data.brand} />
      </div>
    </div>
  )
}

function VisibilityCard({
  value,
  wow,
  trend,
}: {
  value: number
  wow: number
  trend: { date: string; score: number }[]
}) {
  return (
    <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-5">
        <h3 className="text-sm text-zinc-400 mb-2">Visibility score</h3>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-semibold tracking-tight font-mono-num">
            {value.toFixed(1)}%
          </span>
          <Delta value={wow} suffix="vs 上周" />
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              stroke="#52525b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              width={38}
            />
            <Tooltip
              cursor={{ stroke: "#27272a", strokeWidth: 1 }}
              contentStyle={{
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(v) => [`${Number(v).toFixed(1)}%`, "Visibility"]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#visGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

function RankingCard({
  items,
  currentBrand,
}: {
  items: RankingItem[]
  currentBrand: string
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="text-sm text-zinc-400 mb-4">行业排行</h3>
      {items.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 rounded bg-zinc-800/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((item, i) => {
            const isOwn = item.brand === currentBrand || item.slug === currentBrand
            return (
              <div
                key={item.slug}
                className={cn(
                  "flex items-center gap-3 py-2 px-2 -mx-2 rounded-md transition",
                  isOwn && "bg-zinc-800/50 border-l-2 border-emerald-400 pl-3"
                )}
              >
                <span className="text-zinc-500 text-xs font-mono-num w-4">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-zinc-200 truncate">
                  {item.brand}
                </span>
                <DeltaSmall value={item.delta} />
                <span className="text-sm font-mono-num text-zinc-300 w-14 text-right">
                  {item.score.toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TopicCard({
  topics,
  brand,
}: {
  topics: ReturnType<typeof computeTopics>
  brand: string
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-1">{brand} 在不同话题下的 AI 可见度</h3>
        <p className="text-sm text-zinc-500">
          话题按关键词聚类生成
        </p>
      </div>
      {topics.length === 0 ? (
        <div className="text-sm text-zinc-600 py-8 text-center">
          话题数据不足
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((t) => (
            <div key={t.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300">{t.name}</span>
                </div>
                <span className="font-mono-num tabular-nums text-zinc-400">
                  {t.score.toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${t.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Delta({ value, suffix }: { value: number; suffix?: string }) {
  if (Math.abs(value) < 0.1) {
    return (
      <span className="text-xs text-zinc-500 flex items-center gap-1">
        <Minus className="w-3 h-3" />
        {suffix}
      </span>
    )
  }
  const positive = value > 0
  return (
    <span
      className={cn(
        "text-xs flex items-center gap-1",
        positive ? "text-emerald-400" : "text-rose-400"
      )}
    >
      {positive ? <TrendingUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {positive ? "+" : ""}
      {value.toFixed(1)}%{suffix && <span className="text-zinc-500 ml-1">{suffix}</span>}
    </span>
  )
}

function DeltaSmall({ value }: { value: number }) {
  if (Math.abs(value) < 0.1) {
    return (
      <span className="text-[11px] flex items-center gap-0.5 text-zinc-600 w-12 justify-end">
        →
      </span>
    )
  }
  const positive = value > 0
  return (
    <span
      className={cn(
        "text-[11px] flex items-center gap-0.5 w-12 justify-end font-mono-num",
        positive ? "text-emerald-400" : "text-rose-400"
      )}
    >
      {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}
