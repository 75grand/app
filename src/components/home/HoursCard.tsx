import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchHours } from '../../helpers/api/api';
import { $localSettings } from '../../helpers/user/settings-store';
import Card from '../Card';
import Grid from '../Grid';
import HoursItem from './HoursItem';
import { TouchableOpacity } from 'react-native';
import EmptyState from '../EmptyState';
import tw from '../../helpers/tailwind';

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


    return (
        // @ts-expect-error
        <TouchableOpacity onPress={() => navigation.navigate('HoursTab')}>
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