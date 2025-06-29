// app/features/landing/components/HowItWorksSection.tsx

import { Sparkles, Tags, FileText } from "lucide-react"

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      title: "링크 저장",
      desc: "원하는 페이지를 간단히 추가해 북마크하세요.",
    },
    {
      icon: <Tags className="w-6 h-6 text-emerald-600" />,
      title: "태그 정리",
      desc: "나만의 태그로 빠르게 분류하고 찾기 쉽게 만들어요.",
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      title: "메모 기록",
      desc: "링크의 요약이나 생각을 간단히 메모에 남겨요.",
    },
  ]

  return (
    <section className="bg-white dark:bg-zinc-900 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">간단한 3단계로 시작하세요</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{step.title}</h3>
              <p className="text-sm text-muted-foreground dark:text-zinc-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
