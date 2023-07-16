import Barcode from '@kichiyaki/react-native-barcode-generator';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as Brightness from 'expo-brightness';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { useEffect, useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import Button from '../components/Button';
import MacPass from '../components/macpass/MacPass';
import tw, { monospace } from '../helpers/tailwind';
import { $user } from '../helpers/user/user-store';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    title: 'MacPass',
    headerShown: false
}

export default function ShowMacPass() {
    const navigation = useNavigation();
    const user = useStore($user);
    const initialBrightness = useRef<number>();

    useEffect(() => {
        (async () => {
            initialBrightness.current = await Brightness.getBrightnessAsync();
            await Brightness.setBrightnessAsync(1);
        })();
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

                    <MotiView
                        delay={200}
                        from={{ rotateX: '50deg', scale: 0.75 }}
                        animate={{ rotateX: '0deg', scale: 1 }}
                        transition={{ type: 'timing', duration: 750 }}
                    >
                        <MacPass/>
                    </MotiView>

                    <View/>

                    <Barcode
                        value={user.macpass_number}
                        format="codabar"
                        background="transparent"
                        height={48}
                        text={user.macpass_number}
                        textStyle={tw('text-xl', { fontFamily: monospace })}
                    />

                    <View/>

                    <Button text="Done" size="mega" onPress={handleClose}/>
                </View>
            </SafeAreaView>
        </>
    );
}