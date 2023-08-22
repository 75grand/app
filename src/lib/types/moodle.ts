import { z } from 'zod';
import { stringToDateTime } from './utils';

export type MoodleTask = z.infer<typeof MoodleTask>;
export const MoodleTask = z.object({
    id: z.string(),
    title: z.string(),
    due: stringToDateTime,
    class: z.string()
});