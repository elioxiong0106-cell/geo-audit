import type { RawAuditData } from "../mock/types"

// Curated phrase dictionary — domain-specific multi-character tokens
// Categories: 交通/购票工具/场景/人群/对比/财务
const PHRASE_DICT: string[] = [
  // 交通方式
  "高铁票", "火车票", "机票", "动车", "高铁", "联程票", "学生票", "团体票", "卧铺", "硬座", "二等座",
  // 购票工具/平台
  "12306", "携程", "去哪儿", "智行", "飞猪", "同程旅行", "同程", "美团", "高德", "App", "小程序",
  "购票工具", "比价工具", "抢票软件",
  // 场景
  "抢票", "买票", "订票", "改签", "退票", "候补", "退改签", "出差", "出行", "出游", "旅游", "自由行",
  "亲子游", "学生党", "通勤", "转车", "换乘", "中转", "联程",
  // 时间/节日
  "春运", "节假日", "假期", "周末", "暑假", "寒假", "国庆", "五一", "春节",
  // 人群
  "学生", "商务", "亲子", "老人", "情侣", "上班族", "打工人", "背包客",
  // 财务/省钱
  "省钱", "便宜", "折扣", "优惠", "价格比较", "比价", "性价比", "退票手续费", "改签费", "加速包",
  "学生折扣", "省事", "便宜点", "划算", "返现", "红包",
  // 国家/地区/城市
  "国内", "境内", "北京", "上海", "广州", "深圳", "成都", "杭州", "西安", "三亚", "海南", "丽江",
  "重庆", "厦门", "青岛", "大理",
  // App 功能
  "电子客票", "电子票", "扫码", "刷脸进站", "客服", "支付宝", "微信支付", "云闪付", "花呗",
  // 经验/品质
  "靠谱", "正规", "安全", "可靠", "好用", "口碑",
]

export interface KeywordItem {
  text: string
  value: number
}

export function extractKeywords(data: RawAuditData, maxItems = 25): KeywordItem[] {
  const counts = new Map<string, number>()
  const allText = data.results_by_question
    .map((r) => r.question)
    .join(" ")

  for (const phrase of PHRASE_DICT) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const re = new RegExp(escaped, "g")
    const matches = allText.match(re)
    if (matches && matches.length > 0) {
      counts.set(phrase, matches.length)
    }
  }

  // Always include brand name (so it surfaces at top of cloud)
  if (data.brand) {
    counts.set(data.brand, (counts.get(data.brand) || 0) + 5)
  }

  // Convert to array, scale to 20..95 range so sizeRange [14,36] maps cleanly
  const arr = Array.from(counts.entries()).map(([text, n]) => ({ text, raw: n }))
  arr.sort((a, b) => b.raw - a.raw)
  const top = arr.slice(0, maxItems)
  if (top.length === 0) return []

  const maxRaw = top[0].raw
  const minRaw = top[top.length - 1].raw
  const range = Math.max(1, maxRaw - minRaw)

  return top.map((item, i) => {
    // Map to 20..95 (covers 20-/30+/50+/70+ color buckets)
    const norm = (item.raw - minRaw) / range
    const value = Math.round(20 + norm * 75)
    return { text: item.text, value }
  })
}

export interface ThemeItem {
  name: string
  count: number
  matched: number
  visibility: number // avg score 0-100
  questions: { question: string; intent: string; topModel: string; topScore: number }[]
}

const THEMES: { name: string; keywords: string[] }[] = [
  {
    name: "抢票 / 购票工具",
    keywords: ["抢票", "买票", "订票", "购票", "12306", "App", "购票工具", "加速包", "候补"],
  },
  {
    name: "学生群体出行",
    keywords: ["学生", "学生票", "学生党", "学生折扣"],
  },
  {
    name: "价格比较",
    keywords: ["便宜", "比价", "价格", "折扣", "省钱", "划算", "优惠", "性价比", "返现"],
  },
  {
    name: "退改签",
    keywords: ["改签", "退票", "退改", "退改签", "改签费", "退票手续费"],
  },
  {
    name: "出行场景",
    keywords: ["旅游", "出差", "自由行", "亲子", "出行", "出游", "假期"],
  },
  {
    name: "节假日 / 春运",
    keywords: ["春运", "节假日", "春节", "国庆", "五一", "暑假", "寒假"],
  },
]

export function computeThemes(data: RawAuditData): ThemeItem[] {
  return THEMES.map((def) => {
    const matched = data.results_by_question.filter((r) =>
      def.keywords.some((kw) => r.question.includes(kw))
    )
    let scoreSum = 0
    let totalAnswers = 0
    const questions = matched.map((r) => {
      const models = (["deepseek", "minimax", "qwen", "kimi", "glm"] as const).map((m) => ({
        m,
        s: r.scores[m]?.score || 0,
      }))
      const top = models.reduce((a, b) => (b.s > a.s ? b : a))
      models.forEach((x) => {
        scoreSum += x.s
        totalAnswers++
      })
      return {
        question: r.question,
        intent: r.intent,
        topModel: top.m,
        topScore: top.s,
      }
    })
    return {
      name: def.name,
      count: matched.length * 3, // 3 models per question
      matched: matched.length,
      visibility: totalAnswers > 0 ? scoreSum / totalAnswers : 0,
      questions,
    }
  })
    .filter((t) => t.matched > 0)
    .sort((a, b) => b.count - a.count)
}
