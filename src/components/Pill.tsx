import { StyleProp, Text, View } from 'react-native';
import tw, { color } from '../helpers/tailwind';

type IconProps = { style: StyleProp<any>, size: 18 };

interface Props {
    text: string,
    icon?: (props: IconProps) => React.ReactNode,
    tint?: string,
    active?: boolean
}

export default function Pill({ text, icon = null, active = true, tint }: Props) {
    tint = tint ?? color('accent');

    return (
        <View style={tw(
            'flex flex-row items-center gap-2 border px-3 py-2 rounded-full',
            active ? { backgroundColor: tint, borderColor: tint } : 'bg-white border-black/10'
        )}>
            {icon({ style: tw(active ? 'text-white' : { color: tint }), size: 18 })}
            <Text style={tw('font-semibold', active ? 'text-white' : 'text-black')}>{text}</Text>
        </View>
    );
}