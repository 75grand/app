import { Text, View } from 'react-native';
import tw from '../helpers/tailwind';

interface Props {
    text: string,
    description?: string,
    children: React.ReactNode
}

export default function InputLabel({ text, description, children }: Props) {
    return (
        <View style={tw('gap-2')}>
            <View style={tw('ml-1')}>
                <Text style={tw('font-semibold')}>{text}</Text>
                {description && <Text style={tw('text-gray-400')}>{description}</Text>}
            </View>

            <View>{children}</View>
        </View>
    );
}