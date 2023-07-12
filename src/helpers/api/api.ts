import { GET, PATCH, POST } from './http';
import { CalendarEvent, EventAttendee } from '../models/calendar';
import { MapLayer } from '../models/map';
import { EditableUserFields, User } from '../models/user';
import { Menu } from '../models/menu';
import { DateTime } from 'luxon';

export const fetchEvents = async () => await GET<CalendarEvent[]>('events');
export const fetchEvent = async (id) => await GET<CalendarEvent>(`events/${id}`);
export const fetchAttendees = async (id) => await GET<EventAttendee[]>(`events/${id}/attendees`);
export const postRsvp = async (id, attending: boolean) => await POST<EventAttendee[]>(`events/${id}/attendees`, { attending });
export const patchUser = async (data: EditableUserFields) => await PATCH<User>('user', data);

export const fetchMap = async () => await GET<MapLayer[]>('map');

export const fetchUser = async () => await GET<User>('user');

export const fetchMenu = async (date: DateTime) => await GET<Menu>(`menu/${date.toSQLDate()}`);