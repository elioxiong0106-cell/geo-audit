import AuditBrandClient from "./client"

export function generateStaticParams() {
  return [
    { brand: encodeURIComponent("携程") },
    { brand: encodeURIComponent("去哪儿") },
    { brand: encodeURIComponent("智行") },
    { brand: encodeURIComponent("飞猪") },
    { brand: encodeURIComponent("同程旅行") },
  ]
}

export default function AuditBrandPage() {
  return <AuditBrandClient />
}
