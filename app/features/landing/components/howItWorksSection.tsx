// app/features/landing/components/HowItWorksSection.tsx

import { Sparkles, Tags, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function HowItWorksSection() {
  const { t } = useTranslation()

  const steps = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      title: t("home.howItWorks.saveLinkTitle"),
      desc: t("home.howItWorks.saveLinkDesc"),
    },
    {
      icon: <Tags className="w-6 h-6 text-emerald-600" />,
      title: t("home.howItWorks.tagOrganizeTitle"),
      desc: t("home.howItWorks.tagOrganizeDesc"),
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      title: t("home.howItWorks.memoStepTitle"),
      desc: t("home.howItWorks.memoStepDesc"),
    },
  ]

  return (
    <section className="bg-white dark:bg-zinc-900 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("home.howItWorks.sectionTitle")}
        </h2>
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
