'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

type SentryCapturedError = Error & {
  digest?: string;
  __sentry_captured__?: boolean;
};

interface GlobalErrorProps {
  error: SentryCapturedError;
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (error.__sentry_captured__) return;
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <h2>⚠️오류가 발생했습니다</h2>
        <button type="button" onClick={reset}>
          다시 시도
        </button>
      </body>
    </html>
  );
}
