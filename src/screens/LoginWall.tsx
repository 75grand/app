import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { login } from '../helpers/api/login';
import { Alert, SafeAreaView, View } from 'react-native';
import tw from '../helpers/tailwind';
import { useState } from 'react';

export const screenOptions: NativeStackNavigationOptions = {
    headerShown: false
}

export default function LoginWall() {
    const [loginLoading, setLoginLoading] = useState(false);
    const [referralLoading, setReferralLoading] = useState(false);

    async function handleLoginPress() {
        setLoginLoading(true);
        const created = await login();
        // TODO: Go to page to configure account, etc.
        alert('User created? ' + created);
        setLoginLoading(false);
    }

    async function handleReferralPress() {
        Alert.prompt('Enter your referral code', '', async value => {
            setReferralLoading(true);
            const created = await login(value);
            alert('User created? ' + created);
            setReferralLoading(false);
        });
    }

    return (
        <SafeAreaView style={tw('bg-white h-full')}>
            <View style={tw('p-3')}>
                <View style={tw('gap-2 w-full')}>
                    <Button text="Login with @macalester.edu" size="mega" onPress={handleLoginPress} loading={loginLoading}/>
                    <Button text="Use Referral Code" color="light" onPress={handleReferralPress}/>
                </View>
            </View>
        </SafeAreaView>
    );
}