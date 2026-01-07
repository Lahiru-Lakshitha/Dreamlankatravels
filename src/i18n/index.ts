import { en, TranslationKeys } from './translations/en';
import { fr } from './translations/fr';
import { de } from './translations/de';
import { it } from './translations/it';
import { ru } from './translations/ru';
import { es } from './translations/es';
import { pt } from './translations/pt';

export type LanguageCode = 'en' | 'fr' | 'de' | 'it' | 'ru' | 'es' | 'pt';

export const translations: Record<LanguageCode, TranslationKeys> = {
  en,
  fr,
  de,
  it,
  ru,
  es,
  pt,
};

export const languages = [
  { code: 'en' as LanguageCode, name: 'English', flag: '🇬🇧' },
  { code: 'fr' as LanguageCode, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as LanguageCode, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it' as LanguageCode, name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru' as LanguageCode, name: 'Русский', flag: '🇷🇺' },
  { code: 'es' as LanguageCode, name: 'Español', flag: '🇪🇸' },
  { code: 'pt' as LanguageCode, name: 'Português', flag: '🇵🇹' },
];

export { en, fr, de, it, ru, es, pt };
export type { TranslationKeys };
