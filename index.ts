import * as Sentry from 'sentry-expo';

Sentry.init({
    dsn: 'https://cc8edcc488814adeb04d0a76b009db35@o4505444279975936.ingest.sentry.io/4505458559156224',
    enableInExpoDevelopment: true,
    debug: __DEV__
});

import 'expo-router/entry';