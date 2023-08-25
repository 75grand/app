import { deviceName } from 'expo-device';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { $localSettings, DEFAULT_SETTINGS } from '../user/settings-store';
import { $token } from '../user/token-store';
import { $user } from '../user/user-store';
import { fetchUser } from './api';
import { StringRecord } from '../types/utils';
import { request } from './http-client';
import { z } from 'zod';

export function logout() {
    $token.set(null);
    $user.set(null);
    $localSettings.set(DEFAULT_SETTINGS);
}

export function isLoggedIn() {
    return $token.get() !== null && $user.get() !== null;
}

function getRedirectUrl() {
    return Linking.createURL('');
}

/**
 * Fetch Google OAuth URL from the server
 * @see https://github.com/75grand/api/blob/71e740f5b493dd377761eaebadca2c9efe2a85d1/app/Http/Controllers/MobileAuthController.php
 */
export async function getLoginUrl(options?: StringRecord) {
    const responseType = z.object({ redirect_url: z.string() });

    const response = await request(responseType, {
        url: 'authentication',
        params: {
            ...options,
            device: deviceName,
            callback_url: getRedirectUrl()
        }
    });

    return response.redirect_url;
}

type LoginResult = { success: true, created: boolean } | { success: false };

/**
 * @returns Whether the user's account was just created
 */
export async function login(referralCode: string = ''): Promise<LoginResult> {
    // Fetch Google OAuth URL from server
    const loginUrl = await getLoginUrl({ referral_code: referralCode });
    const result = await WebBrowser.openAuthSessionAsync(loginUrl, getRedirectUrl());

    if(result.type === 'success') {
        // Retrieve and store authentication token
        const url = Linking.parse(result.url);
        $token.set(url.queryParams?.token as string);

        // Fetch and store user profile
        $user.set(await fetchUser());

        return {
            created: Boolean(url.queryParams?.created),
            success: true
        }
    }

    return {
        success: false
    }
}