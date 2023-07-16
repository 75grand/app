import { GET, PATCH, POST } from './http';
import { CalendarEvent, EventAttendee } from '../models/calendar';
import { MapLayer } from '../models/map';
import { EditableUserFields, User } from '../models/user';
import { Menu } from '../models/menu';
import { DateTime } from 'luxon';
import { BuildingHours } from '../models/building-hours';

export const fetchEvents = async () => await GET<CalendarEvent[]>('events');
export const fetchEvent = async (id) => await GET<CalendarEvent>(`events/${id}`);
export const fetchAttendees = async (id) => await GET<EventAttendee[]>(`events/${id}/attendees`);
export const postRsvp = async (id, attending: boolean) => await POST<EventAttendee[]>(`events/${id}/attendees`, { attending });

export const fetchMap = async () => await GET<MapLayer[]>('map');

export const fetchHours = async () => await GET<BuildingHours[]>('hours');

export const fetchUser = async () => await GET<User>('user');
export const patchUser = async (data: EditableUserFields) => await PATCH<User>('user', data);

export const fetchMenu = async (date: DateTime) => await GET<Menu>(`menu/${date.toSQLDate()}`);