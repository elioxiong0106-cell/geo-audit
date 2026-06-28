"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { getBrandBySlug } from "@/lib/mock/brands"

interface Props {
  brand: string
  onComplete: () => void
}

export default function LoadingFlow({ brand, onComplete }: Props) {
  const [dots, setDots] = useState("")
  const brandMeta = getBrandBySlug(brand)
  const logo = brandMeta?.logo

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."))
    }, 500)
    return () => clearInterval(t)
  }, [])

  // Auto-complete after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center px-6"
    >
      {/* Brand Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10"
      >
        {logo ? (
          <Image
            src={logo}
            alt={brand}
            width={80}
            height={80}
            className="rounded-2xl"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {brand.charAt(0)}
            </span>
          </div>
        )}
      </motion.div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <p className="text-zinc-500 text-sm mb-2">
          正在收集以下内容的洞察{dots}
        </p>
        <p className="text-white text-lg font-medium tracking-wide">
          {brand}
        </p>
      </motion.div>

      {/* Subtle progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <div className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, ease: "easeInOut" }}
            className="h-full bg-zinc-600 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
