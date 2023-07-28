import { z } from 'zod';
import { stringToDateTime } from './utils';

export type CalendarEvent = z.infer<typeof CalendarEvent>;
export const CalendarEvent = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    location: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    start_date: stringToDateTime,
    end_date: stringToDateTime,
    calendar_name: z.string(),
    image_url: z.string().url().nullable(),
    url: z.string().url().nullable(),
    attendee_count: z.number().nullable()
});

export type EventAttendee = z.infer<typeof EventAttendee>;
export const EventAttendee = z.object({
    id: z.number(),
    avatar: z.string().url()
});