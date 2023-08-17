import axios, { AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { ZodType, z } from 'zod';
import { SITE } from '../constants';
import { $token } from '../user/token-store';
import { alertWithFeedback } from '../utils';
import { DateTime } from 'luxon';

export const client = axios.create({
    baseURL: `${SITE}/api/`,
    headers: {
        'User-Agent': `75grand/${Platform.select({
            android: 'Android',
            ios: 'iOS'
        })} ${Constants.expoConfig.version}`
    }
});

// Update token with current value and when it changes
$token.subscribe(token => {
    if(token === null) {
        delete client.defaults.headers.common['Authorization'];
    } else {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
});

export async function request<T extends ZodType>(type: T, options: AxiosRequestConfig & { url: string }): Promise<z.infer<T>|null> {
    const name = `${options.method ?? 'GET'} ${options.url}`;
    console.log(name);

    const requestDate = DateTime.now().toISO();

    try {
        const response = await client.request(options);
        // return await type.parseAsync(response.data);
        const parseResult = await type.safeParseAsync(response.data);

        if(parseResult.success === true) return parseResult.data;
        console.error(`Data from ${name} is invalid`, parseResult.error);

        alertWithFeedback(
            'It’s not you, it’s us',
            'The server sent back invalid data. If this issue persists, please submit feedback.',
            `The server returned invalid data for ${name} at ${requestDate}`
        );
    } catch(error) {
        if(error.response.status !== 404) {
            console.error(`Error with ${name} (${error.response.status})`);
            
            alertWithFeedback(
                error.message || 'It’s not you, it’s us',
                'If this issue persists, please submit feedback.',
                `The server returned a ${error.response.status} error code for ${name} at ${requestDate}`
            );

            throw error;
        }
    }

    return null;
}