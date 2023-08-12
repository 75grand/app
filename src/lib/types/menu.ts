import { z } from 'zod';

export type DietaryRestriction = z.infer<typeof DietaryRestriction>;
export const DietaryRestriction = z.object({
    label: z.string(),
    image_url: z.string().url(),
    description: z.string()
});

export type MenuItem = z.infer<typeof MenuItem>;
export const MenuItem = z.object({
    id: z.number(),
    name: z.string(),
    station: z.string(),
    dietary_restrictions: z.array(DietaryRestriction)
});

export type Menu = z.infer<typeof Menu>;
export const Menu = z.record(
    z.string(),
    z.array(MenuItem)
);