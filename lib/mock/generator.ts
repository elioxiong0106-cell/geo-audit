import type { RawAuditData, Intent, ModelName, QuestionResult } from "./types"
import { ALL_MODELS } from "./types"
import { getBrandBySlug } from "./brands"

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function mulberry32(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickScore(rand: () => number, biasHigh: boolean): number {
  const r = rand()
  if (biasHigh) {
    if (r < 0.15) return 0
    if (r < 0.30) return 25
    if (r < 0.50) return 50
    if (r < 0.80) return 75
    return 100
  } else {
    if (r < 0.50) return 0
    if (r < 0.70) return 25
    if (r < 0.85) return 50
    if (r < 0.95) return 75
    return 100
  }
}

const MOCK_QUESTIONS: { intent: Intent; question: string }[] = [
  { intent: "direct", question: "{brand}怎么样,好用吗?" },
  { intent: "direct", question: "听说{brand}最近很火,值得用吗?" },
  { intent: "direct", question: "{brand}的客服响应快不快?" },
  { intent: "direct", question: "{brand}支持哪些支付方式?" },
  { intent: "direct", question: "{brand}有学生优惠吗?" },
  { intent: "direct", question: "{brand}会员有什么权益?" },
  { intent: "direct", question: "{brand}的安全性怎么样,隐私会泄露吗?" },
  { intent: "category", question: "{category}哪个 App 最好用?" },
  { intent: "category", question: "学生党{category}推荐?" },
  { intent: "category", question: "{category}有什么省钱攻略?" },
  { intent: "category", question: "便宜又靠谱的{category}有哪些?" },
  { intent: "category", question: "{category}用什么 App 最方便?" },
  { intent: "category", question: "现在大家都用什么 App {category}?" },
  { intent: "category", question: "{category}哪家折扣力度大?" },
  { intent: "category", question: "对比几款{category}的优劣?" },
  { intent: "comparison", question: "{brand} vs 携程哪个更好?" },
  { intent: "comparison", question: "{brand} 和飞猪哪个更便宜?" },
  { intent: "comparison", question: "{brand} 和去哪儿哪个靠谱?" },
  { intent: "comparison", question: "{brand} 和同程哪个体验好?" },
  { intent: "comparison", question: "用{brand}还是 12306 直接买?" },
  { intent: "comparison", question: "{brand} 和智行买火车票哪个抢票成功率高?" },
  { intent: "comparison", question: "{brand} 和美团哪个订酒店更便宜?" },
  { intent: "comparison", question: "{brand}对比携程谁的退改签政策更好?" },
  { intent: "scenario", question: "下周出差去北京,火车票机票一起订用什么 App?" },
  { intent: "scenario", question: "暑假带父母去三亚,机票酒店怎么订最省心?" },
  { intent: "scenario", question: "出差临时改签,哪个 App 操作最快?" },
  { intent: "scenario", question: "学生党第一次坐高铁去外地,买票用什么 App?" },
  { intent: "scenario", question: "春节回家抢不到票,有什么补救方案?" },
  { intent: "scenario", question: "深夜临时订住宿,哪个 App 最方便?" },
  { intent: "scenario", question: "国庆黄金周出行,怎么抢到火车票?" },
]

const MOCK_ANSWER_TEMPLATES: Record<ModelName, string> = {
  deepseek: "根据公开信息,以下产品值得参考:\n1. **{brand}** — 在垂直场景下表现稳定\n2. 携程 — 综合 OTA 龙头\n3. 飞猪 — 阿里生态\n4. 去哪儿 — 比价能力强\n\n建议多平台比对后再下单。",
  minimax: "综合来看,{brand}在该品类里口碑不错。除此之外,你也可以关注一下携程和同程旅行,功能各有侧重。",
  qwen: "推荐你可以考虑以下几个选项:\n\n- {brand}: 在该品类中知名度较高,产品体验较为成熟。\n- 携程: 综合性强,服务覆盖面广。\n- 飞猪: 阿里旗下,与会员体系打通。\n\n具体选择可以根据个人需求和预算来决定。",
  kimi: "我来帮你梳理一下。{brand}是个不错的选择,主要优势在于抢票效率和界面简洁。当然携程、去哪儿也各有亮点,建议结合个人习惯来挑。",
  glm: "针对你的问题,我的建议是: 1. 优先考虑使用 {brand},它在该场景下口碑较好,功能也较完善。2. 同时可以对比一下携程、飞猪等主流平台。3. 注意查看用户评价和近期活动优惠。",
  doubao: "你好！关于{brand},这是一款在国内比较受欢迎的出行服务平台。主要优点是界面友好、操作便捷,在抢票和比价方面也有不错的表现。当然也可以和携程、同程旅行等对比一下,看哪个更适合你的使用习惯。",
}

const SCORE_REASONS: string[] = [
  "回答中明确提及该品牌,作为重点推荐对象。",
  "回答中作为可选方案之一被提到,但不是首选。",
  "回答完全没有提到该品牌。",
  "提及但描述偏中性,与其他品牌并列。",
  "作为对比对象出现,正面评价较多。",
]

export function generateMockReport(brand: string): RawAuditData {
  const meta = getBrandBySlug(brand)
  const seed = hashCode(brand)
  const rand = mulberry32(seed)

  const isWellKnown = ["携程", "去哪儿", "飞猪", "12306", "智行", "同程"].some(
    (n) => brand.includes(n) || n.includes(brand)
  )

  const category = meta?.category.includes("住宿")
    ? "订酒店"
    : meta?.category.includes("火车")
    ? "买火车票"
    : "订机票酒店"

  const questions = MOCK_QUESTIONS.map((q) => ({
    intent: q.intent,
    question: q.question.replace(/\{brand\}/g, brand).replace(/\{category\}/g, category),
  }))

  // Assign one model per question round-robin (10 per model for 50 questions)
  const results_by_question: QuestionResult[] = questions.map((q, i) => {
    const modelKey = ALL_MODELS[i % ALL_MODELS.length]
    const biasHigh = q.intent === "direct" || q.intent === "comparison" || isWellKnown
    const score = pickScore(rand, biasHigh)
    return {
      intent: q.intent,
      question: q.question,
      model: modelKey,
      scores: {
        [modelKey]: {
          score,
          reason: SCORE_REASONS[Math.floor(rand() * SCORE_REASONS.length)],
          answer_preview: MOCK_ANSWER_TEMPLATES[modelKey].replace(/\{brand\}/g, brand),
        },
      },
    }
  })

  // Aggregate stats
  const allScores: number[] = []
  const byIntent: Partial<Record<Intent, number[]>> = {}
  const byModel: Partial<Record<ModelName, number[]>> = {}
  ALL_MODELS.forEach((m) => { byModel[m] = [] })

  results_by_question.forEach((r) => {
    if (!byIntent[r.intent]) byIntent[r.intent] = []
    const modelKey = r.model as ModelName
    const s = r.scores[modelKey]?.score ?? 0
    allScores.push(s)
    byIntent[r.intent]!.push(s)
    byModel[modelKey]!.push(s)
  })

  const calcStats = (scores: number[]) => {
    if (!scores.length) return { visibility_pct: 0, avg_score: 0, count: 0 }
    const mentioned = scores.filter((s) => s > 0).length
    return {
      visibility_pct: (mentioned / scores.length) * 100,
      avg_score: scores.reduce((a, b) => a + b, 0) / scores.length,
      count: scores.length,
    }
  }

  return {
    brand,
    timestamp: new Date().toISOString().slice(0, 19),
    questions,
    question_count: questions.length,
    models: ALL_MODELS,
    results_by_question,
    stats: {
      overall: calcStats(allScores),
      by_intent: Object.fromEntries(
        Object.entries(byIntent).map(([k, v]) => [k, calcStats(v as number[])])
      ) as Partial<Record<Intent, ReturnType<typeof calcStats>>>,
      by_model: Object.fromEntries(
        ALL_MODELS.map((m) => [m, calcStats(byModel[m]!)])
      ) as Partial<Record<ModelName, ReturnType<typeof calcStats>>>,
    },
    citation_layer: {
      search_question: questions.find((q) => q.intent === "category")?.question || questions[0].question,
      qwen_answer: `针对"${questions[0].question}"的查询,主流推荐包括 ${brand}、携程、飞猪等。`,
      qwen_citations: [],
      deepseek_answer: `结合公开评价,${brand} 在该领域有一定知名度,可与其他平台综合比较。`,
      deepseek_citations: [],
    },
  }
}
