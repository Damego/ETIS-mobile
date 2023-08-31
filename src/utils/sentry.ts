import * as SentryExpo from 'sentry-expo';

export default () => {
  console.log('[SENTRY] Initializing...');

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('[SENTRY] No DSN URL was provided!');
  } else {
    SentryExpo.init({
      dsn,
      tracesSampleRate: 1.0,
      enableInExpoDevelopment: false,
      debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    });
  }
};
