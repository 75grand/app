import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import HoursItem from '../components/home/HoursItem';
import { fetchHours } from '../helpers/api/api';
import { BuildingHours } from '../helpers/models/building-hours';
import tw from '../helpers/tailwind';
import { $localSettings } from '../helpers/user/settings-store';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Campus Hours',
    headerLargeTitle: true
}

export default function Hours() {
    const navigation = useNavigation();

    const { data } = useQuery({
        queryKey: ['hours'],
        queryFn: fetchHours,
        placeholderData: []
    });

    const { favoriteHours } = useStore($localSettings);

    function handleStarPress(service: BuildingHours) {
        let favoriteHoursSet = new Set(favoriteHours);

        if(favoriteHoursSet.has(service.name)) {
            favoriteHoursSet.delete(service.name);
        } else {
            favoriteHoursSet.add(service.name);
        }

        $localSettings.setKey('favoriteHours', [...favoriteHoursSet]);
    }

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={tw('p-3')}>
                <Card>
                    <View style={tw('gap-3')}>
                        {data.map(service => (
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
                                        <Ionicons name="star"
                                            style={tw('text-xl text-gray-300',
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