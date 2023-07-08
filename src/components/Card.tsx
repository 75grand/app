import { Pressable, StyleProp, TouchableOpacity, View } from 'react-native';
import tw from '../helpers/tailwind';

interface Props {
    style?: StyleProp<any>;
    onPress?: () => void;
    children: React.ReactNode;
}

export default function Card({ style = {}, onPress = () => {}, children }: Props) {
    return (
        <Pressable onPress={onPress}>
            <View style={tw('p-3 rounded-2xl w-full border border-black/10 bg-white', style)}>
                {children}
            </View>
        </Pressable>
    );
}