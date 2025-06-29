import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-gradient-to-b from-blue-50/70 to-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          {t("join.heroTitle")}<br />
          <span className="text-blue-600 dark:text-blue-400">{t("join.heroSubtitle")}</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground dark:text-zinc-300">
          {t("join.heroDescription")}
        </p>
      </div>
    </section>
  )
}
