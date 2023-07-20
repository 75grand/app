import { GET, PATCH, POST } from './http';
import { CalendarEvent, EventAttendee } from '../models/calendar';
import { MapLayer } from '../models/map';
import { EditableUserFields, User } from '../models/user';
import { Menu } from '../models/menu';
import { DateTime } from 'luxon';
import { BuildingHours } from '../models/building-hours';
import { EditableListingFields, Listing, Listings, NewListingFields } from '../models/marketplace';
import { $user } from '../user/user-store';

export const fetchEvents = async () => await GET<CalendarEvent[]>('events');
export const fetchEvent = async (id) => await GET<CalendarEvent>(`events/${id}`);
export const fetchAttendees = async (id) => await GET<EventAttendee[]>(`events/${id}/attendees`);
export const postRsvp = async (id, attending: boolean) => await POST<EventAttendee[]>(`events/${id}/attendees`, { attending });

export const fetchListings = async () => await GET<Listings>('listings');
export const fetchListing = async (id) => await GET<Listing>(`listings/${id}`);
export const patchListing = async (id, data: EditableListingFields) => await PATCH<Listing>(`listings/${id}`, data);
export const postListing = async (data: NewListingFields) => await POST<Listing>(`listings`, data);

export const postFeedback = async (message: string) => await POST('feedback', { message, email: $user.get().email });

export const fetchMap = async () => await GET<MapLayer[]>('map');

export const fetchHours = async () => await GET<BuildingHours[]>('hours');

export const fetchUser = async () => await GET<User>('user');
export const patchUser = async (data: EditableUserFields) => await PATCH<User>('user', data);

export const fetchMenu = async (date: DateTime) => await GET<Menu>(`menu/${date.toSQLDate()}`);