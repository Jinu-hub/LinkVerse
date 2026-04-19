// app/features/landing/components/FeatureHighlights.tsx

import { BookMarked, Tags, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function FeatureHighlights() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: t("home.features.organizeTitle"),
      desc: t("home.features.organizeDesc"),
    },
    {
      icon: <Tags className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: t("home.features.recommendationsTitle"),
      desc: t("home.features.recommendationsDesc"),
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: t("home.features.memoTitle"),
      desc: t("home.features.memoDesc"),
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
