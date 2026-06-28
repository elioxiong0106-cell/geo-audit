"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { BRANDS } from "@/lib/mock/brands"

const ROTATING_MODELS = [
  "豆包",
  "千问",
  "DeepSeek",
  "Kimi",
  "文心一言",
  "智谱清言",
  "MiniMax",
]

export default function Home() {
  const router = useRouter()
  const [modelIdx, setModelIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [brand, setBrand] = useState("")
  const [showSuggest, setShowSuggest] = useState(false)
  const inputWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setModelIdx((i) => (i + 1) % ROTATING_MODELS.length)
        setFading(false)
      }, 400)
    }, 1500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputWrapRef.current && !inputWrapRef.current.contains(e.target as Node)) {
        setShowSuggest(false)
      }
    }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])

  function submit(target?: string) {
    const value = (target || brand).trim()
    if (!value) return
    sessionStorage.setItem("geo_show_loading", "1")
    router.push(`/audit/${encodeURIComponent(value)}`)
  }

  const filteredBrands = brand
    ? BRANDS.filter((b) => b.name.toLowerCase().includes(brand.toLowerCase()))
    : BRANDS

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="h-16 px-6 md:px-10 flex items-center justify-between border-b border-zinc-900">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-xs font-bold">
            G
          </div>
          <span className="font-semibold tracking-tight">GEO AI搜索可见性分析</span>
        </Link>
        <div className="flex items-center gap-1 md:gap-3">
          <Link
            href="/methodology"
            className="text-sm text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-md hover:bg-zinc-900"
          >
            评估方法
          </Link>
          <Link
            href={`/audit/${encodeURIComponent("携程")}`}
            onClick={() => sessionStorage.setItem("geo_show_loading", "1")}
            className="text-sm text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-md hover:bg-zinc-900"
          >
            示例报告
          </Link>
          <button
            onClick={() => submit("携程")}
            className="ml-2 text-sm font-medium bg-white text-black px-4 py-1.5 rounded-md hover:bg-zinc-100 transition"
          >
            体验 Demo
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-semibold tracking-tight text-5xl md:text-7xl leading-[1.05] mb-8 max-w-4xl">
          让你的品牌
          <br />
          赢在{" "}
          <span
            className="inline-block min-w-[3em] text-center"
            style={{
              textShadow:
                "0 0 60px rgba(255,255,255,0.45), 0 0 120px rgba(167,139,250,0.25)",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.4s ease-in-out",
            }}
          >
            {ROTATING_MODELS[modelIdx]}
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          量化品牌在 AI 中的可见度、引用源与行业表现。
        </p>

        <div ref={inputWrapRef} className="relative w-full max-w-md mb-6">
          <input
            type="text"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value)
              setShowSuggest(true)
            }}
            onFocus={() => setShowSuggest(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit()
            }}
            placeholder="输入品牌名，如 携程、智行..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white text-base placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 transition"
          />
          {showSuggest && filteredBrands.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1.5 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden z-10 shadow-2xl">
              {filteredBrands.map((b) => (
                <li
                  key={b.slug}
                  onClick={() => submit(b.slug)}
                  className="px-4 py-2.5 cursor-pointer hover:bg-zinc-900 transition flex items-center justify-between border-b border-zinc-900"
                >
                  <div className="text-left">
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-zinc-500">{b.description}</div>
                  </div>
                </li>
              ))}
              <li className="px-4 py-2.5 text-xs text-zinc-600 select-none">
                其他品牌（待接入）
              </li>
            </ul>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <button
            onClick={() => { sessionStorage.setItem("geo_show_loading", "1"); router.push("/audit/" + encodeURIComponent("携程")) }}
            className="inline-flex items-center gap-1.5 bg-white text-black font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-zinc-100 transition"
          >
            <Sparkles className="w-4 h-4" />
            查看示例 (携程)
          </button>
          <Link
            href="/methodology"
            className="text-sm text-zinc-400 hover:text-white transition px-5 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700"
          >
            查看评估方法
          </Link>
        </div>

        <p className="text-xs text-zinc-600 mt-4">产品 Demo · 部分为 Mock 数据</p>
      </main>

    </div>
  )
}
