import { DateTime } from 'luxon';
import { CalendarEvent } from '../models/calendar';
import { Share } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { color } from '../tailwind';

export type GroupedEvents = {
    date: DateTime,
    events: CalendarEvent[]
}[];

/**
 * Group events by day, maintaining their order
 * @returns The events grouped by day
 */
export function groupEvents(events: CalendarEvent[]): GroupedEvents {
    const temporaryGroup: Record<string, CalendarEvent[]> = {};

    for(const event of events) {
        let isoDate = DateTime.fromISO(event.start_date).toISODate();
        temporaryGroup[isoDate] = temporaryGroup[isoDate] ?? [];
        temporaryGroup[isoDate].push(event);
    }

    return Object.entries(temporaryGroup).map(day => {
        return {
            date: DateTime.fromISO(day[0]),
            events: day[1]
        }
    });
}

/**
 * Share an even with the iOS share sheet
 * @see https://reactnative.dev/docs/share
 */
export async function shareEvent(event: CalendarEvent) {
    const message = [
        event.title,
        DateTime.fromISO(event.start_date).toLocaleString(DateTime.DATETIME_MED),
        event.location,
        // 'More details at 75grand.net'
    ].join('\n');

    await Share.share({
        url: event.url,
        message: message
    });
}

/** Format the start and end times of an event */
export function formatDuration(event: CalendarEvent) {
    const startTime = DateTime.fromISO(event.start_date);
    const endTime = DateTime.fromISO(event.end_date);

    const diff = Math.abs(startTime.diff(endTime).as('hours'));
    if(diff === 0) return 'All Day';
    
    const startTimeString = startTime.toLocaleString(DateTime.TIME_SIMPLE);
    const endTimeString = endTime.toLocaleString(DateTime.TIME_SIMPLE);

    return `${startTimeString} – ${endTimeString}`;
}

export function formatLocation(location: string) {
    return location.replace('St. Paul, MN (Home), ', '');
}

export function getCalendarIcon(calendar: string, size: number): React.ReactNode {
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