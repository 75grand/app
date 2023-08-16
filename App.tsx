import * as Sentry from 'sentry-expo';

Sentry.init({
    dsn: 'https://bd1e4216a645640180f9bc5169c65b74@o4505444279975936.ingest.sentry.io/4505713166909440',
    enableInExpoDevelopment: false,
    debug: false
});

import { NavigationContainer, Theme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, UIManager } from 'react-native';
import 'react-native-url-polyfill/auto';
import { HeaderButtonsProvider } from 'react-navigation-header-buttons';
import Routing from './src/Routing';
import { navigationRef } from './src/lib/navigation-ref';
import { registerAndroidNotifChannel as registerNotifChannel, setNotifHandler, syncNotifToken } from './src/lib/notifications';
import { color } from './src/lib/tailwind';

setNotifHandler();

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

if(Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default Sentry.Native.wrap(App);

function App() {
    useEffect(() => {
        registerNotifChannel();
        syncNotifToken();
    }, []);

    return (
        <>
            <StatusBar animated style="auto"/>

            <QueryClientProvider client={queryClient}>
                <NavigationContainer ref={navigationRef} theme={theme}>
                    <HeaderButtonsProvider stackType="native">
                        <Routing/>
                    </HeaderButtonsProvider>
                </NavigationContainer>
            </QueryClientProvider>
        </>
    );
}