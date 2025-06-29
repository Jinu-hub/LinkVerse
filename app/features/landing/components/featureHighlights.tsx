// app/features/landing/components/FeatureHighlights.tsx

import { BookMarked, Tags, FileText } from "lucide-react"

export default function FeatureHighlights() {
  const features = [
    {
      icon: <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "북마크를 정리하고 분류",
      desc: "태그와 카테고리로 원하는 정보를 빠르게 찾을 수 있어요.",
    },
    {
      icon: <Tags className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "자주 사용하는 항목 추천",
      desc: "클릭 횟수 기반으로 나만의 Top 5를 자동으로 추천해줘요.",
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "메모로 맥락까지 저장",
      desc: "링크에 대한 생각, 요약, 맥락을 간단한 메모로 남겨보세요.",
    },
  ]

  return (
    <section className="bg-white dark:bg-zinc-900 py-16 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((feature, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex justify-center">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-muted-foreground dark:text-zinc-300">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
