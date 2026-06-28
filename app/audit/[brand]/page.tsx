import AuditBrandClient from "./client"

export function generateStaticParams() {
  return [
    { brand: "携程" },
    { brand: "去哪儿" },
    { brand: "智行" },
    { brand: "飞猪" },
    { brand: "同程旅行" },
  ]
}

export default function AuditBrandPage() {
  return <AuditBrandClient />
}
