import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Button from '../components/Button';
import { askForNotifPermission } from '../lib/notifications';
import tw from '../lib/tailwind';

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
            <StatusBar animated style="light"/>

            <View style={tw('items-center p-6 bg-white h-full justify-between')}>
                <View/>

                <View style={tw('gap-6 items-center')}>
                    <Ionicons name="notifications" style={tw('text-accent text-6xl')}/>

                    <Text style={tw('text-3xl font-bold text-center')}>
                        Get the most{'\n'}out of <Text style={tw('text-accent')}>Macalester</Text>
                    </Text>
                </View>

                <View style={tw('gap-6 w-full')}>
                    <SellingPoint
                        icon="calendar"
                        title="Event Notifications"
                        text="Sign up to be notified about events happening around campus"
                    />

                    <SellingPoint
                        icon="restaurant"
                        title="Favorite Food (coming soon)"
                        text="Get notified when Café Mac serves your favorite foods"
                    />

                    <SellingPoint
                        icon="car"
                        title="Carpooling (coming soon)"
                        text="Coordinate rides to the airport, Minneapolis, nature, and more"
                    />

                    <SellingPoint
                        icon="star"
                        title="New Features"
                        text="Occasional notifications when major features are added to 75grand"
                    />
                </View>

                <View style={tw('gap-2 w-full')}>
                    <Button text="Enable Notifications" loading={loading} size="mega" onPress={promptNotifications}/>
                    <Button text="Maybe Later" color="light" onPress={navigation.goBack}/>
                </View>
            </View>
        </>
    );
}

function SellingPoint({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap, title: string, text: string }) {
    return (
        <View style={tw('flex flex-row gap-6 items-center')}>
            <Ionicons style={tw('text-3xl text-accent')} name={icon}/>

            <View style={tw('shrink')}>
                <Text style={tw('text-base font-semibold')}>{title}</Text>
                <Text style={tw('text-base text-gray-500 leading-tight')}>{text}</Text>
            </View>
        </View>
    );
}