import { deviceName } from 'expo-device';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { deleteToken, setToken } from './token';
import { get } from './http';

export async function logout() {
    await deleteToken();
}

export async function getLoginUrl() {
    const response = await get<{ redirect_url: string }>('authentication', {
        device: deviceName,
        callback_url: Linking.createURL('')
    });

    return response.redirect_url;
}

export async function login() {
    const loginUrl = await getLoginUrl();
    const result = await WebBrowser.openAuthSessionAsync(loginUrl);

    if(result?.type === 'success') {
        const url = Linking.parse(result.url);
        await setToken(url.queryParams?.token as string);
        // WebBrowser.dismissAuthSession();
    }
}