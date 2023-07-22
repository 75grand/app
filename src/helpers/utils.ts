import * as WebBrowser from 'expo-web-browser';
import { color } from './tailwind';
import { setStatusBarStyle } from 'expo-status-bar';

export async function openBrowser(url: string) {
    setStatusBarStyle('light');

    try {
        await WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
            controlsColor: color('accent')
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