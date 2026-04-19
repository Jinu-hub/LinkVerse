import { Button } from "~/core/components/ui/button"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"

export default function FinalCTASection() {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 dark:from-zinc-900 dark:to-zinc-950 py-20 px-6 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("home.finalCta.title")}
        </h2>
        <p className="text-muted-foreground dark:text-zinc-300">
          {t("home.finalCta.description")}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/join" viewTransition>
            <Button size="lg" 
              className="w-40 text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-zinc-900 cursor-pointer"
            >
              {t("home.cta.getStarted")}
            </Button>
          </Link>
          <Link to="/login" viewTransition>
            <Button size="lg" variant="outline" 
              className="w-40 text-lg px-8 py-6 border-zinc-300 text-gray-900 dark:border-zinc-700 dark:text-zinc-100 cursor-pointer"
            >
              {t("login.loginButton")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
