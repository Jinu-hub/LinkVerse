// app/features/landing/components/WhoItsForSection.tsx

import { useTranslation } from "react-i18next"

export default function WhoItsForSection() {
  const { t } = useTranslation()

  const users = [
    {
      title: t("home.audience.developerTitle"),
      desc: t("home.audience.developerDesc"),
    },
    {
      title: t("home.audience.designerTitle"),
      desc: t("home.audience.designerDesc"),
    },
    {
      title: t("home.audience.creatorTitle"),
      desc: t("home.audience.creatorDesc"),
    },
    {
      title: t("home.audience.studentTitle"),
      desc: t("home.audience.studentDesc"),
    },
  ]

  return (
    <section className="bg-white dark:bg-zinc-900 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("home.audience.sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          {users.map((user, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.title}</h3>
              <p className="text-sm text-muted-foreground dark:text-zinc-300">{user.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
  