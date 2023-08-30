import { setStatusBarStyle } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { DateTime } from 'luxon';
import { Alert } from 'react-native';
import { AnyZodObject, ZodRawShape, z } from 'zod';
import { navigateWithRef } from './navigation-ref';
import { color } from './tailwind';

export async function openBrowser(url: string, options: Partial<WebBrowser.WebBrowserOpenOptions> = {}) {
    setStatusBarStyle('light');

    try {
        await WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
            controlsColor: color('accent'),
            dismissButtonStyle: 'close',
            ...options
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
 * @returns A new Zod type with the default values
 */
export function mergeDefaultsForInput<T extends AnyZodObject>(type: T, defaults: Partial<z.infer<T>>): T {
    const shape: ZodRawShape = {};

    for(const key in type.shape) {
        shape[key] = type.shape[key];

        if(key in defaults) {
            shape[key] = shape[key].default(`${defaults[key]}`);
        }
    }

    return z.object(shape) as T;
}

/**
 * Generate class years for the current year
 */
export function getClassYears(year = DateTime.now().year): number[] {
    return [...Array(5).keys()].map(i => year + i);
}