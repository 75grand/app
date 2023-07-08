import { NavigationContainer, Theme } from '@react-navigation/native';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { StatusBar } from 'expo-status-bar';
import Routing from './src/Routing';
import { color } from './src/helpers/tailwind';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                cacheTime: 1000 * 60 * 60 * 24
            }
        }
    });

    const persistOptions = {
        persister: createAsyncStoragePersister({
            storage: AsyncStorage
        })
    };

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

    return (
        <>
            <StatusBar style="auto"/>

            <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
                <NavigationContainer theme={theme}>
                    <Routing/>
                </NavigationContainer>
            </PersistQueryClientProvider>
        </>
    );
}