import { setStatusBarStyle } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { color } from './tailwind';
import { navigateWithRef } from './navigation-ref';
import { AnyZodObject, z } from 'zod';

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
        {
            text: 'Submit Feedback',
            onPress: () => navigateWithRef('Feedback', { message: feedbackMessage })
        },
        {
            text: 'Close',
            style: 'cancel'
        }
    ]);
}

export function objectToFormData(object: object): FormData {
    const formData = new FormData();
    
    for(const key in object) {
        const value = object[key];
        formData.append(key, value);
    }

    return formData;
}

/**
 * Given an existing Zod type, merge an object of defaults into it
 * @returns A new Zod type with the default values added as strings
 */
export function mergeDefaultsForInput<T extends AnyZodObject>(type: T, defaults: Partial<z.infer<T>>): T {
    for(const key in type.shape) {
        if(key in defaults) {
            type.shape[key] = type.shape[key].default(String(defaults[key]));
        }
    }

    return type;
}