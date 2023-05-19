import { Stack, Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw, { color } from '../../lib/tailwind';

// screenOptions={{
//     headerTintColor: color('accent'),
//     headerTitleStyle: tw('text-black'),
//     headerShadowVisible: false,
//     headerBackground: () => <View style={tw('w-full h-full border-b bg-white border-black/10')}/>
// }}

export default function Layout() {
    return (
        <Tabs screenOptions={{
            headerStyle: tw('border-b border-b-black/10 shadow-transparent'),
            tabBarStyle: tw('border-t border-t-black/10'),
            tabBarShowLabel: false,
            headerShown: false
        }}>
            <Tabs.Screen name="home" options={{
                title: 'Home',
                // tabBarIcon: (props) => <MaterialCommunityIcons {...props} name="home"/>,
                tabBarIcon: (props) => <Ionicons {...props} name="home"/>,
            }}/>

            <Tabs.Screen name="calendar" options={{
                title: 'Calendar',
                tabBarIcon: (props) => <Ionicons {...props} name="calendar"/>
            }}/>

            <Tabs.Screen name="map" options={{
                title: 'Map',
                tabBarIcon: (props) => <Ionicons {...props} name="map"/>
            }}/>

            <Tabs.Screen name="menus" options={{
                title: 'Menus',
                tabBarIcon: (props) => <Ionicons {...props} name="restaurant"/>
            }}/>

            <Tabs.Screen name="building-hours" options={{
                title: 'Hours',
                tabBarIcon: (props) => <Ionicons {...props} name="time"/>
            }}/>
        </Tabs>
    );
}