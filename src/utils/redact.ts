/**
 * Маскировка персональных данных (логин, пароль, e-mail, сессионные куки),
 * чтобы они не покидали устройство через логи или Sentry.
 *
 * Применяется в двух местах: при сборке лог-сообщений (`utils/http.ts`,
 * `utils/logger.ts`) и в Sentry `beforeSend` (`utils/sentry.ts`) — как
 * последняя линия обороны от утечки в сериализованных ошибках.
 */

const REDACTED = '[redacted]';

// Точные имена полей форм ЕТИС и стандартных секретов: p_password, p_old, ...
const EXACT_SENSITIVE_KEY_RE =
  /^(?:p_)?(?:password|username|email|old|new|new_confirm|login|sessionid|sessid)$/i;
// Подстрочные совпадения на случай нестандартных имён: userPassword, apiToken, setCookie, ...
const PARTIAL_SENSITIVE_KEY_RE = /pass|pwd|secret|token|cookie|authorization/i;

const isSensitiveKey = (key: string) =>
  EXACT_SENSITIVE_KEY_RE.test(key) || PARTIAL_SENSITIVE_KEY_RE.test(key);

/**
 * Маскирует присваивания в произвольных строках: URL-encoded тела запросов
 * (`p_password=...`), заголовки (`Cookie: ...`) и JSON (`"p_password":"..."`).
 */
const SENSITIVE_ASSIGNMENT_RE =
  /\b((?:p_)?(?:password|username|email|old|new|login|sessionid|sessid|token|secret|cookie|authorization)(?:_confirm)?["']?\s*[=:]\s*["']?)[^;&"',]*/gi;

export const redactString = (value: string): string =>
  value.replace(SENSITIVE_ASSIGNMENT_RE, '$1' + REDACTED);

const MAX_REDACTION_DEPTH = 10;

/**
 * Глубоко копирует значение, заменяя значения чувствительных ключей на
 * `[redacted]` и маскируя чувствительные присваивания в строках.
 * Экзотические объекты без enumerable-свойств (FormData) превращаются
 * в `{}` — как и при обычном `JSON.stringify`.
 */
export const redactSensitiveData = (value: unknown, depth = 0): unknown => {
  if (typeof value === 'string') {
    return redactString(value);
  }
  if (value === null || typeof value !== 'object' || depth >= MAX_REDACTION_DEPTH) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      isSensitiveKey(key) ? REDACTED : redactSensitiveData(item, depth + 1),
    ])
  );
};
