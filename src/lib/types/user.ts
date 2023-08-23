import { z } from 'zod';
import { zDateTime } from './utils';

export type User = z.infer<typeof User>;
export const User = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().length(10, 'Must be a valid phone number').nullable(),
    avatar: z.string().url(),
    referral_code: z.string(),
    referrals_count: z.number(),
    referrals_per_prize: z.number(),
    class_year: z.string().nullable(),
    moodle_enabled: z.boolean(),
    position: z.enum(['student', 'professor', 'staff']).nullable(),
    created_at: zDateTime
});

export type EditableUserFields = z.infer<typeof EditableUserFields>;
export const EditableUserFields = User.partial().pick({
    phone: true,
    class_year: true,
    position: true
}).merge(z.object({
    expo_token: z.string().optional(),
    moodle_token: z.string().optional(),
    moodle_user_id: z.string().optional()
}));

export type OtherUser = z.infer<typeof OtherUser>;
export const OtherUser = User.pick({
    id: true,
    name: true,
    email: true,
    phone: true,
    avatar: true,
    position: true,
    class_year: true
});