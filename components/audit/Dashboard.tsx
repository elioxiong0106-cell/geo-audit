"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Hash,
  Sparkles,
  AtSign,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Share2,
  Info,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { RawAuditData } from "@/lib/mock/types"
import { BRANDS } from "@/lib/mock/brands"
import { useRouter } from "next/navigation"

import HomeTab from "./tabs/HomeTab"
import TopicsTab from "./tabs/TopicsTab"
import ModelsTab from "./tabs/ModelsTab"
import CitationsTab from "./tabs/CitationsTab"
import ImproveTab from "./tabs/ImproveTab"
import ShareDialog from "./ShareDialog"

type TabId = "home" | "topics" | "models" | "citations" | "improve"

const NAV: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "品牌可见性总览", icon: Home },
  { id: "topics", label: "话题表现", icon: Hash },
  { id: "models", label: "模型对比", icon: Sparkles },
  { id: "citations", label: "引用源", icon: AtSign },
  { id: "improve", label: "优化建议", icon: TrendingUp },
]

interface Props {
  data: RawAuditData
  isReal: boolean
  brand: string
}

export default function Dashboard({ data, isReal, brand }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<TabId>("home")
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [brandSwitcherOpen, setBrandSwitcherOpen] = useState(false)

  function renderTab() {
    switch (tab) {
      case "home":
        return <HomeTab data={data} />
      case "topics":
        return <TopicsTab data={data} />
      case "models":
        return <ModelsTab data={data} />
      case "citations":
        return <CitationsTab data={data} />
      case "improve":
        return <ImproveTab data={data} />
    }
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-zinc-950 border-r border-zinc-900 flex flex-col">
        <div className="h-16 px-4 flex items-center border-b border-zinc-900">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition" title="返回首页">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-[10px] font-bold">
              G
            </div>
            <span className="text-sm font-semibold tracking-tight">GEO AI搜索可见性分析</span>
          </Link>
        </div>

        {/* Brand switcher */}
        <div className="p-3 border-b border-zinc-900 relative">
          <button
            onClick={() => setBrandSwitcherOpen((v) => !v)}
            className="w-full flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 transition rounded-md px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded bg-violet-500/20 text-violet-300 flex items-center justify-center text-[10px] font-medium shrink-0">
                {brand.charAt(0)}
              </div>
              <span className="text-sm font-medium truncate">{brand}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </button>
          {brandSwitcherOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-zinc-950 border border-zinc-800 rounded-md shadow-2xl z-30 overflow-hidden">
              {BRANDS.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => {
                    setBrandSwitcherOpen(false)
                    router.push(`/audit/${encodeURIComponent(b.slug)}`)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-900 transition flex items-center justify-between"
                >
                  <span className="truncate">{b.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((n) => {
            const Icon = n.icon
            const active = tab === n.id
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition",
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-zinc-900 px-6 flex items-center justify-between bg-black/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{brand}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />
            <span className="text-zinc-300">{NAV.find((n) => n.id === tab)?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-white transition px-2 py-1.5 rounded-md hover:bg-zinc-900 inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              返回首页
            </Link>
            <Link
              href="/methodology"
              className="text-xs text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-md hover:bg-zinc-900"
            >
              评估方法
            </Link>
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black px-3 py-1.5 rounded-md hover:bg-zinc-100 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              分享
            </button>
          </div>
        </header>

        {/* Banner */}
        {!bannerDismissed && (
          <div className="border-b border-zinc-900 bg-zinc-950">
            <div className="px-6 py-2 flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-2 min-w-0">
                <Info className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {isReal
                    ? `最后更新于 ${formatTime(data.timestamp)}`
                    : `${brand} 的审计样本由 Demo 演示数据呈现`}
                </span>
                <Link
                  href="/methodology"
                  className="text-zinc-300 hover:text-white underline-offset-4 hover:underline shrink-0"
                >
                  查看评估方法
                </Link>
              </div>
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-zinc-600 hover:text-zinc-300 shrink-0 ml-3"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Share dialog */}
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} data={data} brand={brand} isReal={isReal} />
    </div>
  )
}

function formatTime(_iso: string): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${m}/${day} 00:00`
}
