import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { TouchableOpacity } from 'react-native';
import { fetchHours } from '../../lib/api/api';
import { $localSettings } from '../../lib/user/settings-store';
import Card from '../Card';
import EmptyState from '../EmptyState';
import Grid from '../Grid';
import HoursItem from './HoursItem';
import tw from '../../lib/tailwind';

export default function HoursCard() {
    const navigation = useNavigation();

    const { data } = useQuery({
        queryKey: ['hours'],
        queryFn: fetchHours,
        placeholderData: []
    });

    const { favoriteHours } = useStore($localSettings);

    const filteredData = data.filter(service => {
        return favoriteHours.includes(service.name);
    });

    if(filteredData.length === 0) return;

    return (
        // @ts-expect-error
        <TouchableOpacity style={tw('px-3 gap-3')} onPress={() => navigation.navigate('HoursTab')}>
            <Card>
                {filteredData.length ? (
                    <Grid columns={2}>
                        {filteredData.map(service => (
                            <HoursItem
                                key={service.name}
                                name={service.name}
                                events={service.events}
                            />
                        ))}
                    </Grid>
                ) : (
                    <EmptyState
                        icon="time"
                        title="Tap to set your favorite hours"
                    />
                )}
            </Card>
        </TouchableOpacity>
    );
}