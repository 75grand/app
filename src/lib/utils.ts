import { setStatusBarStyle } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { color } from './tailwind';

export async function openBrowser(url: string) {
    setStatusBarStyle('light');

    try {
        await WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
            controlsColor: color('accent'),
            dismissButtonStyle: 'close'
        });
    } finally {
        setStatusBarStyle('auto');
    }
}

/**
 * Generate a wsrv.nl URL for an image
 * @see https://wsrv.nl/docs/quick-reference.html
 */
export function getCdnUrl(url: string, width: number, height: number) {
    const query = new URLSearchParams({
        url: url,
        w: String(width),
        h: String(height),
        q: '0.8',
        output: 'webp'
    });

    return 'https://wsrv.nl/?' + query.toString();
}

/**
 * Display an alert dialog with the option to provide feedback
 */
export function alertWithFeedback(alertTitle: string, alertMessage: string, feedbackMessage: string) {
    Alert.alert(alertTitle, alertMessage, [
        // {
        //     text: 'Submit Feedback',
        //     onPress: () => navigation.navigate('Feedback', { message: feedbackMessage })
        // },
        {
            text: 'Close',
            style: 'default'
        }
    ]);
}