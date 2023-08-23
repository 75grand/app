import { z } from 'zod';
import { zDateTime } from './utils';

export type BuildingHoursEvent = z.infer<typeof BuildingHoursEvent>;
export const BuildingHoursEvent = z.object({
    text_before_start: z.string(),
    start_date: zDateTime,
    text_before_end: z.string(),
    end_date: zDateTime
});

export type BuildingHours = z.infer<typeof BuildingHours>;
export const BuildingHours = z.object({
    name: z.string(),
    events: z.array(BuildingHoursEvent)
});