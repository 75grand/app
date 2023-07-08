import { useQuery } from '@tanstack/react-query';
import { Linking, ScrollView, Text, View } from 'react-native';
import { fetchEvent } from '../../../src/helpers/api/api';
import { Stack, useSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import tw, { color } from '../../../src/helpers/tailwind';
import Card from '../../../src/components/Card';
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import Button from '../../../src/components/Button';

export default function() {
    const { event_id } = useSearchParams();

    const { data: event, isLoading } = useQuery({
        queryKey: ['event', event_id],
        queryFn: () => fetchEvent(event_id as string)
    });

    if(!event) return;

    const startDate = DateTime.fromISO(event.start_date);
    const endDate = DateTime.fromISO(event.end_date);

    return (
        <>
            <Stack.Screen options={{
                title: event.title,
                // headerTransparent: true,
                // statusBarTranslucent: true,
                // headerTitle: () => <></>,
                // headerBackground: () => <></>
            }}/>

            <ScrollView>
                {event.image_url && (
                    event.calendar_name === 'Sports' ? (
                        <View style={tw('flex flex-row items-center justify-center gap-3 p-3 pb-0')}>
                            <View style={tw('bg-gray-200 p-3 rounded-lg')}>
                                <Image contentFit="contain" style={tw('w-18 h-18')} source={require('../../../assets/macalester-shield.png')}/>
                            </View>

                            <Text style={tw('font-semibold text-base')}>vs</Text>

                            <View style={tw('bg-gray-200 p-3 rounded-lg')}>
                                <Image contentFit="contain" style={tw('w-18 h-18')} source={event.image_url}/>
                            </View>
                        </View>
                    ) : (
                        <Image style={tw('w-full h-1/3')} source={event.image_url}/>
                    )
                )}


                <View style={tw('p-3')}>
                    <Card>
                        <View style={tw('flex flex-row items-center gap-3')}>
                            <View style={tw('flex items-center gap-0.5 p-2')}>
                                <Text style={tw('uppercase text-xs text-accent leading-none')}>{startDate.toFormat('MMM')}</Text>
                                <Text style={tw('text-2xl leading-none')}>{startDate.day}</Text>
                            </View>

                            <Text numberOfLines={2} style={tw('text-2xl leading-tight font-medium shrink')}>{event.title}</Text>
                        </View>

                        <EventDetail icon="location-sharp" text={event.location}/>
                        <EventDetail icon="calendar" text={startDate.toLocaleString(DateTime.DATETIME_MED)}/>
                        <EventDetail icon="calendar" text={endDate.toLocaleString(DateTime.DATETIME_MED)}/>

                        {/* <Text>{JSON.stringify(event, null, 4)}</Text> */}
                        <Text selectable={true} style={tw('text-base leading-tight')}>{event.description}</Text>

                        {event.url && <Button text="More Information" onPress={() => Linking.openURL(event.url)}/>}
                    </Card>
                </View>
            </ScrollView>
        </>
    );
}

function EventDetail({ icon, text }) {
    return (
        <View style={tw('flex flex-row items-center gap-2')}>
            <Ionicons name={icon} color={color('accent')} size={16}/>
            <Text style={tw('text-base shrink')} numberOfLines={1}>{text}</Text>
        </View>
    );
}