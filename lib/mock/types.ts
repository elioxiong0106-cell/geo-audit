export type Intent = "direct" | "category" | "comparison" | "scenario"
export type ModelName = "deepseek" | "minimax" | "qwen" | "kimi" | "glm" | "doubao"

export interface QuestionItem {
  intent: Intent
  question: string
}

export interface ScoreEntry {
  score: number
  reason: string
  answer_preview: string
}

export interface QuestionResult {
  intent: Intent
  question: string
  model: string
  scores: Partial<Record<ModelName, ScoreEntry>>
}

export interface StatGroup {
  visibility_pct: number
  avg_score: number
  count: number
}

export interface CitationItem {
  index: number | null
  title: string | null
  url: string | null
  site_name: string | null
  domain?: string | null
}

export interface RawAuditData {
  brand: string
  timestamp: string
  questions: QuestionItem[]
  question_count: number
  models?: string[]
  results_by_question: QuestionResult[]
  stats: {
    overall: StatGroup
    by_intent: Partial<Record<Intent, StatGroup>>
    by_model: Partial<Record<ModelName, StatGroup>>
  }
  citation_layer: {
    search_question: string
    qwen_answer: string
    qwen_citations: CitationItem[]
    deepseek_answer: string
    deepseek_citations: CitationItem[]
  }
}

export const INTENT_LABEL: Record<Intent, string> = {
  direct: "直接型",
  category: "品类型",
  comparison: "对比型",
  scenario: "场景型",
}

export const INTENT_DESC: Record<Intent, string> = {
  direct: "问题里直接出现品牌名",
  category: "用户描述品类需求,未提品牌",
  comparison: "品牌与竞品的对比型问题",
  scenario: "带具体场景与约束的真实需求",
}

export const MODEL_LABEL: Record<ModelName, string> = {
  deepseek: "DeepSeek",
  minimax: "MiniMax",
  qwen: "千问",
  kimi: "Kimi",
  glm: "智谱",
  doubao: "豆包",
}

export const MODEL_FULL_NAME: Record<ModelName, string> = {
  deepseek: "DeepSeek-V4-Flash",
  minimax: "MiniMax-M2.5",
  qwen: "qwen3.6-plus",
  kimi: "kimi-k2.5",
  glm: "glm-5",
  doubao: "doubao-1-5-lite-32k-250115",
}

export const MODEL_PROVIDER: Record<ModelName, string> = {
  deepseek: "DeepSeek · ADA",
  minimax: "MiniMax · ADA",
  qwen: "阿里巴巴 · ADA",
  kimi: "月之暗面 · ADA",
  glm: "智谱AI · ADA",
  doubao: "字节跳动 · 火山方舟",
}

export const MODEL_COLORS: Record<ModelName, string> = {
  deepseek: "#10b981",
  minimax: "#f59e0b",
  qwen: "#38bdf8",
  kimi: "#a78bfa",
  glm: "#fb7185",
  doubao: "#f97316",
}

export const ALL_MODELS: ModelName[] = ["deepseek", "minimax", "qwen", "kimi", "glm", "doubao"]
