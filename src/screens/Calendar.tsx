import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import EmptyState from '../components/EmptyState';
import CalendarDay from '../components/calendar/CalendarDay';
import CalendarFilters from '../components/calendar/CalendarFilters';
import { fetchEvents } from '../lib/api/api';
import { CalendarFilter, calendarFilters, filterEvents } from '../lib/calendar/filters';
import { groupEvents } from '../lib/calendar/utils';
import { CalendarEvent } from '../lib/types/calendar';
import tw from '../lib/tailwind';
import { useTanStackRefresh } from '../lib/hooks';

/**
 * @see https://github.com/react-navigation/react-navigation/issues/11375#issuecomment-1588592971
 * @see https://github.com/react-navigation/react-navigation/issues/11375#issuecomment-1620505642
 */
export const screenOptions: NativeStackNavigationOptions = {
    headerShown: false
}

export default function Calendar() {
    const [filter, setFilter] = useState<CalendarFilter>(null);
    const { data: events = [], refetch, isFetching } = useQuery<CalendarEvent[]>(['events'], fetchEvents);

    const filteredEvents = useMemo(() => filterEvents(events, filter), [events, filter]);
    const days = useMemo(() => groupEvents(filteredEvents), [filteredEvents]);

    const { fixedRefetch, isRefetching } = useTanStackRefresh(refetch);

    return (
        <>
            <SafeAreaView style={tw('bg-white')}>
                <CalendarFilters
                    filters={calendarFilters}
                    activeFilter={filter}
                    setActiveFilter={setFilter}
                />
            </SafeAreaView>

            {filteredEvents.length === 0 && !isFetching &&
                <EmptyState title="No Events Found" subtitle={filter && 'Try another filter'} icon="calendar"/>}

            <FlashList
                refreshing={isRefetching}
                onRefresh={fixedRefetch}
                data={days}
                keyExtractor={item => item.date.toString()}
                renderItem={item => <CalendarDay {...item.item} index={item.index}/>}
                estimatedItemSize={225}
            />
        </>
    );
}