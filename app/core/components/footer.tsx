/**
 * Footer Component
 *
 * A responsive footer that displays copyright information and legal links.
 * This component appears at the bottom of every page in the application and
 * provides essential legal information and copyright notice.
 *
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Dynamic copyright year that automatically updates
 * - Links to legal pages (Privacy Policy, Terms of Service)
 * - View transitions for smooth navigation to legal pages
 */
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Actions } from "./navigation-bar";

/**
 * Footer component for displaying copyright information and legal links
 * 
 * This component renders a responsive footer that adapts to different screen sizes.
 * On mobile, it displays the legal links above the copyright notice, while on desktop,
 * it displays them side by side with the copyright on the left and links on the right.
 * 
 * @returns A footer component with copyright information and legal links
 */
export default function Footer() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const companyInfo = i18n.language === "ko"
    ? [
        "링크버스(LinkVerse) | 사업자번호 844-64-00886 | 통신판매업 제2026-부산수영-0064호 | 대표: 송진우",
        "부산 수영구 남천바다로21번길 69-5 ",
        "문의: jinu30dev@gmail.com (010-6454-8896)"
      ]
    : i18n.language === "ja"
      ? [
          "LinkVerse(リンクバース) | 代表: Jinwoo Song",
          "住所: 日本 大阪市 東成区 東小橋2-5-16-804 ",
          "お問い合わせ: jinu30dev@gmail.com (080-3841-8896)"
        ]
      : [
          "LinkVerse | Representative: Jinwoo Song",
          "Address: 2-5-16-804, Higashiobase, Higashinari-ku, Osaka, Japan ",
          "Contact: jinu30dev@gmail.com (080-3841-8896)"
        ];
  return (
    <footer className="text-muted-foreground mt-auto flex items-center justify-between border-t py-3 text-sm md:py-5">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl flex-col items-center justify-between gap-2.5 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Copyright notice - appears second on mobile, first on desktop */}
        <div className="order-2 md:order-none">
          <p>
            &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}.
            All rights reserved.
            <br /><br />
            {companyInfo.map((info, index) => (
              <p key={index}>{info}</p>
            ))}
          </p>
        </div>
        
        {/* Legal links + actions aligned to the right on larger screens */}
        <div className="order-1 flex w-full flex-row flex-wrap items-center justify-end gap-x-6 gap-y-2 md:order-none md:w-auto">
          <div className="flex gap-10 *:underline">
            <Link to="/legal/privacy-policy" viewTransition>
              {t('join.privacy')}
            </Link>
            <Link to="/legal/terms-of-service" viewTransition>
              {t('join.tos')}
            </Link>
          </div>

          <div className="flex items-center gap-3 border-l border-[#E1E4E8] dark:border-[#2C2D30] pl-4">
            <Actions />
          </div>
        </div>
      </div>
    </footer>
  );
}
