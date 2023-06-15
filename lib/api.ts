import { get } from './http';
import { CalendarEvent } from './models/calendar';
import { MapLayer } from './models/map';

export const fetchEvents = async () => await get<CalendarEvent[]>('events');
export const fetchEvent = async (id: string|number) => await get<CalendarEvent>(`events/${id}`);

export const fetchMap = async () => await get<MapLayer[]>('map');