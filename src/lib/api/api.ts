import { GET, PATCH, POST } from './http';
import { CalendarEvent, EventAttendee } from '../types/calendar';
import { EditableUserFields, User } from '../types/user';
import { Menu } from '../types/menu';
import { DateTime } from 'luxon';
import { BuildingHours } from '../types/building-hours';
import { EditableListingFields, Listing, NewListingFields } from '../types/marketplace';
import { $user } from '../user/user-store';

export const fetchEvents = async () => await GET<CalendarEvent[]>('events');
export const fetchEvent = async (id: number|string) => await GET<CalendarEvent>(`events/${id}`);
export const fetchAttendees = async (id: number|string) => await GET<EventAttendee[]>(`events/${id}/attendees`);
export const postRsvp = async (id: number|string, attending: boolean) => await POST<EventAttendee[]>(`events/${id}/attendees`, { attending });

export const fetchListings = async () => await GET<Listing[]>('listings');
export const fetchListing = async (id: number|string) => await GET<Listing>(`listings/${id}`);
export const patchListing = async (id: number|string, data: EditableListingFields) => await PATCH<Listing>(`listings/${id}`, data);
export const postListing = async (data: NewListingFields) => await POST<Listing>(`listings`, data, true);

export const postFeedback = async (message: string) => await POST('feedback', { message, email: $user.get().email });

export const fetchHours = async () => await GET<BuildingHours[]>('hours');

export const fetchUser = async () => await GET<User>('user');
export const patchUser = async (data: EditableUserFields) => await PATCH<User>('user', data);

export const fetchMenu = async (date: DateTime) => await GET<Menu>(`menu/${date.toSQLDate()}`);