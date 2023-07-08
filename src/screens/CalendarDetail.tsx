import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { DateTime } from 'luxon';
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import HeaderButton from '../components/HeaderButton';
import { fetchAttendees, fetchEvent, postRsvp } from '../helpers/api/api';
import { formatDuration, formatLocation, getCalendarIcon, shareEvent } from '../helpers/calendar/utils';
import { CalendarEvent, EventAttendee } from '../helpers/models/calendar';
import tw, { color } from '../helpers/tailwind';
import * as WebBrowser from 'expo-web-browser';
import AvatarStack from '../components/calendar/AvatarStack';
import { pluralize } from '../helpers/text-utils';

/**
 * Controls screen options dynamically
 * @see https://reactnavigation.org/docs/headers/#using-params-in-the-title
 */
export function screenOptions({ route }): NativeStackNavigationOptions {
    return {
        headerTitle: () => <></>,
        headerBackTitle: 'Calendar',
        title: route.params.event.title ?? 'Calendar Event',
        headerRight: () => {
            if(!route.params.event) return;

            return (
                <View style={tw('flex flex-row gap-4')}>
                    <HeaderButton icon="add-circle-outline" onPress={() => true}/>
                    <HeaderButton icon="share-outline" onPress={() => shareEvent(route.params.event)}/>
                </View>
            );
        }
    }
}

export default function CalendarDetail() {
    const params = useRoute().params as any;
    const eventId = params.eventId ?? params.event.id;

    if(!eventId) return <EmptyState title="Event not found" subtitle="Let's take a rain check?" icon="rainy"/>;

    const queryClient = useQueryClient();

    const { data: event } = useQuery<CalendarEvent>({
        queryKey: ['events', eventId],
        queryFn: () => fetchEvent(eventId),
        initialData: params.event
    });

    const { data: attendees } = useQuery<EventAttendee[]>({
        queryKey: ['events', eventId, 'attendees'],
        queryFn: () => fetchAttendees(eventId),
        placeholderData: []
    });

    const attending = attendees.some(a => a.id === 1);

    const rsvp = useMutation({
        mutationFn: () => postRsvp(eventId, !attending),
        onSuccess: newAttendees => queryClient.setQueryData(
            ['events', eventId, 'attendees'],
            newAttendees
        )
    });

    const startDate = DateTime.fromISO(event.start_date);
    const startDateText = startDate.toLocaleString(DateTime.DATE_HUGE);

    return (
        <>
            <ScrollView style={tw('h-full bg-white')}>
                {event.image_url && (
                    event.calendar_name === 'Sports' ? (
                        <SportsHeader {...event}/>
                    ) : (
                        <Image source={event.image_url}
                            style={tw('w-full h-72 border-b border-b-black/10')}/>
                    )
                )}

                <View style={tw('flex p-3 gap-3')}>
                    <Text selectable={true} style={tw('text-2xl font-bold')}>
                        {event.title}
                    </Text>

                    <CalendarDetailRow label="When">
                        <Text style={tw('text-base font-medium')}>{formatDuration(event)}</Text>
                        <Text style={tw('text-base')}>{startDateText}</Text>
                    </CalendarDetailRow>

                    {event.location && <EventLocation {...event}/>}

                    {attendees.length > 0 && <CalendarDetailRow label="Who">
                        <View style={tw('flex flex-row items-center gap-3')}>
                            <AvatarStack avatars={attendees.map(e => e.avatar)} placeholderCount={event.attendee_count}/>
                            <Text style={tw('text-gray-500 mt-0.5')}>{attendees.length} {pluralize(attendees.length, 'user has', 'users have')} RSVP’d</Text>
                        </View>
                    </CalendarDetailRow>}

                    {event.description && <CalendarDetailRow label="What">
                        <Text selectable={true} style={tw('text-base')}>“{event.description}”</Text>
                    </CalendarDetailRow>}

                    {event.url && <EventUrl {...event}/>}
                </View>
            </ScrollView>

            <View style={tw('p-3 bg-white pt-0')}>
                <Button
                    text={attending ? 'I’m no longer going' : 'I’m going!'}
                    size="mega"
                    color={attending ? 'gray' : 'accent'}
                    onPress={rsvp.mutate}
                    loading={rsvp.isLoading}
                />
            </View>
        </>
    );
}

function EventUrl({ url }: CalendarEvent) {
    async function handlePress() {
        await WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
            controlsColor: color('accent')
        });
    }

    const formattedUrl = new URL(url).hostname.replace(/^www\./, '');

    return (
        <CalendarDetailRow label="Web">
            <TouchableOpacity onPress={handlePress}>
                <Text style={tw('text-base font-medium text-accent')} numberOfLines={1}>
                    {formattedUrl}
                </Text>
            </TouchableOpacity>
        </CalendarDetailRow>
    );
}

function EventLocation({ location, latitude, longitude }: CalendarEvent) {
    function handlePress() {
        const url = Platform.select({
            ios: `maps:0,0?q=${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}`
        });

        Linking.openURL(url);
    }

    return (
        <CalendarDetailRow label="Where">
            <TouchableOpacity onPress={handlePress} disabled={!latitude || !longitude}>
                <Text style={tw('text-base', latitude && longitude && 'text-accent font-medium')}>
                    {formatLocation(location)}
                </Text>
            </TouchableOpacity>
        </CalendarDetailRow>
    );
}

function CalendarDetailRow({ label, children }) {
    return (
        <View style={tw('flex flex-row gap-4 items-center')}>
            <Text style={tw('text-base text-gray-500 w-16 text-right')}>{label}</Text>

            <View style={tw('shrink')}>
                {children}
            </View>
        </View>
    );
}

function SportsHeader({ image_url }: CalendarEvent) {
    return (
        <View style={tw('flex flex-row items-center justify-center gap-3 p-3 pb-0')}>
            <View style={tw('bg-gray-100 p-3 rounded-lg')}>
                <Image contentFit="contain" style={tw('w-24 h-24')} source={require('../../assets/macalester-shield.png')}/>
            </View>

            <Text style={tw('font-semibold text-base')}>vs</Text>

            <View style={tw('bg-gray-100 p-3 rounded-lg')}>
                <Image contentFit="contain" style={tw('w-24 h-24')} source={image_url}/>
            </View>
        </View>
    );
}