"use client"

import Link from "next/link"
import { ArrowLeft, Code2, Workflow, FileText } from "lucide-react"

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="h-16 px-6 md:px-10 flex items-center justify-between border-b border-zinc-900">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-xs font-bold">
            G
          </div>
          <span className="font-semibold tracking-tight">GEO AI搜索可见性分析</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-md hover:bg-zinc-900"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-16">
          <div className="text-xs text-violet-400 uppercase tracking-widest mb-3">
            Methodology
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-5">
            评估方法
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            AI 搜索可见性分析（GEO）是一个聚焦的实验性工具，希望量化品牌在中国 AI 搜索（豆包 / 千问 / DeepSeek 等）中的可见度。
          </p>
        </div>

        {/* Workflow */}
        <Section icon={Workflow} title="AI 搜索可见性流程">
          <ol className="space-y-6">
            <Step n={1} title="意图扩展 (Query Fanout)">
              输入品牌名 + 品类描述,用 qwen-plus 生成 30 个真实用户视角的提问,按四类用户意图严格分桶:
              direct(用户点名问)、category(问品类)、comparison(问对比)、scenario(只描述需求场景)。
              Query Library 按品类模板化设计,可按需扩展题量与品类。
            </Step>
            <Step n={2} title="多模型并行评测">
              30 题分别发送至豆包、千问、DeepSeek 三个国产大模型,30 题 × 3 模型 = 90 组品牌可见度样本;
              通过 ThreadPoolExecutor 并发调用,一轮审计约 10 分钟内完成,支持快速迭代。
            </Step>
            <Step n={3} title="LLM-as-judge 可见度评分">
              每个回答交由 qwen-plus 按 0/25/50/75/100 五档评估品牌可见度,将开放式回答转化为可量化、可对比的结构化分数:
              <div className="mt-2 space-y-1 text-xs">
                <Row k="0"   v="未提及" />
                <Row k="25"  v="简短提及,一笔带过" />
                <Row k="50"  v="中性提及,与其他品牌并列" />
                <Row k="75"  v="有正面评价,但非首选" />
                <Row k="100" v="主动推荐 / 列为首选" />
              </div>
            </Step>
            <Step n={4} title="联网搜索引用源">
              对 category 类问题额外调用 DashScope 的 enable_search 接口,抓取 AI 联网时实际引用的网页
              (title / url / site_name),还原「AI 了解这个品牌时,到底在引用谁」。
              当前 Demo 的引用源为<span className="text-amber-400">示例数据</span>,生产实现需对每题触发联网检索并解析实际返回的引用域名。
            </Step>
            <Step n={5} title="聚合统计与缺口诊断">
              将所有评分按「意图分桶 / 模型 / 总体」三个维度聚合,产出各维度的可见度 % 与均分。
              <p className="mt-3 text-zinc-300">
                核心诊断:对比 <span className="text-violet-300 font-medium">direct</span>（用户点名问）与{" "}
                <span className="text-rose-300 font-medium">scenario</span>（用户只描述需求）的得分差——
                点名问是送分题,真正考验品牌的是,当用户不知道用谁、只描述场景时,AI 还会不会主动推荐你。
                这个差值,就是品牌在真实搜索下的<strong className="text-white">可见度缺口</strong>。
              </p>
            </Step>
          </ol>
        </Section>

        {/* Production gap */}
        <Section icon={FileText} title="Demo vs 生产实现的差距">
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 text-[11px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="text-left px-4 py-2.5">维度</th>
                  <th className="text-left px-4 py-2.5">当前 Demo</th>
                  <th className="text-left px-4 py-2.5">生产实现</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {[
                  ["采样策略", "每题单次调用", "每题多次采样取均值,并报告波动区间,消除 LLM 输出的随机性"],
                  ["品牌识别", "关键词字面匹配", "覆盖品牌的简称、别名、英文名与常见错写,避免漏判"],
                  ["任务调度", "同步阻塞调用", "异步任务队列,支撑高并发的批量审计"],
                  ["数据存储", "本地 JSON 缓存", "持久化数据库,支持历史查询与趋势回溯"],
                  ["持续追踪", "单次快照", "每日定时复跑,形成可见度时间序列"],
                  ["覆盖范围", "缓存 5 个 OTA 品牌真实数据用于演示", "全量品牌库 + 用户自定义品牌输入"],
                  ["引用源获取", "示例数据占位", "对每题触发联网检索,解析模型实际返回的引用域名并聚合"],
                  ["评分一致性", "单模型 LLM 打分", "多评委交叉打分 + 定期人工抽检校准,降低评分偏差"],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-zinc-900">
                    <td className="px-4 py-2.5 text-zinc-500 whitespace-nowrap">{row[0]}</td>
                    <td className="px-4 py-2.5 text-zinc-300">{row[1]}</td>
                    <td className="px-4 py-2.5 text-emerald-300">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Tech stack */}
        <Section icon={Code2} title="技术栈">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Tech name="Python 3.11" desc="后端管道" />
            <Tech name="OpenAI SDK" desc="OpenAI 兼容接口" />
            <Tech name="DashScope SDK" desc="百炼 native 搜索 API" />
            <Tech name="火山方舟" desc="豆包模型" />
            <Tech name="阿里百炼" desc="千问 + DeepSeek 托管" />
            <Tech name="ThreadPoolExecutor" desc="多题并行" />
            <Tech name="Next.js 14" desc="前端 (App Router)" />
            <Tech name="Recharts + framer-motion" desc="可视化 + 动效" />
          </div>
        </Section>

        <div className="mt-16 pt-8 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-600">
          <span>Made by an AI PM · 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/audit/example" className="hover:text-white transition">
              查看示例审计
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-violet-300" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="text-sm text-zinc-300 leading-relaxed pl-12">{children}</div>
    </section>
  )
}

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-3">
      <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono-num flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </span>
      <div>
        <div className="text-base font-semibold mb-1">{title}</div>
        <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
      </div>
    </li>
  )
}

function Bucket({
  label,
  count,
  desc,
  color,
}: {
  label: string
  count: number
  desc: string
  color: string
}) {
  const colorMap: Record<string, string> = {
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-300",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    sky: "bg-sky-500/10 border-sky-500/20 text-sky-300",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-300",
  }
  return (
    <div className={`rounded-md border p-2 ${colorMap[color]}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="font-mono-num text-sm font-semibold">
        {count} <span className="text-[10px] opacity-70">题</span>
      </div>
      <div className="text-[10px] opacity-80">{desc}</div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono-num text-zinc-500 w-8">{k}</span>
      <span className="text-zinc-400">{v}</span>
    </div>
  )
}

function Tech({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/30 px-3 py-2">
      <div className="text-sm font-medium">{name}</div>
      <div className="text-[11px] text-zinc-500">{desc}</div>
    </div>
  )
}
