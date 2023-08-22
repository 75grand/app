import { DateTime } from 'luxon';
import { BuildingHours } from '../types/building-hours';
import { CalendarEvent, EventAttendee } from '../types/calendar';
import { EditableListingFields, Listing, NewListingFields } from '../types/marketplace';
import { Menu } from '../types/menu';
import { EditableUserFields, User } from '../types/user';
import { request } from './http-client';
import { z } from 'zod';
import { objectToFormData } from '../utils';
import { $user } from '../user/user-store';
import { MoodleTask } from '../types/moodle';

type Id = string|number;

/**
 * Calendar
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchEvents = async () =>
    await request(CalendarEvent.array(), { url: 'events' });
export const fetchEvent = async (id: Id) =>
    await request(CalendarEvent, { url: `events/${id}` });
export const fetchAttendees = async (id: Id) =>
    await request(EventAttendee.array(), { url: `events/${id}/attendees` });
export const patchRsvp = async (id: Id, attending: boolean) =>
    await request(EventAttendee.array(), { method: 'PATCH', url: `events/${id}/attendees`, data: { attending } });

/**
 * Marketplace
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchListings = async () =>
    await request(Listing.array(), { url: 'listings' });
export const fetchListing = async (id: Id) =>
    await request(Listing, { url: `listings/${id}` });
export const patchListing = async (id: Id, data: EditableListingFields) =>
    await request(Listing, { method: 'PATCH', url: `listings/${id}`, data });
export const postListing = async (data: NewListingFields) =>
    await request(Listing, { method: 'POST', url: 'listings', data: objectToFormData(data) });

/**
 * Feedback
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const postFeedback = async (message: string, email?: string) =>
    await request(z.any(), { url: 'feedback', method: 'POST', data: { email, message } });

/**
 * Building Hours
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchHours = async () =>
    await request(BuildingHours.array(), { url: 'hours' });

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

/**
 * Moodle Assignments
 * @see https://www.notion.so/4d7b436cdfc6476693b7468d9d3278af
 */

export const fetchMoodleTasks = async () =>
    await request(MoodleTask.array(), { url: 'moodle' });