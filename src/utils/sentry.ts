import * as Sentry from '@sentry/react-native';

export default () => {
  if (__DEV__) return;

  console.log('[SENTRY] Initializing...');

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('[SENTRY] No DSN URL was provided!');
  } else {
    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      integrations: __DEV__
        ? [
          Sentry.reactNativeTracingIntegration({
            shouldCreateSpanForRequest: (url) => !url.startsWith('http://'),
          }),
        ]
        : [],
      debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
      ignoreErrors,
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
  if (!result && sendReport) {
    Sentry.captureMessage(`String ${str} mismatched with regex ${regex}`, 'error');
  }
  return result;
};

export const ignoreErrors = [
  // sp-react-native-in-app-updates throws when neither immediate nor flexible
  // Play Core update is allowed (e.g. sideloaded APK / store state). It is
  // non-critical and swallowed by the caller, so suppress it either way it surfaces.
  /sp-react-native-in-app-updates|Update type unavailable/,
  'ExpoBackgroundTask.registerTaskAsync',
  'ExpoFontLoader',
  'OutOfMemoryError',
];
