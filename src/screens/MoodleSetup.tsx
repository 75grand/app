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
    const [isCollectingData, setIsCollectingData] = useState(false);

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
            setIsCollectingData(true);

            webView.current.injectJavaScript(`
                const result = document.getElementById('calendarexporturl');

                if(result === null) {
                    const ids = [
                        'id_events_exportevents_all', // All events
                        'id_period_timeperiod_recentupcoming', // Recent and next 60 days
                        'id_generateurl' // Get calendar URL
                    ];

                    for(let i = 0; i < ids.length; i++) {
                        setTimeout(() => {
                            const element = document.getElementById(ids[i]);
                            element.scrollIntoView({ behavior: 'smooth' });
                            element.click();
                        }, i * 500);
                    }
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

        setIsCollectingData(false);

        navigation.goBack();
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

                {isCollectingData && (
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