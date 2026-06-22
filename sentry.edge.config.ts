import * as Sentry from '@sentry/nextjs';
import { sentryCommonConfig } from './src/lib/sentry.common';

Sentry.init({
  ...sentryCommonConfig,
});
