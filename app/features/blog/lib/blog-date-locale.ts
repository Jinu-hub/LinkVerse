/**
 * Maps app language codes (`en` | `ja` | `ko`) to BCP 47 tags for `Intl` date formatting.
 */
export function toBlogLocaleDateString(isoDate: string, lang: string): string {
  const d = new Date(isoDate);
  const localeTag =
    lang === "ko" ? "ko-KR" : lang === "ja" ? "ja-JP" : "en-US";
  return d.toLocaleDateString(localeTag);
}
