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