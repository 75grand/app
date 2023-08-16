import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { patchUser } from './api/api';
import { color } from './tailwind';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { $user } from './user/user-store';

/**
 * Set the notification handler
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/#setnotificationhandlerhandler
 */
export function setNotifHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false
        })
    });
}

/**
 * Register a notification channel if on Android and notifications are enabled
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/#handling-notification-channels
 * @see https://developer.android.com/develop/ui/views/notifications/channels
 */
export function registerAndroidNotifChannel() {
    if(Platform.OS === 'android' && areNotifsGranted()) {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: color('accent') // ...ok
        });
    }
}

/**
 * Check if permission to send notifications is granted. Push notifications
 * only work on physical devices, so it will return true in emulators.
 */
export async function areNotifsGranted(): Promise<boolean> {
    if(!Device.isDevice) return true;
    return (await Notifications.getPermissionsAsync()).granted;
}

/**
 * Sync the notification token with the server
 * @see https://docs.expo.dev/push-notifications/sending-notifications/
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/#getexpopushtokenasyncoptions
 * @see https://github.com/75grand/api/blob/main/app/Http/Controllers/UserController.php
 */
export async function syncNotifToken() {
    if($user.get() === null) return;

    if(await areNotifsGranted()) {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const token = await Notifications.getExpoPushTokenAsync({ projectId });
        await patchUser({ expo_token: token.data });
    } else {
        await patchUser({ expo_token: null });
    }
}

/**
 * Prompts the user for permission to send notifications
 * @see https://docs.expo.dev/push-notifications/push-notifications-setup/
 */
export async function askForNotifPermission() {
    if(!Device.isDevice) {
        alert('Push notifications are not supported in emulators; use a physical device instead.');
        return;
    }

    // Get current status, before any request for permission
    const { status: currentStatus } = await Notifications.getPermissionsAsync();

    if(currentStatus === 'undetermined') {
        // Ask for notification permissions
        // We need to check twice so we don't open settings when denied
        const { status } = await Notifications.requestPermissionsAsync();

        if(status === 'granted') {
            syncNotifToken();
            registerAndroidNotifChannel();
        }
    } else if(currentStatus === 'denied') {
        // Open system settings for app
        await Linking.openSettings();
    }
}