import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';
import EmptyState from '../../../components/EmptyState';
import Grid from '../../../components/Grid';
import CalendarFilters from '../../../components/calendar/CalendarFilters';
import CalendarItem from '../../../components/calendar/CalendarItem';
import { fetchEvents } from '../../../lib/api';
import { CalendarFilter, filters } from '../../../lib/calendar-filters';
import { CalendarEvent } from '../../../lib/models/calendar';
import tw from '../../../lib/tailwind';

function groupEvents(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
    const groupedEvents = new Map<string, CalendarEvent[]>;

    for(const event of events) {
        let date = DateTime.fromISO(event.start_date)
            .toLocaleString({ weekday: 'long', month: 'long', day: 'numeric' });

        groupedEvents[date] = groupedEvents[date] ?? [];
        groupedEvents[date].push(event);
    }

    return groupedEvents;
}

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
                        filters={filters}
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
                                        <CalendarItem {...event}/>
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