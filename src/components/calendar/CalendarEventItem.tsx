import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { formatDuration, formatLocation, getCalendarIcon } from '../../helpers/calendar/utils';
import { CalendarEvent } from '../../helpers/models/calendar';
import tw, { color } from '../../helpers/tailwind';

export default function CalendarEventItem(event: CalendarEvent) {
    return (
        <View style={tw('flex flex-row gap-3 justify-between')}>
            <View style={tw('shrink gap-1.25')}>
                <Text style={tw('text-base leading-tight font-medium')} numberOfLines={2}>{event.title}</Text>

                <View style={tw('flex flex-row gap-2 items-center')}>
                    {getCalendarIcon(event.calendar_name, 14)}
                    <Text>{formatDuration(event)}</Text>
                </View>

                {event.location && <View style={tw('flex flex-row gap-2 items-center')}>
                    <Ionicons color={color('accent')} size={14} name="location-sharp"/>
                    <Text numberOfLines={1} style={tw('shrink')}>{formatLocation(event.location)}</Text>
                </View>}
            </View>

            {event.image_url && <Image source={event.image_url} contentFit={event.calendar_name === 'Sports' ? 'contain' : 'cover'}
                style={tw('w-16 rounded-lg aspect-square bg-black/5')}/>}
        </View>
    );
}