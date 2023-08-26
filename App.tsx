import * as Sentry from 'sentry-expo';

Sentry.init({
    dsn: 'https://bd1e4216a645640180f9bc5169c65b74@o4505444279975936.ingest.sentry.io/4505713166909440',
    enableInExpoDevelopment: false,
    debug: false
});

import { NavigationContainer, Theme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto';
import { HeaderButtonsProvider } from 'react-navigation-header-buttons';
import Routing from './src/Routing';
import { boot } from './src/lib/boot';
import { navigationRef } from './src/lib/navigation-ref';
import { color } from './src/lib/tailwind';
import { navigationLinking } from './src/lib/deep-linking';

const theme: Theme = {
    dark: false,
    colors: {
        primary: color('accent'),
        background: color('gray-100'),
        card: color('white'),
        text: color('black'),
        border: 'rgba(0, 0, 0, 0.1)',
        notification: color('red')
    }
};

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default Sentry.Native.wrap(() => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            await boot();
            setIsReady(true);
            setTimeout(SplashScreen.hideAsync);
        })();
    }, []);

    if(!isReady) return;

    return (
        <>
            <StatusBar animated style="auto"/>

            <QueryClientProvider client={queryClient}>
                <NavigationContainer linking={navigationLinking} ref={navigationRef} theme={theme}>
                    <HeaderButtonsProvider stackType="native">
                        <Routing/>
                    </HeaderButtonsProvider>
                </NavigationContainer>
            </QueryClientProvider>
        </>
    );
});