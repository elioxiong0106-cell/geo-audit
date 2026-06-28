export type CitationType = "Earned" | "Operated" | "Owned"

export interface CitationDomain {
  rank: number
  domain: string
  mentions: number
  type: CitationType
}

// Per-brand curated lists. Each brand gets a believable mix of:
//  - Owned (brand's own domains)
//  - Operated (PR/agency channels)
//  - Earned (third-party media/UGC)
// Numbers descend so the bar chart looks like a real long-tail.
const BRAND_CITATIONS: Record<string, CitationDomain[]> = {
  携程: [
    { rank: 1, domain: "ctrip.com", mentions: 2845, type: "Owned" },
    { rank: 2, domain: "xiaohongshu.com", mentions: 2156, type: "Earned" },
    { rank: 3, domain: "mafengwo.cn", mentions: 1788, type: "Earned" },
    { rank: 4, domain: "zhihu.com", mentions: 1542, type: "Earned" },
    { rank: 5, domain: "qyer.com", mentions: 1245, type: "Earned" },
    { rank: 6, domain: "trip.com", mentions: 1068, type: "Owned" },
    { rank: 7, domain: "douban.com", mentions: 856, type: "Earned" },
    { rank: 8, domain: "weibo.com", mentions: 724, type: "Earned" },
    { rank: 9, domain: "tieba.baidu.com", mentions: 612, type: "Earned" },
    { rank: 10, domain: "elong.com", mentions: 498, type: "Owned" },
    { rank: 11, domain: "36kr.com", mentions: 412, type: "Operated" },
    { rank: 12, domain: "huxiu.com", mentions: 356, type: "Operated" },
    { rank: 13, domain: "bilibili.com", mentions: 287, type: "Earned" },
    { rank: 14, domain: "toutiao.com", mentions: 245, type: "Earned" },
    { rank: 15, domain: "sohu.com", mentions: 198, type: "Earned" },
    { rank: 16, domain: "baijiahao.baidu.com", mentions: 165, type: "Earned" },
    { rank: 17, domain: "ifeng.com", mentions: 132, type: "Earned" },
    { rank: 18, domain: "sina.com.cn", mentions: 112, type: "Earned" },
    { rank: 19, domain: "thepaper.cn", mentions: 96, type: "Earned" },
    { rank: 20, domain: "qq.com", mentions: 78, type: "Earned" },
  ],
  去哪儿: [
    { rank: 1, domain: "qunar.com", mentions: 2412, type: "Owned" },
    { rank: 2, domain: "xiaohongshu.com", mentions: 1876, type: "Earned" },
    { rank: 3, domain: "mafengwo.cn", mentions: 1542, type: "Earned" },
    { rank: 4, domain: "ctrip.com", mentions: 1245, type: "Earned" },
    { rank: 5, domain: "zhihu.com", mentions: 1098, type: "Earned" },
    { rank: 6, domain: "qyer.com", mentions: 856, type: "Earned" },
    { rank: 7, domain: "douban.com", mentions: 712, type: "Earned" },
    { rank: 8, domain: "weibo.com", mentions: 624, type: "Earned" },
    { rank: 9, domain: "tieba.baidu.com", mentions: 498, type: "Earned" },
    { rank: 10, domain: "toutiao.com", mentions: 412, type: "Earned" },
    { rank: 11, domain: "36kr.com", mentions: 356, type: "Operated" },
    { rank: 12, domain: "huxiu.com", mentions: 287, type: "Operated" },
    { rank: 13, domain: "bilibili.com", mentions: 245, type: "Earned" },
    { rank: 14, domain: "sohu.com", mentions: 198, type: "Earned" },
    { rank: 15, domain: "baijiahao.baidu.com", mentions: 165, type: "Earned" },
    { rank: 16, domain: "ifeng.com", mentions: 132, type: "Earned" },
    { rank: 17, domain: "sina.com.cn", mentions: 112, type: "Earned" },
    { rank: 18, domain: "thepaper.cn", mentions: 96, type: "Earned" },
    { rank: 19, domain: "qq.com", mentions: 82, type: "Earned" },
    { rank: 20, domain: "163.com", mentions: 65, type: "Earned" },
  ],
  智行: [
    { rank: 1, domain: "12306.cn", mentions: 1985, type: "Earned" },
    { rank: 2, domain: "zhixing.com", mentions: 1456, type: "Owned" },
    { rank: 3, domain: "xiaohongshu.com", mentions: 1186, type: "Earned" },
    { rank: 4, domain: "ctrip.com", mentions: 956, type: "Earned" },
    { rank: 5, domain: "zhihu.com", mentions: 814, type: "Earned" },
    { rank: 6, domain: "qunar.com", mentions: 670, type: "Earned" },
    { rank: 7, domain: "mafengwo.cn", mentions: 542, type: "Earned" },
    { rank: 8, domain: "weibo.com", mentions: 478, type: "Earned" },
    { rank: 9, domain: "tieba.baidu.com", mentions: 412, type: "Earned" },
    { rank: 10, domain: "toutiao.com", mentions: 356, type: "Earned" },
    { rank: 11, domain: "douban.com", mentions: 287, type: "Earned" },
    { rank: 12, domain: "bilibili.com", mentions: 245, type: "Earned" },
    { rank: 13, domain: "36kr.com", mentions: 198, type: "Operated" },
    { rank: 14, domain: "huxiu.com", mentions: 156, type: "Operated" },
    { rank: 15, domain: "baijiahao.baidu.com", mentions: 132, type: "Earned" },
    { rank: 16, domain: "sohu.com", mentions: 108, type: "Earned" },
    { rank: 17, domain: "ifeng.com", mentions: 92, type: "Earned" },
    { rank: 18, domain: "thepaper.cn", mentions: 78, type: "Earned" },
    { rank: 19, domain: "sina.com.cn", mentions: 65, type: "Earned" },
    { rank: 20, domain: "qq.com", mentions: 54, type: "Earned" },
  ],
  飞猪: [
    { rank: 1, domain: "fliggy.com", mentions: 2125, type: "Owned" },
    { rank: 2, domain: "xiaohongshu.com", mentions: 1654, type: "Earned" },
    { rank: 3, domain: "alitrip.com", mentions: 1342, type: "Owned" },
    { rank: 4, domain: "mafengwo.cn", mentions: 1098, type: "Earned" },
    { rank: 5, domain: "zhihu.com", mentions: 924, type: "Earned" },
    { rank: 6, domain: "ctrip.com", mentions: 786, type: "Earned" },
    { rank: 7, domain: "qyer.com", mentions: 648, type: "Earned" },
    { rank: 8, domain: "weibo.com", mentions: 524, type: "Earned" },
    { rank: 9, domain: "douban.com", mentions: 412, type: "Earned" },
    { rank: 10, domain: "taobao.com", mentions: 365, type: "Operated" },
    { rank: 11, domain: "tmall.com", mentions: 312, type: "Operated" },
    { rank: 12, domain: "tieba.baidu.com", mentions: 256, type: "Earned" },
    { rank: 13, domain: "toutiao.com", mentions: 218, type: "Earned" },
    { rank: 14, domain: "bilibili.com", mentions: 178, type: "Earned" },
    { rank: 15, domain: "36kr.com", mentions: 142, type: "Operated" },
    { rank: 16, domain: "sohu.com", mentions: 118, type: "Earned" },
    { rank: 17, domain: "huxiu.com", mentions: 95, type: "Operated" },
    { rank: 18, domain: "baijiahao.baidu.com", mentions: 82, type: "Earned" },
    { rank: 19, domain: "sina.com.cn", mentions: 70, type: "Earned" },
    { rank: 20, domain: "ifeng.com", mentions: 58, type: "Earned" },
  ],
  同程旅行: [
    { rank: 1, domain: "ly.com", mentions: 1875, type: "Owned" },
    { rank: 2, domain: "xiaohongshu.com", mentions: 1432, type: "Earned" },
    { rank: 3, domain: "weixin.qq.com", mentions: 1186, type: "Operated" },
    { rank: 4, domain: "ctrip.com", mentions: 924, type: "Earned" },
    { rank: 5, domain: "mafengwo.cn", mentions: 786, type: "Earned" },
    { rank: 6, domain: "zhihu.com", mentions: 648, type: "Earned" },
    { rank: 7, domain: "qunar.com", mentions: 524, type: "Earned" },
    { rank: 8, domain: "weibo.com", mentions: 442, type: "Earned" },
    { rank: 9, domain: "qyer.com", mentions: 368, type: "Earned" },
    { rank: 10, domain: "douban.com", mentions: 298, type: "Earned" },
    { rank: 11, domain: "toutiao.com", mentions: 246, type: "Earned" },
    { rank: 12, domain: "tieba.baidu.com", mentions: 198, type: "Earned" },
    { rank: 13, domain: "36kr.com", mentions: 165, type: "Operated" },
    { rank: 14, domain: "huxiu.com", mentions: 132, type: "Operated" },
    { rank: 15, domain: "bilibili.com", mentions: 112, type: "Earned" },
    { rank: 16, domain: "sohu.com", mentions: 92, type: "Earned" },
    { rank: 17, domain: "baijiahao.baidu.com", mentions: 78, type: "Earned" },
    { rank: 18, domain: "ifeng.com", mentions: 65, type: "Earned" },
    { rank: 19, domain: "sina.com.cn", mentions: 54, type: "Earned" },
    { rank: 20, domain: "qq.com", mentions: 45, type: "Earned" },
  ],
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// Deterministic citation list for any brand.
// Whitelisted brands return the curated list; unknown brands get a generic template.
export function getCitations(brand: string): CitationDomain[] {
  if (BRAND_CITATIONS[brand]) return BRAND_CITATIONS[brand]

  // Fallback: derive a generic list deterministically
  const seed = hashCode(brand)
  const ownDomain = `${brand.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`
  const base: CitationDomain[] = [
    { rank: 1, domain: ownDomain, mentions: 1800 + (seed % 800), type: "Owned" },
    { rank: 2, domain: "xiaohongshu.com", mentions: 1500 + (seed % 600), type: "Earned" },
    { rank: 3, domain: "mafengwo.cn", mentions: 1200 + (seed % 500), type: "Earned" },
    { rank: 4, domain: "zhihu.com", mentions: 900 + (seed % 400), type: "Earned" },
    { rank: 5, domain: "qyer.com", mentions: 700 + (seed % 300), type: "Earned" },
    { rank: 6, domain: "ctrip.com", mentions: 600 + (seed % 250), type: "Earned" },
    { rank: 7, domain: "douban.com", mentions: 500 + (seed % 200), type: "Earned" },
    { rank: 8, domain: "weibo.com", mentions: 400 + (seed % 180), type: "Earned" },
    { rank: 9, domain: "bilibili.com", mentions: 350 + (seed % 150), type: "Earned" },
    { rank: 10, domain: "toutiao.com", mentions: 300 + (seed % 130), type: "Earned" },
    { rank: 11, domain: "36kr.com", mentions: 250 + (seed % 110), type: "Operated" },
    { rank: 12, domain: "huxiu.com", mentions: 200 + (seed % 90), type: "Operated" },
    { rank: 13, domain: "sohu.com", mentions: 180 + (seed % 80), type: "Earned" },
    { rank: 14, domain: "thepaper.cn", mentions: 150 + (seed % 70), type: "Earned" },
    { rank: 15, domain: "tieba.baidu.com", mentions: 130 + (seed % 60), type: "Earned" },
    { rank: 16, domain: "ifeng.com", mentions: 110 + (seed % 50), type: "Earned" },
    { rank: 17, domain: "sina.com.cn", mentions: 95 + (seed % 40), type: "Earned" },
    { rank: 18, domain: "qq.com", mentions: 82 + (seed % 35), type: "Earned" },
    { rank: 19, domain: "163.com", mentions: 70 + (seed % 30), type: "Earned" },
    { rank: 20, domain: "baijiahao.baidu.com", mentions: 60 + (seed % 25), type: "Earned" },
  ]
  return base
}

export interface CitationBreakdown {
  earned: { count: number; pct: number }
  operated: { count: number; pct: number }
  owned: { count: number; pct: number }
  total: number
}

export function computeBreakdown(citations: CitationDomain[]): CitationBreakdown {
  let earned = 0,
    operated = 0,
    owned = 0
  citations.forEach((c) => {
    if (c.type === "Earned") earned += c.mentions
    else if (c.type === "Operated") operated += c.mentions
    else owned += c.mentions
  })
  const total = earned + operated + owned
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0)
  return {
    earned: { count: earned, pct: pct(earned) },
    operated: { count: operated, pct: pct(operated) },
    owned: { count: owned, pct: pct(owned) },
    total,
  }
}
