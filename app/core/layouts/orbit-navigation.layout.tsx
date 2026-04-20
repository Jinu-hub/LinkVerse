/**
 * Orbit Navigation Layout
 *
 * 명함 QR 코드로 연결되는 `/orbit` 랜딩 전용 레이아웃입니다.
 * 일반 페이지와 달리 네비게이션을 최소화하여 브랜드/아이덴티티에 집중할 수 있도록 합니다.
 *
 * - 상단: 테마/언어 스위처만 노출 (우상단, fixed)
 * - 본문: 전체 화면 Outlet
 * - 하단: 저작권과 법적 링크만 간결하게
 */
import { Link, Outlet } from "react-router";
import { useTranslation } from "react-i18next";

import LangSwitcher from "~/core/components/lang-switcher";
import ThemeSwitcher from "~/core/components/theme-switcher";
import Footer from "../components/footer";

export default function OrbitNavigationLayout() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      {/* Minimal top-right controls */}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex items-center gap-2 md:top-6 md:right-6">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/60 bg-background/70 p-1 shadow-sm backdrop-blur-md">
          <ThemeSwitcher />
          <LangSwitcher />
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <div className="flex flex-col justify-between mt-12 px-4 md:px-7 lg:px-14">
        <Footer />
      </div>

      {/* Minimal footer */}
      {/*
      <footer className="relative z-10 border-t border-border/50 py-6 text-xs text-muted-foreground">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-6 md:flex-row">
          <p>
            © {new Date().getFullYear()} LinkVerse. All rights reserved.
          </p>
          <div className="flex gap-5 *:underline-offset-4 *:hover:underline">
            <Link to="/legal/privacy-policy" viewTransition>
              {t("join.privacy")}
            </Link>
            <Link to="/legal/terms-of-service" viewTransition>
              {t("join.tos")}
            </Link>
            <Link to="/contact" viewTransition>
              Contact
            </Link>
          </div>
        </div>
      </footer>
      */}
    </div>
  );
}
