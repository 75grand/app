import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { CalendarEvent } from '../../lib/models/calendar';
import tw, { color } from '../../lib/tailwind';

function getIcon(calendar: string, size: number): React.ReactNode {
    return {
        'Clubs': <MaterialCommunityIcons name="cards-club" color={color('pink')} size={size}/>,
        'Sports': <FontAwesome5 name="running" color={color('green')} size={size}/>,
        'Lectures': <Ionicons name="school" color={color('blue')} size={size}/>,
        'Arts': <Ionicons name="color-palette" color={color('purple')} size={size}/>,
        'Featured': <Ionicons name="star" color={color('orange')} size={size}/>,
        'Campus': <FontAwesome name="bank" color={color('mint')} size={size}/>,
        'Career': <MaterialCommunityIcons name="tie" color={color('brown')} size={size}/>,
        'Dev Garden': <Ionicons name="code-slash" color={color('indigo')} size={size}/>,
        'Program Board': <Ionicons name="sunny" color={color('accent')} size={size}/>,
    }[calendar] ?? <Ionicons name="calendar-sharp" color={color('accent')} size={size}/>;
}

export default function CalendarItem(event: CalendarEvent) {
    const startTime = DateTime.fromISO(event.start_date);
    const endTime = DateTime.fromISO(event.end_date);
    const isAllDay = startTime.diff(endTime).hours >= 1;

    const startTimeString = startTime.toLocaleString(DateTime.TIME_SIMPLE);
    const endTimeString = endTime.toLocaleString(DateTime.TIME_SIMPLE);

    return (
        <View style={tw('flex flex-row gap-3 justify-between')}>
            <View style={tw('shrink gap-1.25')}>
                <Text style={tw('text-base leading-tight font-medium')} numberOfLines={2}>{event.title}</Text>

                <View style={tw('flex flex-row gap-2 items-center')}>
                    {getIcon(event.calendar_name, 14)}
                    <Text>{isAllDay ? 'All Day' : `${startTimeString} – ${endTimeString}`}</Text>
                </View>

                {event.location && <View style={tw('flex flex-row gap-2 items-center')}>
                    <Ionicons color={color('accent')} size={14} name="location-sharp"/>
                    <Text numberOfLines={1} style={tw('shrink')}>{event.location}</Text>
                </View>}
            </View>

            {event.image_url && <Image source={event.image_url}
                style={tw('w-16 rounded-lg aspect-square bg-black/5')}/>}
        </View>
    );
}