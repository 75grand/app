import { ActivityIndicator, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import tw, { color as _color } from '../lib/tailwind';
import { useRouter } from 'expo-router';
import { Href } from 'expo-router/build/link/href';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
    text: string,
    href?: Href,
    onPress?: () => void,
    color?: 'accent'|'light'|'faint'|'red',
    loading?: boolean
}

export default function Button({ text, href, onPress, color = 'accent', loading = false }: ButtonProps) {
    const router = useRouter();
    if(href) onPress = () => router.push(href);

    const textColor = {
        accent: _color('white'),
        light: _color('accent'),
        faint: _color('white'),
        red: _color('white')
    }[color];

    const bgColor = {
        accent: tw('bg-accent'),
        light: tw('bg-white'),
        faint: tw('bg-white/20'),
        red: tw('bg-red')
    }[color];

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={tw('rounded-lg px-2.5 py-1.5 relative justify-center', bgColor)}
            onPress={() => {
                if(loading) return;
                onPress();
                Haptics.selectionAsync();
            }}
        >
            {loading && (
                <ActivityIndicator style={tw('absolute self-center')} color={textColor}/>
            )}

            <Text style={tw('font-medium', { color: textColor }, loading && 'opacity-0')}>{text}</Text>
        </TouchableOpacity>
    )
}