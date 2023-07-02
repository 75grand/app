import { ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { color } from '../lib/tailwind';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';

export default Sentry.wrap(App);

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                cacheTime: 1000 * 60 * 60 * 24
            }
        }
    });

    const theme = {
        dark: false,
        colors: {
            primary: color('accent'),
            background: color('gray-100'),
            card: color('white'),
            text: color('black'),
            border: 'rgba(0, 0, 0, 0.1)',
            notification: color('red')
        }
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={theme}>
                <Slot/>
            </ThemeProvider>
        </QueryClientProvider>
    );
}