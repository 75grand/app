import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@nanostores/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { DateTime } from 'luxon';
import { useLayoutEffect } from 'react';
import { Linking, Platform, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import AvatarStack from '../components/calendar/AvatarStack';
import { fetchAttendees, fetchEvent, patchRsvp } from '../lib/api/api';
import { formatDuration, formatLocation } from '../lib/calendar/utils';
import { areNotifsGranted } from '../lib/notifications';
import tw, { color } from '../lib/tailwind';
import { pluralize } from '../lib/text-utils';
import { CalendarEvent, EventAttendee } from '../lib/types/calendar';
import { $user } from '../lib/user/user-store';
import { openBrowser } from '../lib/utils';
import { SITE } from '../lib/constants';
import { DetailRow } from './DetailRow';

/**
 * Controls screen options dynamically
 * @see https://reactnavigation.org/docs/headers/#using-params-in-the-title
 */
export function screenOptions({ route }): NativeStackNavigationOptions {
    return {
        headerTitle: () => <></>,
        headerBackTitle: 'Calendar',
        title: route.params.event?.title ?? 'Calendar Event'
    }
}

export default function CalendarDetail() {
    const params = useRoute().params as any;
    const eventId = params.eventId ?? params.event.id;
    const user = useStore($user);

    if(!eventId) return <EmptyState title="Event not found" subtitle="Let's take a rain check?" icon="rainy"/>;

    const queryClient = useQueryClient();

    const { data: event, isLoading } = useQuery<CalendarEvent>({
        queryKey: ['events', eventId],
        queryFn: () => fetchEvent(eventId),
        initialData: params.event
    });

    const { data: attendees = [] } = useQuery<EventAttendee[]>({
        queryKey: ['events', eventId, 'attendees'],
        queryFn: () => fetchAttendees(eventId)
    });

    const attending = attendees.some(a => a.id === user.id);

    const rsvp = useMutation({
        mutationFn: () => patchRsvp(eventId, !attending),
        onSuccess: newAttendees => queryClient.setQueryData(
            ['events', eventId, 'attendees'],
            newAttendees
        )
    });

    async function toggleNotifications() {
        rsvp.mutate();

        if(!attending && !(await areNotifsGranted())) {
            // @ts-expect-error
            navigation.navigate('ApproveNotifications');
        }
    }

    function handleShare() {
        const url = `${SITE}/calendar/${event.id}`;
        Share.share({ url });
    }

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButtons>
                    <Item
                        title="Save Event"
                        IconComponent={Ionicons}
                        iconSize={25}
                        iconName={attending ? 'bookmark' : 'bookmark-outline'}
                        onPress={toggleNotifications}
                    />

                    <Item
                        title="Share Event"
                        IconComponent={Ionicons}
                        iconSize={25}
                        iconName="share-outline"
                        onPress={handleShare}
                    />
                </HeaderButtons>
            )
        });
    }, [attending, event]);

    if(!event && isLoading) return;
    if(!event) return <EmptyState title="Event not found" subtitle="Let's take a rain check?" icon="rainy"/>;

    const startDateText = event.start_date.toLocaleString(DateTime.DATE_HUGE);

    return (
        <>
            <ScrollView style={tw('h-full bg-white')}>
                {event.image_url && (
                    event.calendar_name === 'Sports' ? (
                        <SportsHeader {...event}/>
                    ) : (
                        <Image source={event.image_url}
                            style={tw('w-full border-b border-b-black/10', { aspectRatio: 4/3 })}/>
                    )
                )}

                <View style={tw('flex p-3 gap-3')}>
                    <Text selectable={true} style={tw('text-2xl font-bold')}>
                        {event.title}
                    </Text>

                    <DetailRow label="When">
                        <Text style={tw('text-base font-medium')}>{formatDuration(event)}</Text>
                        <Text style={tw('text-base')}>{startDateText}</Text>
                    </DetailRow>

                    {event.location && <EventLocation {...event}/>}

                    {attendees.length > 0 && <DetailRow label="Who">
                        <View style={tw('flex flex-row items-center gap-3')}>
                            <AvatarStack avatars={attendees.map(e => e.avatar)} count={event.attendee_count}/>
                            <Text style={tw('text-gray-500 mt-0.5')}>Saved by {attendees.length} {pluralize(attendees.length, 'person', 'people')}</Text>
                        </View>
                    </DetailRow>}

                    {event.description && <DetailRow label="What">
                        <Text selectable={true} style={tw('text-base')}>“{event.description}”</Text>
                    </DetailRow>}

                    {event.url && <EventUrl {...event}/>}
                </View>
            </ScrollView>

            <View style={tw('p-3 bg-white pt-0')}>
                <Button
                    text={attending ? 'Don’t Remind Me Anymore' : 'Remind Me About Event'}
                    size="mega"
                    color={attending ? 'gray' : 'accent'}
                    onPress={toggleNotifications}
                    loading={rsvp.isLoading}
                />
            </View>
        </>
    );
}

function EventUrl({ url }: CalendarEvent) {
    const formattedUrl = new URL(url).hostname.replace(/^www\./, '');

    return (
        <DetailRow label="Web">
            <TouchableOpacity onPress={() => openBrowser(url)}>
                <Text style={tw('text-base font-medium text-accent')} numberOfLines={1}>
                    {formattedUrl}
                </Text>
            </TouchableOpacity>
        </DetailRow>
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
        <DetailRow label="Where">
            <TouchableOpacity onPress={handlePress} disabled={!latitude || !longitude}>
                <Text style={tw('text-base', latitude && longitude && 'text-accent font-medium')}>
                    {formatLocation(location)}
                </Text>

                {Platform.OS === 'ios' && latitude && longitude && (
                    <MapView
                        style={tw('w-full h-48 rounded-md mt-2 border border-black/10')}
                        mapType="satellite"
                        showsPointsOfInterest={false}
                        cacheEnabled={true}
                        pitchEnabled={false}
                        tintColor={color('accent')}
                        initialRegion={{
                            latitude, longitude,
                            latitudeDelta: 0.001, longitudeDelta: 0.001
                        }}
                    >
                        <Marker
                            coordinate={{ latitude, longitude }}
                            pinColor={color('accent')}
                        />
                    </MapView>
                )}
            </TouchableOpacity>
        </DetailRow>
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