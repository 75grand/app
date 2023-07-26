import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';

interface Props {
    icon: keyof typeof Ionicons.glyphMap,
    onPress: () => void
}

export default function FloatingCircleButton({ icon, onPress }: Props) {
    return (
        <TouchableOpacity style={tw(
            'bg-accent rounded-full p-3',
            'absolute z-1 bottom-3 right-3',
            'shadow-lg', { shadowOpacity: 0.25 }
        )} onPress={onPress}>
            <Ionicons
                name={icon}
                style={tw(
                    'text-3xl text-white leading-none',
                    { transform: [{ translateX: 2 }, { translateY: 1 }] }
                )}
            />
        </TouchableOpacity>
    );
}