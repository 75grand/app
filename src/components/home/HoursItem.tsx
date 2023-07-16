import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { getStatus } from '../../helpers/building-hours';
import { BuildingHours } from '../../helpers/models/building-hours';
import tw from '../../helpers/tailwind';

export default function HoursItem({ name, events }: BuildingHours) {
    const { status, message } = getStatus(events);

    const dotColor = {
        'open': 'text-green',
        'closed': 'text-red',
        'closing-soon': 'text-orange',
        'error': 'text-gray-500'
    }[status];

    return (
        <View style={tw('flex flex-row gap-2')} key={name}>
            <MaterialCommunityIcons name="circle" style={tw('mt-[1px]', dotColor)}/>

            <View style={tw('shrink')}>
                <Text numberOfLines={1} ellipsizeMode="middle" style={tw('font-semibold text-base leading-none')}>{name}</Text>
                <Text numberOfLines={1} ellipsizeMode="head" style={tw('text-gray-500')}>{message}</Text>
            </View>
        </View>
    );
}