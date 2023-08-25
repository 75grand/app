import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ImageBackground } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import AnimatedRing from '../components/AnimatedRing';
import Button from '../components/Button';
import Logo from '../components/Logo';
import ReferralInput from '../components/login/ReferralInput';
import { login } from '../lib/api/login';
import tw from '../lib/tailwind';

export const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: 'flip'
}

export default function LoginWall() {
    const navigation = useNavigation();

    const [loginLoading, setLoginLoading] = useState(false);
    const [referralLoading, setReferralLoading] = useState(false);

    async function handleLoginPress(referralCode?: string) {
        setLoginLoading(true);
        const result = await login(referralCode);
        setLoginLoading(false);

        if(result.success) {
            navigation.dispatch(
                StackActions.replace(
                    result.created ? 'Onboarding' : 'Tabs'
                )
            );
        }
    }

    async function handleReferralLogin(referralCode: string) {
        setReferralLoading(true);
        const result = await login(referralCode);
        setReferralLoading(false);

        if(result.success) {
            navigation.dispatch(
                StackActions.replace(
                    result.created ? 'Onboarding' : 'Tabs'
                )
            );
        }
    }

    return (
        <>
            <StatusBar animated style="light"/>

            <ImageBackground blurRadius={15} source={require('../../assets/weyerhaeuser.jpg')}>
                <SafeAreaView style={tw('h-full')}>
                    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: 'height' })}>
                        <View style={tw('p-3 h-full justify-between')}>
                            <View/>

                            <AnimatedRing text="Your Portal to Macalester">
                                <Logo version="icon"/>
                            </AnimatedRing>

                            <View/>

                            <View style={tw('gap-2 w-full')}>
                                <Button text="Login with @macalester.edu" size="mega" onPress={handleLoginPress} loading={loginLoading}/>
                                <ReferralInput setValue={handleReferralLogin} isLoading={referralLoading}/>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}