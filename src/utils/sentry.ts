import * as Sentry from '@sentry/react-native';

import logger, { EXPECTED_ERROR_PATTERNS } from './logger';
import { redactSensitiveData, redactString } from './redact';

export default () => {
  if (__DEV__) return;

  logger.log('[SENTRY] Initializing...');

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    logger.warn('[SENTRY] No DSN URL was provided!');
  } else {
    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
      ignoreErrors,
      // Последняя линия обороны: персональные данные (логин/пароль/e-mail,
      // сессионные куки) не должны попасть в Sentry даже в составе
      // сериализованных ошибок из глобальных хендлеров (например, `config`
      // у необработанных axios-ошибок).
      beforeSend: (event) => redactSensitiveData(event) as Sentry.ErrorEvent,
    });
  }
};
export const reportParserError = (error: unknown) => {
  if (!__DEV__) Sentry.captureException(error);
};

export const executeRegex = (
  regex: RegExp,
  str: string,
  sendReport: boolean = true
): RegExpExecArray | null => {
  const result = regex.exec(str);
  if (!result && sendReport && !__DEV__) {
    Sentry.captureMessage(redactString(`String ${str} mismatched with regex ${regex}`), 'error');
  }
  return result;
};

const ignoreErrors = [
  // Ожидаемые ошибки окружения (нет сети, портал недоступен, таймауты) — не баги
  // приложения. Дублирует фильтр в `utils/logger.ts` для глобальных ошибок.
  ...EXPECTED_ERROR_PATTERNS,
  // sp-react-native-in-app-updates throws when neither immediate nor flexible
  // Play Core update is allowed (e.g. sideloaded APK / store state). It is
  // non-critical and swallowed by the caller, so suppress it either way it surfaces.
  /sp-react-native-in-app-updates|Update type unavailable/,
  'ExpoBackgroundTask.registerTaskAsync',
  'ExpoFontLoader',
  'OutOfMemoryError',
];
