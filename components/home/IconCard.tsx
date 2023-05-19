import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleProp, Text } from 'react-native';
import Card from '../Card';
import tw from '../../lib/tailwind';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IconCardProps {
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    style?: StyleProp<any>;
    onPress?: () => void;
}

export default function IconCard({ title, icon, style = {}, onPress = () => {} }: IconCardProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={tw('flex justify-between border-0', { aspectRatio: '3/2' }, style)}>
                <MaterialCommunityIcons name={icon} color="white" size={32}/>
                <Text style={tw('-mb-1.5 text-white text-lg font-semibold')} numberOfLines={1}>{title}</Text>
            </Card>
        </TouchableOpacity>
    );
}