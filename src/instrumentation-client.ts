import * as Sentry from '@sentry/nextjs';
import { sentryCommonConfig } from './lib/sentry.common';

Sentry.init({
  ...sentryCommonConfig,

  sendDefaultPii: false,

  integrations: [Sentry.replayIntegration()],

  replaysSessionSampleRate: 0.1,

  replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
