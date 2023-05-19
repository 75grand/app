import { isDevice } from 'expo-device';
import { Platform } from 'react-native';
import { getToken } from './token';

export const BASE = isDevice || Platform.OS === 'android' ? 'https://api.75grand.net' : 'http://localhost:8000';
export const API_BASE = BASE + '/api/';

export async function get<T extends object>(path: string, params: Record<string, string> = {}): Promise<T> {
    console.log(`Fetching /api/${path}`);

    const token = await getToken();
    const url = API_BASE + path + '?' + new URLSearchParams(params);

    const request = await fetch(url, {
        headers: {
            Accepts: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });

    return await request.json();
}