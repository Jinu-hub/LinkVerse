// app/features/landing/components/HeroSection.tsx

import { Button } from "~/core/components/ui/button"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-b from-[#f0f9ff] to-white dark:from-zinc-900 dark:to-zinc-950 py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          {t("home.hero.headlineLine1Before")}
          <span className="text-blue-600 dark:text-blue-400">
            {t("home.hero.headlineLine1Highlight")}
          </span>
          <br />
          {t("home.hero.headlineLine2Before")}
          <span className="text-emerald-500 dark:text-emerald-400">
            {t("home.hero.headlineLine2Highlight")}
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground dark:text-zinc-300">
          {t("home.hero.description")}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/join" viewTransition>
            <Button
              size="lg"
              className="w-40 text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-zinc-900 cursor-pointer"
            >
              {t("home.cta.getStarted")}
            </Button>
          </Link>
          <Link to="/login" viewTransition>
            <Button
              size="lg"
              variant="outline"
              className="w-40 text-lg px-8 py-6 border-zinc-300 text-gray-900 dark:border-zinc-700 dark:text-zinc-100 cursor-pointer"
            >
              {t("login.loginButton")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <img
          src="/images/hero-preview-bookmark.png"
          alt={t("home.hero.previewImageAlt")}
          className="mx-auto w-full max-w-md drop-shadow-md"
        />
      </div>
    </section>
  )
}
