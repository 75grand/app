import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ImageBackground } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, SafeAreaView, View } from 'react-native';
import Button from '../components/Button';
import AnimatedLogoIcon from '../components/login/AnimatedLogoIcon';
import { login } from '../lib/api/login';
import tw from '../lib/tailwind';
import { useNavigation } from '@react-navigation/native';

export const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: 'flip'
}

export default function LoginWall() {
    const navigation = useNavigation();
    const [loginLoading, setLoginLoading] = useState(false);
    const [referralLoading,] = useState(false);

    async function handleLoginPress(referralCode?: string) {
        setLoginLoading(true);
        const created = await login(referralCode);
        setLoginLoading(false);

        // @ts-expect-error
        navigation.navigate(created ? 'Onboarding' : 'Tabs');
    }

    async function handleReferralPress() {
        Alert.prompt('Enter a referral code', '', async value => {
            await handleLoginPress(value);
        });
    }

    return (
        <>
            <StatusBar animated style="light"/>

            <ImageBackground blurRadius={15} source={require('../../assets/weyerhaeuser.jpg')}>
                <SafeAreaView style={tw('h-full')}>
                    <View style={tw('p-3 h-full justify-between')}>
                        <View/>

                        <AnimatedLogoIcon/>

                        <View/>

                        <View style={tw('gap-2 w-full')}>
                            <Button text="Login with @macalester.edu" size="mega" onPress={handleLoginPress} loading={loginLoading}/>
                            <Button text="Use a Referral Code" size="mega" color="faint-white" onPress={handleReferralPress} loading={referralLoading}/>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}