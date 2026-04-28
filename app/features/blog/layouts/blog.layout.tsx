import { ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";

import LangSwitcher from "~/core/components/lang-switcher";
import ThemeSwitcher from "~/core/components/theme-switcher";

function BlogNav() {
  const { t } = useTranslation();

  return (
    <nav className="mx-auto flex h-16 items-center justify-between border-b px-5 shadow-xs backdrop-blur-lg transition-opacity md:px-10">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between gap-4 py-3">
        <h1 className="flex min-w-0 flex-wrap items-center gap-2 text-lg">
          <span className="text-muted-foreground text-lg font-extrabold">
            {import.meta.env.VITE_APP_NAME}
          </span>
          <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
          <Link
            to="/orbit"
            viewTransition
            className="text-muted-foreground text-lg font-medium transition-colors hover:text-foreground"
            aria-label={t("blog.breadcrumb.orbitAriaLabel")}
          >
            {t("blog.breadcrumb.orbit")}
          </Link>
          <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
          <Link to="/blog" className="font-semibold" viewTransition>
            {t("blog.breadcrumb.blog")}
          </Link>
        </h1>

        <div className="flex shrink-0 items-center gap-0 border-l border-border pl-3">
          <ThemeSwitcher />
          <LangSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default function BlogLayout() {
  return (
    <>
      <BlogNav />
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-16 md:px-10">
        <Outlet />
      </div>
    </>
  );
}
