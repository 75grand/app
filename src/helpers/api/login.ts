import { deviceName } from 'expo-device';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { $token } from '../user/token-store';
import { $user } from '../user/user-store';
import { fetchUser } from './api';
import { GET } from './http';

export async function logout() {
    $token.set(null);
    $user.set(null);
}

/**
 * Fetch Google OAuth URL from the server
 * @see https://github.com/75grand/api/blob/71e740f5b493dd377761eaebadca2c9efe2a85d1/app/Http/Controllers/MobileAuthController.php
 */
export async function getLoginUrl() {
    const response = await GET<{ redirect_url: string }>('authentication', {
        device: deviceName,
        callback_url: Linking.createURL('')
    });

    return response.redirect_url;
}

export async function login() {
    // Fetch Google OAuth URL from server
    const loginUrl = await getLoginUrl();
    const result = await WebBrowser.openAuthSessionAsync(loginUrl);

    if(result?.type === 'success') {
        // Retrieve and store authentication token
        const url = Linking.parse(result.url);
        $token.set(url.queryParams?.token as string);

        // Fetch and store user profile
        const user = await fetchUser();
        $user.set(user);

        // WebBrowser.dismissAuthSession();
    }
}