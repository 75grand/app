import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { getStatus } from '../../helpers/building-hours';
import { useRerender } from '../../helpers/hooks';
import { BuildingHours } from '../../helpers/models/building-hours';
import tw from '../../helpers/tailwind';

export default function HoursItem({ name, events }: BuildingHours) {
    useRerender(1_000);
    const { status, message } = getStatus(events);

    const dotColor = {
        'open': 'text-green',
        'closed': 'text-red',
        'closing-soon': 'text-orange',
        'error': 'text-gray-500'
    }[status];

    return (
        <View style={tw('flex flex-row gap-2 pt-0.25')} key={name}>
            <MaterialCommunityIcons name="circle" style={tw('mt-[1px]', dotColor)}/>

            <View style={tw('shrink gap-1')}>
                <Text numberOfLines={1} ellipsizeMode="middle" style={tw('font-semibold text-base leading-none')}>{name}</Text>
                <Text numberOfLines={1} ellipsizeMode="head" style={tw('text-gray-500 text-sm leading-none tabular-nums')}>{message}</Text>
            </View>
        </View>
    );
}