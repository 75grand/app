import { Text, View } from 'react-native';
import tw, { color } from '../lib/tailwind';
import { Ionicons } from '@expo/vector-icons';

export interface CardHeaderProps {
    title: string,
    subtitle?: string,
    icon?: keyof typeof Ionicons.glyphMap,
    customIcon?: (props) => React.ReactElement,
    light?: boolean
}

export default function CardHeader({ title, subtitle, icon, customIcon, light = false }: CardHeaderProps) {
    const iconProps = {
        size: 24,
        color: color(light ? 'white' : 'accent')
    };

    if(icon) customIcon = (props) => <Ionicons {...props} name={icon}/>;

    return (
        <View style={tw('flex flex-row items-center justify-between gap-3 mb-3')}>
            <View>
                <Text style={tw('font-bold text-lg leading-none', light && 'text-white')} numberOfLines={1}>{title}</Text>
                {subtitle && <Text style={tw('text-gray-500 mt-0.5', light && 'text-white')} numberOfLines={1}>{subtitle}</Text>}
            </View>

            {customIcon && customIcon(iconProps)}
        </View>
    );
}