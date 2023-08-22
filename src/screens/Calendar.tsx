import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native';
import EmptyState from '../components/EmptyState';
import CalendarDay from '../components/calendar/CalendarDay';
import CalendarFilters from '../components/calendar/CalendarFilters';
import { fetchEvents } from '../lib/api/api';
import { CalendarFilter, calendarFilters, filterEvents } from '../lib/calendar/filters';
import { groupEvents } from '../lib/calendar/utils';
import { useTanStackRefresh } from '../lib/hooks/use-tanstack-refresh';
import tw from '../lib/tailwind';
import { CalendarEvent } from '../lib/types/calendar';

/**
 * @see https://github.com/react-navigation/react-navigation/issues/11375#issuecomment-1588592971
 * @see https://github.com/react-navigation/react-navigation/issues/11375#issuecomment-1620505642
 */
export const screenOptions: NativeStackNavigationOptions = {
    headerShown: false
}

export default function Calendar() {
    const [filter, setFilter] = useState<CalendarFilter>(null);

    const { data = [], refetch, isFetching } = useQuery<CalendarEvent[]>({
        queryKey: ['events'],
        queryFn: fetchEvents
    });

    const filteredEvents = useMemo(() => filterEvents(data, filter), [data, filter]);
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

            <FlashList
                refreshing={isRefetching}
                onRefresh={fixedRefetch}
                data={days}
                keyExtractor={item => item.date.toString()}
                renderItem={item => <CalendarDay {...item.item} index={item.index}/>}
                estimatedItemSize={225}
                ListEmptyComponent={!isFetching && <EmptyState
                    icon="calendar"
                    title="No Events Found"
                    subtitle="Try another filter"
                />}
            />
        </>
    );
}