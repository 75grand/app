import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import tw, { color as getColor } from '../helpers/tailwind';

interface Props {
    text: string,
    onPress?: () => void,
    color?: 'accent'|'light'|'translucent'|'red'|'gray',
    loading?: boolean,
    size?: 'small'|'mega',
    disabled?: boolean
}

export default function Button({ text, onPress, color = 'accent', loading = false, size = 'small', disabled = false }: Props) {
    disabled = disabled || loading;

    const textColor = {
        accent: getColor('white'),
        light: getColor('accent'),
        translucent: getColor('white'),
        red: getColor('white'),
        gray: getColor('black')
    }[color];

    const bgColor = {
        accent: tw('bg-accent'),
        light: tw('bg-white'),
        translucent: tw('bg-white/20'),
        red: tw('bg-red'),
        gray: tw('bg-gray-200')
    }[color];

    const sizeStyle = {
        small: tw('rounded-lg px-2.5 py-1.5'),
        mega: tw('rounded-xl px-5 py-3.5')
    }[size];

    return (
        <TouchableOpacity
            disabled={disabled}
            activeOpacity={0.5}
            style={tw('relative justify-center', bgColor, sizeStyle, disabled && 'opacity-75')}
            onPress={() => {
                if(disabled) return;
                onPress();
                Haptics.selectionAsync();
            }}
        >
            {loading && (
                <ActivityIndicator style={tw('absolute self-center')} color={textColor}/>
            )}

            <Text style={tw('font-semibold mx-auto', { color: textColor }, loading && 'opacity-0')}>{text}</Text>
        </TouchableOpacity>
    )
}