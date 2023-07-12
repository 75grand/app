import { Text, View } from 'react-native';
import tw from '../helpers/tailwind';

interface Props {
    text: string,
    children: React.ReactNode
}

export default function InputLabel({ text, children }: Props) {
    return (
        <View style={tw('gap-2')}>
            <Text style={tw('font-semibold ml-1')}>{text}</Text>
            <View>{children}</View>
        </View>
    );
}