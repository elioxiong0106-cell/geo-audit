import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GEO Audit · AI 搜索可见度审计",
  description:
    "量化品牌在豆包、千问、DeepSeek 中的可见度。灵感来源于 Profound 的 Answer Engine Insights 模块，聚焦中国 AI 搜索生态。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  )
}
