import { get } from './http';
import { CalendarEvent } from './models/calendar';

export const fetchEvents = async () => await get<CalendarEvent[]>('events');
export const fetchEvent = async (id: number) => await get<CalendarEvent>(`events/${id}`);