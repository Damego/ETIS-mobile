import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

export const SUPPORTED_LOCALES = ['ru', 'en'] as const;
export type AppLanguage = (typeof SUPPORTED_LOCALES)[number];

const resources = {
  ru: { translation: ru },
  en: { translation: en },
} as const;

// Язык приложения берётся из системных настроек устройства
// (на Android 13+ — из per-app language). Локаль dayjs НЕ переключаем:
// 'ru' нужна для корректного парсинга ответов сервера ETIS.
const resolveLanguage = (): AppLanguage => {
  const deviceLanguage = getLocales()[0]?.languageCode;
  return SUPPORTED_LOCALES.includes(deviceLanguage as AppLanguage)
    ? (deviceLanguage as AppLanguage)
    : 'ru';
};

void i18next.use(initReactI18next).init({
  resources,
  lng: resolveLanguage(),
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18next;
