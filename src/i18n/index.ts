import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

export const SUPPORTED_LOCALES = ['ru', 'en'] as const;
export type AppLanguage = (typeof SUPPORTED_LOCALES)[number];

// Пользовательский выбор языка: 'system' — следовать системным настройкам
// устройства (на Android 13+ — per-app language), иначе — конкретный язык
export type LanguagePreference = AppLanguage | 'system';

const resources = {
  ru: { translation: ru },
  en: { translation: en },
} as const;

// Язык приложения берётся из системных настроек устройства
// (на Android 13+ — из per-app language). Локаль dayjs НЕ переключаем:
// 'ru' нужна для корректного парсинга ответов сервера ETIS.
export const resolveLanguage = (preference: LanguagePreference = 'system'): AppLanguage => {
  if (preference !== 'system') return preference;

  const deviceLanguage = getLocales()[0]?.languageCode;
  return SUPPORTED_LOCALES.includes(deviceLanguage as AppLanguage)
    ? (deviceLanguage as AppLanguage)
    : 'ru';
};

// Текущее пользовательское предпочтение. Меняется через changeLanguage()
// (переключатель в настройках); до первого вызова — системный язык.
let languagePreference: LanguagePreference = 'system';

export const getLanguagePreference = (): LanguagePreference => languagePreference;

// Смена языка: обновляет предпочтение и сам инстанс i18next.
// React-компоненты перерисуются автоматически через useTranslation.
export const changeLanguage = async (preference: LanguagePreference) => {
  languagePreference = preference;
  await i18next.changeLanguage(resolveLanguage(preference));
};

void i18next.use(initReactI18next).init({
  resources,
  lng: resolveLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18next;
