import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import Grid from '../components/Grid';
import HoursItem from '../components/home/HoursItem';
import { fetchHours } from '../helpers/api/api';
import tw from '../helpers/tailwind';
import Card from '../components/Card';
import { useEffect, useState } from 'react';

export const screenOptions: NativeStackNavigationOptions = {
    title: 'Campus Hours'
}

export default function Hours() {
    const { data } = useQuery({
        queryKey: ['hours'],
        queryFn: fetchHours,
        placeholderData: []
    });

    const [,setDate] = useState(new Date);

    useEffect(() => {
        const interval = 5;
        const initialDelay = (60 - new Date().getSeconds()) % interval * 1000;

        let timing = setTimeout(() => {
            setDate(new Date);
            timing = setInterval(() => {
                setDate(new Date);
            }, interval*1000);
        }, initialDelay);

        // clearInterval and clearTimeout are the same
        return () => clearInterval(timing);
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={tw('p-3')}>
                    <Card>
                        <Grid columns={1}>
                            {data.map(service => {
                                return (
                                    <HoursItem
                                        key={service.name}
                                        name={service.name}
                                        events={service.events}
                                    />
                                );
                            })}
                        </Grid>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}