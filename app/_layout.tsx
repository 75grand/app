import { ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { color } from '../lib/tailwind';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function() {
    const queryClient = new QueryClient();

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