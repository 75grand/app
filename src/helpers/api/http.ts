import Constants from 'expo-constants';
import { isDevice } from 'expo-device';
import { Platform } from 'react-native';
import { $token } from '../user/token-store';

const BASE = isDevice || Platform.OS === 'android'
    ? 'https://api.75grand.net/api/'
    : 'http://localhost:8000/api/';

// const BASE = 'http://localhost:8000/api/';

export const GET =
    async <T>(path: string, params?: Record<string, string>) => await request<T>('GET', path, params);

export const POST =
    async <T>(path: string, body?) => await request<T>('POST', path, undefined, body);

export const PATCH =
    async <T>(path: string, body?) => await request<T>('PATCH', path, undefined, body);

export const PUT =
    async <T>(path: string, body?) => await request<T>('PUT', path, undefined, body);

export const DELETE =
    async <T>(path: string) => await request<T>('DELETE', path);

/** Make a HTTP request, used to implement method-specific helpers */
async function request<T>(
    method: 'GET'|'POST'|'PATCH'|'PUT'|'DELETE',
    path: string,
    params?: Record<string, string>,
    body?: object
): Promise<T|null> {
    const token = $token.get();
    console.log(`Request: ${method} ${path}`);

    const options: RequestInit = {
        body: body ? JSON.stringify(body) : undefined,
        method: method,        
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'User-Agent': `75grand/${Platform.select({
                android: 'Android',
                ios: 'iOS'
            })} ${Constants.expoConfig.version}`
        }
    }

    // console.log(options);

    let url = BASE + path;
    if(params) url += '?' + new URLSearchParams(params);

    const request = await fetch(url, options);
    if(!request.ok) throw new Error('HTTP Error: ' + request.status);

    try {
        return await request.json();
    } catch {
        return null;
    }
}