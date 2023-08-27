import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as StoreReview from 'expo-store-review';
import { Platform, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AnimatedRing from '../components/AnimatedRing';
import Link from '../components/Link';
import Logo from '../components/Logo';
import UserItem from '../components/UserItem';
import { SITE } from '../lib/constants';
import tw from '../lib/tailwind';

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        title: 'About',
        presentation: 'modal',
        headerShadowVisible: false,
        headerLeft: () => (
            <HeaderButtons left>
                <Item title="Close" onPress={navigation.goBack}/>
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons>
                <Item title="Review" onPress={StoreReview.requestReview}/>
            </HeaderButtons>
        )
    }
}

export default function AboutTheApp() {
    return (
        <>
            {Platform.OS !== 'android' && <StatusBar animated style="light"/>}

            <View style={tw('items-center p-8 gap-8 bg-white h-full')}>
                <AnimatedRing text="Your Portal to Macalester" color="black">
                    <Logo version="icon"/>
                </AnimatedRing>

                <Text style={tw('text-xl text-center')}>
                    75grand is a student-made app for the Macalester community
                </Text>

                <Text style={tw('text-base text-center')}>
                    The source code for the <Link href="https://github.com/75grand/app">React Native app</Link>
                    {' '} and the <Link href="https://github.com/75grand/api">Laravel API</Link> is on GitHub.
                </Text>

                <UserItem
                    name="Jerome Paulos"
                    subtitle="Class of 2026"
                    avatar={`${SITE}/assets/jerome.jpg`}
                />
            </View>
        </>
    );
}