import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import tw from '../helpers/tailwind';

interface Props {
    title?: string,
    subtitle?: string,
    icon?: keyof typeof Ionicons.glyphMap
}

export default function EmptyState({ title = 'No Results', subtitle, icon = 'close' }: Props) {
    return (
        <View style={tw('p-6')}>
            <Ionicons style={tw('mx-auto mb-2 text-accent')} size={32} name={icon}/>
            <Text style={tw('text-lg font-semibold text-center')}>{title}</Text>
            {subtitle && <Text style={tw('text-base text-gray-500 text-center')}>{subtitle}</Text>}
        </View>
    );
}