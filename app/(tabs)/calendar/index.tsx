import { Stack } from 'expo-router';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Card from '../../../components/Card';
import CardHeader from '../../../components/CardHeader';
import Grid from '../../../components/Grid';
import CalendarFilters from '../../../components/calendar/CalendarFilters';
import CalendarItem from '../../../components/calendar/CalendarItem';
import { CalendarFilter, filters } from '../../../lib/calendar-filters';
import { CalendarEvent } from '../../../lib/models/calendar';
import tw, { color } from '../../../lib/tailwind';
import EmptyState from '../../../components/EmptyState';
import { fetchEvents } from '../../../lib/api';

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
    const [events, setEvents] = useState([] as CalendarEvent[]);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null as CalendarFilter);

    function fetchData() {
        setRefreshing(true);

        fetchEvents()
            .then(setEvents)
            .catch(() => {})
            .finally(() => setRefreshing(false));
    }

    useEffect(fetchData, []);

    const groupedEvents = useMemo(() => {
        if(activeFilter) {
            return groupEvents(events.filter(activeFilter.filter));
        } else {
            return groupEvents(events);
        }
    }, [events, activeFilter]);

    const refreshControl = (
        <RefreshControl
            onRefresh={fetchData}
            refreshing={refreshing}
            colors={[color('accent')]}
        />
    );

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

            <ScrollView style={tw('h-full bg-gray-100')} refreshControl={refreshControl}>
                {Object.entries(groupedEvents).length !== 0 &&
                    <CalendarEvents events={groupedEvents}/>}

                {(Object.entries(groupedEvents).length === 0 && !refreshing) &&
                    <EmptyState title="No Events Found" subtitle="Try another filter" icon="calendar"/>}
            </ScrollView>
        </>
    );
}

function CalendarEvents({ events }: { events: Map<string, CalendarEvent[]> }) {
    return (
        <Grid columns={1} style={tw('p-3 h-full')}>
            {Object.entries(events).map(([date, events]) => {
                return (
                    <Card key={date}>
                        <CardHeader title={date}/>

                        <View style={tw('gap-3')}>
                            {events.map(event => {
                                return (
                                    <TouchableOpacity key={event.id}>
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