export interface BrandMeta {
  name: string
  slug: string
  description: string
  website: string
  category: string
  hasRealData: boolean
  logo: string
}

export const BRANDS: BrandMeta[] = [
  {
    name: "携程",
    slug: "携程",
    description: "中国最大的综合性在线旅行服务商",
    website: "ctrip.com",
    category: "国内 · 综合 OTA",
    hasRealData: true,
    logo: "/logos/ctrip.png",
  },
  {
    name: "去哪儿",
    slug: "去哪儿",
    description: "垂直搜索比价的中国 OTA",
    website: "qunar.com",
    category: "国内 · 比价工具",
    hasRealData: true,
    logo: "/logos/qunar.png",
  },
  {
    name: "智行",
    slug: "智行",
    description: "携程旗下抢票工具,主打火车票",
    website: "zhixing.com",
    category: "国内 · 火车票工具",
    hasRealData: true,
    logo: "/logos/zhixing.png",
  },
  {
    name: "飞猪",
    slug: "飞猪",
    description: "阿里旗下综合旅行服务平台",
    website: "fliggy.com",
    category: "国内 · 综合 OTA",
    hasRealData: true,
    logo: "/logos/fliggy.png",
  },
  {
    name: "同程旅行",
    slug: "同程旅行",
    description: "微信生态内主流 OTA,小程序入口强",
    website: "ly.com",
    category: "国内 · 综合 OTA",
    hasRealData: true,
    logo: "/logos/ly.png",
  },
]

export function getBrandBySlug(slug: string): BrandMeta | undefined {
  const decoded = decodeURIComponent(slug)
  return BRANDS.find((b) => b.slug === decoded || b.name.toLowerCase() === decoded.toLowerCase())
}
