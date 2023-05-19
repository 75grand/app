import { get } from './http';
import { CalendarEvent } from './models/calendar';

export async function fetchEvents() {
    return await get<CalendarEvent[]>('events');
}

export async function fetchEvent(id: number) {
    return await get<CalendarEvent>(`events/${id}`);
}