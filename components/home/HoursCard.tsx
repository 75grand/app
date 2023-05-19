import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getStatus } from '../../lib/building-hours';
import { get } from '../../lib/http';
import { BuildingHours } from '../../lib/models/building-hours';
import tw from '../../lib/tailwind';
import Card from '../Card';
import CardHeader from '../CardHeader';
import Grid from '../Grid';

export default function HoursCard({ onPress = () => {} }: { onPress?: () => void }) {
    const [hours, setHours] = useState([] as BuildingHours[]);

    useEffect(() => {
        get<BuildingHours[]>('hours')
            .then(setHours)
            .catch(() => alert('Error loading hours data'));
    }, []);

    return (
        <Card onPress={onPress}>
            <CardHeader title="Building & Service Hours" icon="time"/>

            <Grid columns={2} style={tw('items-center')}>
                {hours.map(HoursItem)}
            </Grid>
        </Card>
    );
}

export function HoursItem({ name, events }: BuildingHours) {
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