import * as Sentry from '@sentry/nextjs';

import { sentryCommonConfig } from './src/libs/sentry.common';

Sentry.init({
  ...sentryCommonConfig,
});
