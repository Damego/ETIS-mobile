import * as Sentry from '@sentry/react-native';

/**
 * Централизованный логгер.
 *
 * В `__DEV__` пишет в консоль; в проде `log` полностью вырезается из бандла
 * (tree-shaking по `__DEV__`), а `warn`/`error` уходят в Sentry.
 * Заменяет рассыпанные по коду `console.*`.
 */

type LogArgs = unknown[];

const devLog = (...args: LogArgs) => {
  console.log(...args);
};

const noop = (..._args: LogArgs) => undefined;

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
      Sentry.captureMessage(args.map(String).join(' '), 'warning');
    }
  },
  /**
   * Ошибка: видно в консоли в dev, репортится в Sentry в проде.
   */
  error: (...args: LogArgs) => {
    if (__DEV__) {
      console.error(...args);
    } else {
      Sentry.captureException(args.length === 1 && args[0] instanceof Error ? args[0] : new Error(args.map(String).join(' ')));
    }
  },
};

export default logger;
