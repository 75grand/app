import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { color as getColor } from '../helpers/tailwind';

interface Props {
    icon: keyof typeof Ionicons.glyphMap,
    onPress: () => void,
    color?: string
}

export default function HeaderButton({ icon, onPress, color = getColor('accent') }: Props) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Ionicons name={icon} size={26} color={color}/>
        </TouchableOpacity>
    );
}