/**
 * Internationalization (i18n) Configuration
 * 
 * This file defines the core configuration for the application's
 * internationalization using i18next. It specifies supported languages,
 * fallback language, and the default namespace for translations.
 */

/**
 * List of supported languages in the application
 * Currently supports English (en), Japanese (ja), and Korean (ko)
 * Using 'as const' to create a readonly tuple type for type safety
 */
export const supportedLngs = ["en", "ja", "ko"] as const;

/** BCP 47-style codes listed in `supportedLngs` */
export type SupportedLng = (typeof supportedLngs)[number];

/** Must be one of `supportedLngs` */
const fallbackLng: SupportedLng = "en";

/**
 * Default i18next configuration
 * This is used by both client and server rendering to ensure consistent
 * translation behavior throughout the application.
 */
export default {
  supportedLngs,
  fallbackLng,
  /** General UI copy lives in this namespace */
  defaultNS: "common",
};