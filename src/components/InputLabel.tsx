import { Text, View } from 'react-native';
import tw from '../lib/tailwind';

interface Props {
    text: string,
    description?: string,
    children: React.ReactNode
}

export default function InputLabel({ text, description, children }: Props) {
    return (
        <View style={tw('gap-2')}>
            <View style={tw('flex-row gap-2 px-1')}>
                <Text numberOfLines={1} style={tw('font-semibold text-sm leading-none')}>{text}</Text>
                {description && <Text style={tw('text-gray-400 font-normal text-sm leading-none')}>{description}</Text>}
            </View>

            <View>{children}</View>
        </View>
    );
}