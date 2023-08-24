import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { patchUser } from '../lib/api/api';
import tw from '../lib/tailwind';
import { $user } from '../lib/user/user-store';

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        title: 'Set Up Moodle',
        presentation: 'modal',
        gestureEnabled: false,
        headerShown: true,
        headerLeft: () => (
            <HeaderButtons left>
                <Item title="Cancel" onPress={navigation.goBack}/>
            </HeaderButtons>
        )
    }
}

const MOODLE_PAGE_URL = 'https://moodle.macalester.edu/calendar/export.php';

export default function MoodleSetup() {
    const navigation = useNavigation();
    const params = useRoute().params as any;

    const [isLoading, setIsLoading] = useState(true);

    const webView = useRef<WebView>();

    function handleLoadStart() {
        setIsLoading(true);
    }

    function handleLoadError() {
        alert('Something went wrong, please try again later');
        navigation.goBack();
    }

    function handleLoad(event: WebViewNavigationEvent) {
        setIsLoading(false);

        if(event.nativeEvent.url.startsWith(MOODLE_PAGE_URL)) {
            setIsLoading(true);

            webView.current.injectJavaScript(`
                const result = document.getElementById('calendarexporturl');

                if(result === null) {
                    document.getElementById('id_events_exportevents_all').click();
                    document.getElementById('id_period_timeperiod_recentupcoming').click();
                    document.getElementById('id_generateurl').click();
                } else {
                    window.ReactNativeWebView.postMessage(result.value);
                }
            `);
        }
    }

    async function handleMessage(event: WebViewMessageEvent) {
        const url = new URL(event.nativeEvent.data);

        const userId = url.searchParams.get('userid');
        const authToken = url.searchParams.get('authtoken');

        if(userId === null || authToken === null) {
            return;   
        }

        const updatedUser = await patchUser({
            moodle_user_id: userId,
            moodle_token: authToken
        });

        $user.set(updatedUser);

        setIsLoading(false);

        navigation.goBack();
        if(params?.onSetupEnd) params.onSetupEnd();
    }

    return (
        <>
            <StatusBar animated style="light"/>

            <View style={tw('h-full bg-gray-200 relative')}>
                <WebView
                    ref={webView}
                    source={{ uri: MOODLE_PAGE_URL }}
                    onLoadStart={handleLoadStart}
                    onError={handleLoadError}
                    onLoad={handleLoad}
                    onMessage={handleMessage}
                />

                {isLoading && (
                    <View style={tw('absolute w-full h-full bg-accent/90 justify-center items-center gap-4')}>
                        <ActivityIndicator color="white" size="large"/>

                        <Text style={tw('text-white text-2xl font-semibold text-center')}>
                            Loading
                        </Text>
                    </View>
                )}
            </View>
        </>
    );
}