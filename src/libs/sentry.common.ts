import { type init } from '@sentry/nextjs';
import axios from 'axios';

type SentryOptions = NonNullable<Parameters<typeof init>[0]>;

const IGNORED_STATUS_CODES = [401, 403, 404];

const isSentryTestEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true';

export const sentryCommonConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: isSentryTestEnabled ? 1.0 : 0.1,

  debug: false,

  enabled:
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',

  beforeSend(event, hint) {
    const error = hint.originalException;

    if (axios.isAxiosError(error) && error.response) {
      if (IGNORED_STATUS_CODES.includes(error.response.status)) {
        return null;
      }
    }

    return event;
  },
} satisfies SentryOptions;
