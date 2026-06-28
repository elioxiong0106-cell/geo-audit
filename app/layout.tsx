import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GEO AI搜索可见性分析",
  description:
    "量化品牌在豆包、千问、DeepSeek、Kimi 等国产 AI 中的可见度、引用源与行业表现。",
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
