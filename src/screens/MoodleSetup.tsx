import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import tw from '../lib/tailwind';
import { patchUser } from '../lib/api/api';
import { $user } from '../lib/user/user-store';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Set Up Moodle',
    presentation: 'modal',
    gestureEnabled: false
}

const MOODLE_PAGE_URL = 'https://moodle.macalester.edu/calendar/export.php';

export default function MoodleSetup() {
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderButtons left>
                    <Item title="Cancel" onPress={navigation.goBack}/>
                </HeaderButtons>
            ),
            headerRight: () => (
                isLoading && <ActivityIndicator/>
            )
        })
    }, [isLoading]);

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
            webView.current.injectJavaScript(`
                const url = document.getElementById('calendarexporturl');

                if(url === null) {
                    document.getElementById('id_events_exportevents_all').click();
                    document.getElementById('id_period_timeperiod_recentupcoming').click();
                    document.getElementById('id_generateurl').click();
                } else {
                    window.ReactNativeWebView.postMessage(
                        'CalURL:' + url.value
                    );
                }
            `);
        }
    }

    async function handleMessage(event: WebViewMessageEvent) {
        const text = event.nativeEvent.data;

        if(text.startsWith('CalURL:')) {
            const url = new URL(text.replace('CalURL:', ''));

            const userId = url.searchParams.get('userid');
            const authToken = url.searchParams.get('authtoken');

            if(userId === null || authToken === null) {
                return;   
            }

            setIsLoading(true);

            const updatedUser = await patchUser({
                moodle_user_id: userId,
                moodle_token: authToken
            });

            $user.set(updatedUser);

            navigation.goBack();
        }
    }

    return (
        <>
            <StatusBar animated style="light"/>

            <View style={tw('h-full bg-gray-200')}>
                <WebView
                    ref={webView}
                    source={{ uri: MOODLE_PAGE_URL }}
                    onLoadStart={handleLoadStart}
                    onError={handleLoadError}
                    onLoad={handleLoad}
                    onMessage={handleMessage}
                />
            </View>
        </>
    );
}