import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { LayoutAnimation, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import HoursItem from '../components/home/HoursItem';
import { fetchHours } from '../lib/api/api';
import { BuildingHours } from '../lib/types/building-hours';
import tw from '../lib/tailwind';
import { $localSettings } from '../lib/user/settings-store';
import { useTanStackRefresh } from '../lib/hooks/use-tanstack-refresh';
import { track } from '../lib/api/analytics';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Campus Hours',
    headerLargeTitle: true
}

export default function Hours() {
    const navigation = useNavigation();

    const { data = [], refetch, isSuccess } = useQuery({
        queryKey: ['hours'],
        queryFn: fetchHours
    });

    const { fixedRefetch, isRefetching } = useTanStackRefresh(refetch)

    const refreshControl = (
        <RefreshControl
            refreshing={isRefetching}
            onRefresh={fixedRefetch}
        />
    );

    const { favoriteHours } = useStore($localSettings);

    if(!isSuccess) return;

    const sortedData = data.sort((a, b) => {
        const aFavorite = favoriteHours.includes(a.name);
        const bFavorite = favoriteHours.includes(b.name);

        if(aFavorite && !bFavorite) return -1;
        if(!aFavorite && bFavorite) return 1;

        // const aOpen = getStatus(a.events).status === 'open';
        // const bOpen = getStatus(b.events).status === 'open';

        // if(aOpen && !bOpen) return -1;
        // if(!aOpen && Boolean) return 1;

        const aName = a.name.toLocaleLowerCase();
        const bName = b.name.toLocaleLowerCase();

        if(aName < bName) return -1;
        if(aName > bName) return 1;

        return 0;
    });

    function handleStarPress(service: BuildingHours) {
        track('Favorited hours', { name: service.name });

        const favoriteHoursSet = new Set(favoriteHours);

        if(favoriteHoursSet.has(service.name)) {
            favoriteHoursSet.delete(service.name);
        } else {
            favoriteHoursSet.add(service.name);
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        $localSettings.setKey('favoriteHours', [...favoriteHoursSet]);
    }

    return (
        <ScrollView refreshControl={refreshControl} contentInsetAdjustmentBehavior="automatic">
            <View style={tw('p-3')}>
                <Card>
                    <View style={tw('gap-3')}>
                        {sortedData.map(service => (
                            <View key={service.name} style={tw('flex-row justify-between items-center')}>
                                <HoursItem name={service.name} events={service.events}/>

                                <View style={tw('flex-row gap-3')}>
                                    <TouchableOpacity onPress={() => {
                                        const message = `There's a problem with the hours for ${service.name}`;
                                        // @ts-expect-error
                                        navigation.navigate('Feedback', { message });
                                    }}>
                                        <Ionicons name="flag" style={tw('text-xl text-gray-300')}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleStarPress(service)}>
                                        <Ionicons name="star" style={tw('text-xl text-gray-300',
                                                favoriteHours.includes(service.name) && 'text-yellow')}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </Card>
            </View>
        </ScrollView>
    );
}