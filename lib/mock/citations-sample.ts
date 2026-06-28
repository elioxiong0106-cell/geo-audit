export interface SampleSource {
  domain: string
  count: number
  type: "Owned" | "Earned"
}

export interface SampleCitationData {
  ownedDomain: string
  ownedCount: number
  earnedCount: number
  sources: SampleSource[]
}

export const SAMPLE_CITATIONS: Record<string, SampleCitationData> = {
  携程: {
    ownedDomain: "ctrip.com",
    ownedCount: 12,
    earnedCount: 10,
    sources: [
      { domain: "12306.cn",         count: 18, type: "Earned" },
      { domain: "ctrip.com",        count: 12, type: "Owned"  },
      { domain: "fliggy.com",       count: 9,  type: "Earned" },
      { domain: "qunar.com",        count: 7,  type: "Earned" },
      { domain: "mafengwo.cn",      count: 6,  type: "Earned" },
      { domain: "zhihu.com",        count: 5,  type: "Earned" },
      { domain: "meituan.com",      count: 4,  type: "Earned" },
      { domain: "ly.com",           count: 3,  type: "Earned" },
      { domain: "tuniu.com",        count: 2,  type: "Earned" },
      { domain: "xiaohongshu.com",  count: 2,  type: "Earned" },
      { domain: "skyscanner.com.cn",count: 1,  type: "Earned" },
    ],
  },
  飞猪: {
    ownedDomain: "fliggy.com",
    ownedCount: 8,
    earnedCount: 10,
    sources: [
      { domain: "12306.cn",       count: 16, type: "Earned" },
      { domain: "ctrip.com",      count: 11, type: "Earned" },
      { domain: "fliggy.com",     count: 8,  type: "Owned"  },
      { domain: "taobao.com",     count: 7,  type: "Earned" },
      { domain: "qunar.com",      count: 6,  type: "Earned" },
      { domain: "mafengwo.cn",    count: 5,  type: "Earned" },
      { domain: "zhihu.com",      count: 4,  type: "Earned" },
      { domain: "meituan.com",    count: 3,  type: "Earned" },
      { domain: "ly.com",         count: 2,  type: "Earned" },
      { domain: "xiaohongshu.com",count: 2,  type: "Earned" },
      { domain: "tuniu.com",      count: 1,  type: "Earned" },
    ],
  },
  去哪儿: {
    ownedDomain: "qunar.com",
    ownedCount: 7,
    earnedCount: 10,
    sources: [
      { domain: "12306.cn",         count: 17, type: "Earned" },
      { domain: "ctrip.com",        count: 13, type: "Earned" },
      { domain: "qunar.com",        count: 7,  type: "Owned"  },
      { domain: "fliggy.com",       count: 6,  type: "Earned" },
      { domain: "mafengwo.cn",      count: 5,  type: "Earned" },
      { domain: "zhihu.com",        count: 5,  type: "Earned" },
      { domain: "ly.com",           count: 4,  type: "Earned" },
      { domain: "meituan.com",      count: 3,  type: "Earned" },
      { domain: "skyscanner.com.cn",count: 2,  type: "Earned" },
      { domain: "tuniu.com",        count: 1,  type: "Earned" },
      { domain: "qyer.com",         count: 1,  type: "Earned" },
    ],
  },
  同程旅行: {
    ownedDomain: "ly.com",
    ownedCount: 5,
    earnedCount: 9,
    sources: [
      { domain: "12306.cn",       count: 15, type: "Earned" },
      { domain: "ctrip.com",      count: 12, type: "Earned" },
      { domain: "qunar.com",      count: 8,  type: "Earned" },
      { domain: "fliggy.com",     count: 7,  type: "Earned" },
      { domain: "ly.com",         count: 5,  type: "Owned"  },
      { domain: "mafengwo.cn",    count: 4,  type: "Earned" },
      { domain: "zhihu.com",      count: 4,  type: "Earned" },
      { domain: "meituan.com",    count: 3,  type: "Earned" },
      { domain: "tuniu.com",      count: 2,  type: "Earned" },
      { domain: "xiaohongshu.com",count: 1,  type: "Earned" },
    ],
  },
  智行: {
    ownedDomain: "zhixing.com",
    ownedCount: 4,
    earnedCount: 9,
    sources: [
      { domain: "12306.cn",   count: 21, type: "Earned" },
      { domain: "ctrip.com",  count: 10, type: "Earned" },
      { domain: "qunar.com",  count: 7,  type: "Earned" },
      { domain: "fliggy.com", count: 6,  type: "Earned" },
      { domain: "zhixing.com",count: 4,  type: "Owned"  },
      { domain: "ly.com",     count: 4,  type: "Earned" },
      { domain: "mafengwo.cn",count: 3,  type: "Earned" },
      { domain: "zhihu.com",  count: 3,  type: "Earned" },
      { domain: "meituan.com",count: 2,  type: "Earned" },
      { domain: "tuniu.com",  count: 1,  type: "Earned" },
    ],
  },
}
