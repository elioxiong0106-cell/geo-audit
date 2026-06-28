import type { RawAuditData } from "../mock/types"

export interface Topic {
  name: string
  matched: number
  totalAnswers: number
  mentioned: number
  score: number // visibility %
}

// Topic keyword buckets — questions are bucketed by keyword match
const TOPIC_DEFS: { name: string; keywords: string[] }[] = [
  {
    name: "比价 / 找便宜",
    keywords: ["便宜", "比价", "省钱", "划算", "折扣", "优惠", "打折", "便宜点", "省"],
  },
  {
    name: "学生 / 留学",
    keywords: ["学生", "留学", "学校", "校园", "读书", "学生票", "学生卡", "学生折扣"],
  },
  {
    name: "退改 / 客服",
    keywords: ["退", "改签", "客服", "退票", "改", "退款", "投诉", "服务"],
  },
  {
    name: "出行场景 / 行程",
    keywords: ["旅游", "出差", "玩", "去英国", "去日本", "去欧洲", "假期", "出行", "行程", "自由行"],
  },
  {
    name: "App / 工具",
    keywords: ["App", "app", "应用", "软件", "工具", "下载", "界面", "操作"],
  },
  {
    name: "支付 / 安全",
    keywords: ["支付", "支付宝", "微信", "信用卡", "安全", "靠谱", "可靠", "正规"],
  },
]

export function computeTopics(data: RawAuditData): Topic[] {
  return TOPIC_DEFS.map((def) => {
    const matched = data.results_by_question.filter((r) =>
      def.keywords.some((kw) => r.question.includes(kw))
    )
    const totalAnswers = matched.length * 3 // 3 models per question
    let mentioned = 0
    let scoreSum = 0
    matched.forEach((r) => {
      ;(["doubao", "qwen", "deepseek"] as const).forEach((m) => {
        const s = r.scores[m]?.score || 0
        scoreSum += s
        if (s > 0) mentioned++
      })
    })
    // Use avg score (0-100) as the bar metric — shows recommendation strength, not just presence
    const score = totalAnswers > 0 ? scoreSum / totalAnswers : 0
    return {
      name: def.name,
      matched: matched.length,
      totalAnswers,
      mentioned,
      score: Math.round(score * 10) / 10,
    }
  })
    .filter((t) => t.matched >= 2)
    .sort((a, b) => b.score - a.score)
}
