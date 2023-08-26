import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { deepLinkRouting } from '../Routing';
import { isLoggedIn } from './api/login';

/**
 * Handle navigation for notifications and deep links
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/#handle-push-notifications-with-navigation
 */
export const navigationLinking: LinkingOptions<any> = {
    prefixes: [
        Linking.createURL('/')
    ],
    config: {
        screens: deepLinkRouting
    },
    async getInitialURL() {
        // Check if app was opened from a deep link
        const url = await Linking.getInitialURL();
        if(url !== null) return url;

        // Handle URL from push notification
        const response = await Notifications.getLastNotificationResponseAsync();
        return response?.notification.request.content.data.url;
    },
    subscribe(listener) {
        if(!isLoggedIn()) return;

        const onReceiveURL = ({ url }) => listener(url);

        // Listen to incoming links from deep linking
        const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);

        // Listen to push notifications
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            listener(
                response.notification.request.content.data.url
            );
        });

        // Clean up event listeners
        return () => {
            eventListenerSubscription.remove();
            subscription.remove();
        }
    }
}