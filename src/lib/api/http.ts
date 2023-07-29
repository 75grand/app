import Constants from 'expo-constants';
import { isDevice } from 'expo-device';
import { Platform } from 'react-native';
import { $token } from '../user/token-store';

export const SITE = (isDevice || Platform.OS === 'android')
    ? 'https://api.75grand.net'
    : 'http://localhost:8000';

const BASE = SITE + '/api/';

export const GET =
    async <T>(path: string, params?: Record<string, string>) => await request<T>('GET', path, params);

export const POST =
    async <T>(path: string, body?, formRequest = false) => await request<T>('POST', path, undefined, body, formRequest);

export const PATCH =
    async <T>(path: string, body?, formRequest = false) => await request<T>('PATCH', path, undefined, body, formRequest);

export const PUT =
    async <T>(path: string, body?, formRequest = false) => await request<T>('PUT', path, undefined, body, formRequest);

export const DELETE =
    async <T>(path: string) => await request<T>('DELETE', path);

/** Make a HTTP request, used to implement method-specific helpers */
async function request<T>(
    method: 'GET'|'POST'|'PATCH'|'PUT'|'DELETE',
    path: string,
    params?: Record<string, string>,
    body?: object,
    formRequest = false
): Promise<T|null> {
    const token = $token.get();
    console.log(`Request: ${method} ${path}`);

    const options: RequestInit = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'User-Agent': `75grand/${Platform.select({
                android: 'Android',
                ios: 'iOS'
            })} ${Constants.expoConfig.version}`
        }
    }

    if(body) {
        if(formRequest) {
            const formData = new FormData();

            for(const key in body) {
                formData.append(key, body[key]);
            }

            options.headers['Content-Type'] = 'multipart/form-data';
            options.body = formData;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
    }

    let url = BASE + path;
    if(params) url += '?' + new URLSearchParams(params);

    const request = await fetch(url, options);
    if(request.status === 404) return null;
    if(!request.ok) throw new Error('HTTP Error: ' + request.status);

    try {
        return await request.json();
    } catch {
        return null;
    }
}

/**
 * I would like to die now please
 * @see https://gist.github.com/AshikNesin/ca4ad1ff1d24c26cb228a3fb5c72e0d5
 */
export async function base64toFile(base64: string, fileName: string): Promise<File> {
    const request = await fetch(base64);
    const blob = await request.blob();
    return new File([blob], fileName);
}