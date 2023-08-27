import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Button from '../components/Button';
import { askForNotifPermission } from '../lib/notifications';
import tw from '../lib/tailwind';
import NotificationSellingPoints from '../components/onboarding/NotificationSellingPoints';

export const screenOptions: NativeStackNavigationOptions = {
    presentation: 'modal',
    headerShown: false,
    gestureEnabled: false
}

export default function ApproveNotifications() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    async function promptNotifications() {
        setLoading(true);
        await askForNotifPermission();
        setLoading(false);
        navigation.goBack();
    }

    return (
        <>
            {Platform.OS !== 'android' && <StatusBar animated style="light"/>}

            <View style={tw('items-center p-6 bg-white h-full justify-between')}>
                <View/>

                <View style={tw('gap-6 items-center')}>
                    <Ionicons name="notifications" style={tw('text-accent text-6xl')}/>

                    <Text style={tw('text-3xl font-bold text-center')}>
                        Get the most{'\n'}out of <Text style={tw('text-accent')}>Macalester</Text>
                    </Text>
                </View>

                <NotificationSellingPoints/>

                <View style={tw('gap-2 w-full')}>
                    <Button text="Enable Notifications" loading={loading} size="mega" onPress={promptNotifications}/>
                    <Button text="Maybe Later" color="light" onPress={navigation.goBack}/>
                </View>
            </View>
        </>
    );
}