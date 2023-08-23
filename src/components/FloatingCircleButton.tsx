import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import tw from '../lib/tailwind';
import TouchableScale from './TouchableScale';

interface Props {
    icon: keyof typeof Ionicons.glyphMap,
    onPress: () => void
}

export default function FloatingCircleButton({ icon, onPress }: Props) {
    return (
        <TouchableScale onPress={onPress} containerStyle={tw('absolute z-1 bottom-3 right-3')}>
            <View style={tw(
                'bg-accent rounded-full p-4',
                'shadow-lg', { shadowOpacity: 0.25 }
            )}>
                <Ionicons
                    name={icon}
                    style={tw(
                        'text-3xl text-white leading-none',
                        { transform: [{ translateX: 2 }, { translateY: 1 }] }
                    )}
                />
            </View>
        </TouchableScale>
    );
}