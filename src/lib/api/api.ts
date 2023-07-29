import { DateTime } from 'luxon';
import { array } from 'zod';
import { BuildingHours } from '../types/building-hours';
import { CalendarEvent, EventAttendee } from '../types/calendar';
import { Listing, NewListingFields } from '../types/marketplace';
import { Menu } from '../types/menu';
import { EditableUserFields, User } from '../types/user';
import { $user } from '../user/user-store';
import { request } from './http-client';

type Id = string|number;

/**
 * Calendar
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchEvents = async () =>
    await request(array(CalendarEvent), { url: 'events' });
export const fetchEvent = async (id: Id) =>
    await request(CalendarEvent, { url: `event/${id}` });
export const fetchAttendees = async (id: Id) =>
    await request(array(EventAttendee), { url: `event/${id}/attendees` });
export const postRsvp = async (id: Id) =>
    await request(array(EventAttendee), { method: 'POST', url: `event/${id}/attendees` });

/**
 * Marketplace
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchListings = async () =>
    await request(array(Listing), { url: 'listings' });
export const fetchListing = async (id: Id) =>
    await request(array(Listing), { url: `listings/${id}` });
export const patchListing = async (id: Id, data: NewListingFields) =>
    await request(array(Listing), { method: 'PATCH', url: `listings/${id}`, data });
export const postListing = async (data: NewListingFields) =>
    await request(array(Listing), { method: 'POST', url: 'listings', data });

/**
 * Feedback
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const postFeedback = async (message: string) =>
    await request(null, { data: { message, email: $user.get().email } });

/**
 * Building Hours
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchHours = async () =>
    await request(array(BuildingHours), { url: 'hours' });

/**
 * User & Authentication
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchUser = async () =>
    await request(User, { url: 'user' });
export const patchUser = async (data: EditableUserFields) =>
    await request(User, { method: 'PATCH', url: 'user', data });

/**
 * Dining Hall Menus
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchMenu = async (date: DateTime) =>
    await request(Menu, { url: `menus/${date.toSQLDate()}` });