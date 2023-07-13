import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-url-polyfill/auto';
import Routing from './src/Routing';
import { registerAndroidNotifChannel as registerNotifChannel, setNotifHandler, syncNotifToken } from './src/helpers/notifications';
import { color } from './src/helpers/tailwind';
import { HeaderButtonsProvider } from 'react-navigation-header-buttons';

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

const persistOptions = {
    persister: createAsyncStoragePersister({
        storage: AsyncStorage
    })
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24
        }
    }
});

export default function App() {
    useEffect(() => {
        registerNotifChannel();
        syncNotifToken();
    }, []);

    return (
        <>
            <StatusBar style="auto" animated={true}/>

            <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
                <NavigationContainer theme={theme}>
                    <HeaderButtonsProvider stackType="native">
                        <Routing/>
                    </HeaderButtonsProvider>
                </NavigationContainer>
            </PersistQueryClientProvider>
        </>
    );
}