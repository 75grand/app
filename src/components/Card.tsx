import { StyleProp, View } from 'react-native';
import tw from '../lib/tailwind';

interface Props {
    style?: StyleProp<any>,
    children: React.ReactNode
}

export default function Card({ style = {}, children }: Props) {
    return (
        <View style={tw('p-3 overflow-hidden rounded-2xl w-full border border-black/10 bg-white', style)}>
            {children}
        </View>
    );
}