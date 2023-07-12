import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Card from '../../../src/components/Card';
import CardHeader from '../../../src/components/CardHeader';
import EmptyState from '../../../src/components/EmptyState';
import Grid from '../../../src/components/Grid';
import CalendarFilters from '../../../src/components/calendar/CalendarFilters';
import CalendarEventItem from '../../../src/components/calendar/CalendarEventItem';
import { fetchEvents } from '../../../src/helpers/api/api';
import { CalendarFilter, calendarFilters } from '../../../src/helpers/calendar/filters';
import { CalendarEvent } from '../../../src/helpers/models/calendar';
import tw from '../../../src/helpers/tailwind';
import { groupEvents } from '../../../src/helpers/calendar/utils';

export default function() {
    const [activeFilter, setActiveFilter] = useState(null as CalendarFilter);

    // TODO: Is it possible to cache each CalendarEvent under its ID to make visits to the detail page faster?
    const { data: events = [], isLoading } = useQuery<CalendarEvent[]>(['events'], fetchEvents);

    const groupedEvents = useMemo(() => {
        if(activeFilter) {
            return groupEvents(events.filter(activeFilter.filter));
        } else {
            return groupEvents(events);
        }
    }, [events, activeFilter]);

    return (
        <>
            <Stack.Screen options={{ title: 'Events', header: () => <></> }}/>

            <SafeAreaView style={tw('bg-white')}>
                <View style={tw('py-3 bg-white border-b border-black/10')}>
                    <CalendarFilters
                        filters={calendarFilters}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />
                </View>
            </SafeAreaView>

            <ScrollView style={tw('h-full bg-gray-100')}>
                {isLoading && <ActivityIndicator style={tw('p-3')}/>}

                {Object.entries(groupedEvents).length !== 0 &&
                    <CalendarEvents events={groupedEvents}/>}

                {(Object.entries(groupedEvents).length === 0 && !isLoading) &&
                    <EmptyState title="No Events Found" subtitle="Try another filter" icon="calendar"/>}
            </ScrollView>
        </>
    );
}

function CalendarEvents({ events }: { events: Map<string, CalendarEvent[]> }) {
    const router = useRouter();

    return (
        <Grid columns={1} style={tw('p-3 h-full')}>
            {Object.entries(events).map(([date, events]) => {
                return (
                    <Card key={date}>
                        <CardHeader title={date}/>

                        <View style={tw('gap-3')}>
                            {events.map(event => {
                                function openEventDetails() {
                                    router.push(`/calendar/${event.id}`);
                                }

                                return (
                                    <TouchableOpacity onPress={openEventDetails} key={event.id}>
                                        <CalendarEventItem {...event}/>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Card>
                );
            })}
        </Grid>
    );
}