import { Pressable, StyleProp, TouchableOpacity, View } from 'react-native';
import tw from '../lib/tailwind';

interface CardProps {
    style?: StyleProp<any>;
    onPress?: () => void;
    children: React.ReactNode;
}

export default function Card({ style = {}, onPress = () => {}, children }: CardProps) {
    return (
        <Pressable onPress={onPress}>
            <View style={tw('p-4 rounded-2xl w-full border border-black/10 bg-white', style)}>
                {children}
            </View>
        </Pressable>
    );
}