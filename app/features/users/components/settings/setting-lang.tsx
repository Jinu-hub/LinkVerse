import { CardContent } from "~/core/components/ui/card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { GlobeIcon, FlagIcon, LanguagesIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
export default function SettingLang() {

  // Get translation function and i18n instance
  const { t, i18n } = useTranslation();

  // Get fetcher for making API requests
  const fetcher = useFetcher();

  /**
   * Handle language change by updating both client and server state
   * @param locale - The language code to switch to (e.g., 'en', 'ko', 'es')
   */
  const handleLocaleChange = async (locale: string) => {
    // Change language in i18n context (client-side)
    i18n.changeLanguage(locale);
    
    // Persist language preference on the server
    await fetcher.submit(null, {
      method: "POST",
      action: "/api/settings/locale?locale=" + locale,
    });
  };

  return (
      <Card className="justify-between w-full max-w-screen-md">
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>
            Change your language.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            defaultValue={i18n.language ?? "en"}
            className="grid grid-cols-3 gap-4"
          >
            <ToggleGroupItem
              value={"en"}
              onClick={() => handleLocaleChange("en")}
              className="flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-lg font-semibold transition
                border border-transparent
                data-[state=on]:border-2 data-[state=on]:border-primary
                data-[state=on]:bg-primary data-[state=on]:text-white
                data-[state=on]:dark:bg-zinc-900 data-[state=on]:dark:text-primary
                hover:bg-gray-100 dark:hover:bg-zinc-700
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <GlobeIcon className="w-7 h-7 mb-1" />
              {t("navigation.en")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value={"ko"}
              onClick={() => handleLocaleChange("ko")}
              className="flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-lg font-semibold transition
                border border-transparent
                data-[state=on]:border-2 data-[state=on]:border-primary
                data-[state=on]:bg-primary data-[state=on]:text-white
                data-[state=on]:dark:bg-zinc-900 data-[state=on]:dark:text-primary
                hover:bg-gray-100 dark:hover:bg-zinc-700
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <TaegeukIcon className="w-7 h-7 mb-1" />
              {t("navigation.kr")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value={"es"}
              onClick={() => handleLocaleChange("es")}
              className="flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-lg font-semibold transition
                border border-transparent
                data-[state=on]:border-2 data-[state=on]:border-primary
                data-[state=on]:bg-primary data-[state=on]:text-white
                data-[state=on]:dark:bg-zinc-900 data-[state=on]:dark:text-primary
                hover:bg-gray-100 dark:hover:bg-zinc-700
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <LanguagesIcon className="w-7 h-7 mb-1" />
              Spanish
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>
  );
}

export function TaegeukIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      {/* 전체를 -45도 회전 */}
      <g transform="rotate(-45 32 32)">
        {/* 바깥 원 – 선 굵기 3 */}
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" />

        {/* S자 경계 라인 – 선 굵기 3 */}
        <path
          d="
            M32,2
            A30,30 0 0 1 32,62
            A15,15 0 0 0 32,32
            A15,15 0 0 1 32,2
            Z
          "
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />

        {/* 작은 위쪽 원 – 그대로 (선 굵기 2) 
        <circle cx="32" cy="17" r="5" stroke="currentColor" strokeWidth="2" fill="red" />
        <circle cx="32" cy="47" r="5" stroke="currentColor" strokeWidth="2" fill="blue" />
        */}
      </g>
    </svg>
  );
}



{/*
export function TaegeukIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />

      <path
        d="M32 12
           A20 20 0 0 1 52 32
           A10 10 0 0 0 32 32
           A10 10 0 0 1 32 12Z"
        fill="red"
      />

      <path
        d="M32 52
           A20 20 0 0 1 12 32
           A10 10 0 0 0 32 32
           A10 10 0 0 1 32 52Z"
        fill="blue"
      />

      <circle cx="32" cy="22" r="5" fill="blue" />

      <circle cx="32" cy="42" r="5" fill="red" />
    </svg>
  );
}
*/}