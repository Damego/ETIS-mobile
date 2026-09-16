import * as Sentry from '@sentry/react-native';

import { redactString } from './redact';

/**
 * Централизованный логгер.
 *
 * В `__DEV__` пишет в консоль; в проде `log` полностью вырезается из бандла
 * (tree-shaking по `__DEV__`), а `warn`/`error` уходят в Sentry.
 * Заменяет рассыпанные по коду `console.*`.
 *
 * Перед отправкой в Sentry сообщения маскируются от персональных данных
 * (`redactString`), ожидаемые ошибки окружения (нет интернета, портал
 * недоступен, таймаут) не репортятся вовсе, а axios-ошибки очищаются
 * от `config` с логином/паролем (`sanitizeErrorForReport`).
 */

type LogArgs = unknown[];

/**
 * Ожидаемые ошибки: нет интернета, портал/API недоступен, таймаут, а также
 * сбои платформы, которые приложение уже обработало фолбэком. Это не баги
 * приложения — в Sentry они лишь шумят, поэтому не репортим их.
 * Тот же список подключён к `ignoreErrors` в `utils/sentry.ts`, чтобы
 * фильтровать ещё и необработанные глобальные ошибки.
 */
export const EXPECTED_ERROR_PATTERNS = [
  /Network Error/i,
  /Internet is not reachable/i,
  /Service is unavailable/i,
  /timeout of \d+ms exceeded/i,
  /**
   * Сброс нативного ActivityResultLauncher при пересоздании Activity
   * (SAF-выбор каталога в `utils/files.ts`, пикеры). Баг ядра expo-modules-core,
   * app-side митигации нет; приложение уже обрабатывает сбой через фолбэк.
   * https://github.com/expo/expo/pull/49634
   */
  /Attempting to launch an unregistered ActivityResultLauncher/i,
];

const isExpectedError = (message: string) =>
  EXPECTED_ERROR_PATTERNS.some((pattern) => pattern.test(message));

// Структурный тип axios-ошибки (без импорта axios): интересуют только own-свойства
type AxiosLikeError = Error & {
  code?: string;
  status?: number | string | null;
  config?: { method?: string; url?: string };
  method?: string;
  url?: string;
};

/**
 * У axios-ошибок среди own-свойств — `config` (в `data` логин/пароль, в
 * `headers` сессионная кука), `request` и `response` (сырой HTML портала).
 * Sentry сериализует их целиком, поэтому ошибка пересобирается из безопасных
 * полей: имя, сообщение, стек, код/статус и метод/URL запроса.
 */
const sanitizeErrorForReport = (error: Error): Error => {
  const hasAxiosPayload = ['config', 'request', 'response'].some((key) => key in error);
  if (!hasAxiosPayload) return error;

  const { code, status, config } = error as AxiosLikeError;
  const safeError = new Error(redactString(error.message)) as AxiosLikeError;
  safeError.name = error.name;
  safeError.stack = error.stack;
  safeError.code = code;
  safeError.status = status;
  safeError.method = config?.method;
  safeError.url = config?.url;
  return safeError;
};

const devLog = (...args: LogArgs) => {
  console.log(...args);
};

const noop = (..._args: LogArgs) => undefined;

const messageOf = (args: LogArgs) => redactString(args.map(String).join(' '));

const logger = {
  /**
   * Отладочный лог. В проде — no-op, вызов вырезается сборщиком.
   */
  log: __DEV__ ? devLog : noop,
  /**
   * Предупреждение: видно в консоли в dev, репортится в Sentry в проде.
   */
  warn: (...args: LogArgs) => {
    if (__DEV__) {
      console.warn(...args);
    } else {
      const message = messageOf(args);
      if (!isExpectedError(message)) {
        Sentry.captureMessage(message, 'warning');
      }
    }
  },
  /**
   * Ошибка: видно в консоли в dev, репортится в Sentry в проде.
   */
  error: (...args: LogArgs) => {
    if (__DEV__) {
      console.error(...args);
    } else {
      const message = messageOf(args);
      if (isExpectedError(message)) return;
      Sentry.captureException(
        args.length === 1 && args[0] instanceof Error
          ? sanitizeErrorForReport(args[0])
          : new Error(message)
      );
    }
  },
};

export default logger;
