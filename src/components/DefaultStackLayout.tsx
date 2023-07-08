import { Stack } from 'expo-router';
import { View } from 'react-native';
import tw, { color } from '../helpers/tailwind';

export default function DefaultStackLayout({ children }) {
    return (
        <Stack screenOptions={{
            headerShadowVisible: false,
            headerBackground: () => <View style={tw('w-full h-full bg-white border-b border-black/10')}/>
        }}>{children}</Stack>
    );
}