import Barcode from '@kichiyaki/react-native-barcode-generator';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as Brightness from 'expo-brightness';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import Button from '../components/Button';
import MacPass from '../components/macpass/MacPass';
import tw, { monospace } from '../lib/tailwind';
import { $localSettings } from '../lib/user/settings-store';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'fullScreenModal',
    title: 'MacPass',
    headerShown: false,
    animation: 'flip'
}

export default function ShowMacPass() {
    const navigation = useNavigation();
    const settings = useStore($localSettings);
    const initialBrightness = useRef<number>();

    useEffect(() => {
        const timeout = setTimeout(async () => {
            initialBrightness.current = await Brightness.getBrightnessAsync();
            await Brightness.setBrightnessAsync(1);
        }, 750);

        return () => clearTimeout(timeout);
    }, []);

    async function handleClose() {
        await Brightness.setBrightnessAsync(initialBrightness.current);
        navigation.goBack();
    }

    return (
        <>
            <StatusBar animated style="dark"/>

            <SafeAreaView style={tw('bg-white')}>
                <View style={tw('p-8 h-full justify-between')}>
                    <View/>

                    <MacPass/>

                    <View/>

                    <Barcode
                        value={settings.macPass}
                        format="codabar"
                        background="transparent"
                        height={48}
                        text={settings.macPass}
                        textStyle={tw('text-xl', { fontFamily: monospace })}
                    />

                    <View/>

                    <Button text="Done" size="mega" onPress={handleClose}/>
                </View>
            </SafeAreaView>
        </>
    );
}