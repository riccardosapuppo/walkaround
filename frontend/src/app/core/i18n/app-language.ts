export type AppLanguage = 'it' | 'en' | 'fr' | 'es' | 'de' | 'pl';

export const APP_LANGUAGES: AppLanguage[] = ['it', 'en', 'fr', 'es', 'de', 'pl'];

export function isAppLanguage(value: unknown): value is AppLanguage {
  return APP_LANGUAGES.includes(value as AppLanguage);
}
