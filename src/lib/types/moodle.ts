import { z } from 'zod';
import { zDateTime } from './utils';

export type MoodleTask = z.infer<typeof MoodleTask>;
export const MoodleTask = z.object({
    id: z.string(),
    title: z.string(),
    due: zDateTime,
    class: z.string()
});