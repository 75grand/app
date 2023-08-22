import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import * as StoreReview from 'expo-store-review';
import { Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AnimatedRing from '../components/AnimatedRing';
import Link from '../components/Link';
import Logo from '../components/Logo';
import { SITE } from '../lib/constants';
import tw from '../lib/tailwind';

export function screenOptions({ navigation }): NativeStackNavigationOptions {
    return {
        title: 'About 75grand',
        presentation: 'modal',
        headerShadowVisible: false,
        headerLeft: () => (
            <HeaderButtons left>
                <Item title="Close" onPress={navigation.goBack}/>
            </HeaderButtons>
        ),
        headerTitle: () => (
            <View style={{ transform: [{ scale: 0.9 }] }}>
                <Logo/>
            </View>
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
            <StatusBar animated style="light"/>

            <View style={tw('items-center p-8 gap-8 bg-white h-full')}>
                <AnimatedRing text="Jerome Paulos" color="black">
                    <Image
                        source={`${SITE}/assets/jerome.jpg`}
                        style={tw('w-32 h-32 rounded-full bg-gray-200')}
                    />
                </AnimatedRing>

                <Text style={tw('text-xl text-center')}>
                    75grand is a student-made app for the Macalester community
                </Text>

                <Text style={tw('text-base text-center')}>
                    The source code for the <Link href="https://github.com/75grand/app">React Native app</Link>
                    {' '} and the <Link href="https://github.com/75grand/api">Laravel API</Link> is on GitHub.
                </Text>
            </View>
        </>
    );
}