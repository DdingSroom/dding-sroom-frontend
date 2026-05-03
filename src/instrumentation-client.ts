import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

const IGNORED_STATUS_CODES = [401, 403, 404];

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1.0,

  debug: false,

  enabled:
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',

  // [추가] 예상 가능한 API 에러(401,403,404)는 Sentry 전송 제외
  beforeSend(event, hint) {
    const error = hint.originalException;

    if (axios.isAxiosError(error) && error.response) {
      if (IGNORED_STATUS_CODES.includes(error.response.status)) {
        return null;
      }
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
