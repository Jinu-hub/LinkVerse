import { CardContent } from "~/core/components/ui/card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { GlobeIcon, JapaneseYen } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import type { SupportedLng } from "~/i18n";
import i18nConfig, { supportedLngs } from "~/i18n";

const localeIcons: Record<
  SupportedLng,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  en: GlobeIcon,
  ja: JapaneseYen,
  ko: TaegeukIcon,
};

function resolvedLocale(language: string): SupportedLng {
  const base = language.split("-")[0];
  return (
    supportedLngs.find((lng) => lng === base) ?? i18nConfig.fallbackLng
  );
}

export default function SettingLang() {
  const { t, i18n } = useTranslation();
  const fetcher = useFetcher();

  const handleLocaleChange = async (locale: SupportedLng) => {
    i18n.changeLanguage(locale);
    await fetcher.submit(null, {
      method: "POST",
      action: "/api/settings/locale?locale=" + locale,
    });
  };

  const current = resolvedLocale(i18n.language);

  return (
    <Card className="justify-between w-full max-w-screen-md">
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>Change your language.</CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          value={current}
          onValueChange={(v) => {
            if (v && supportedLngs.includes(v as SupportedLng)) {
              void handleLocaleChange(v as SupportedLng);
            }
          }}
          className="grid grid-cols-3 gap-4"
        >
          {supportedLngs.map((lng) => {
            const Icon = localeIcons[lng];
            return (
              <ToggleGroupItem
                key={lng}
                value={lng}
                className="flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-lg font-semibold transition
                border border-transparent
                data-[state=on]:border-2 data-[state=on]:border-primary
                data-[state=on]:bg-primary data-[state=on]:text-white
                data-[state=on]:dark:bg-zinc-900 data-[state=on]:dark:text-primary
                hover:bg-gray-100 dark:hover:bg-zinc-700
                focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Icon className="w-7 h-7 mb-1" />
                {t(`navigation.${lng}`)}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}

export function TaegeukIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <g transform="rotate(-45 32 32)">
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" />
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
      </g>
    </svg>
  );
}
