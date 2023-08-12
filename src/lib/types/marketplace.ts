import { z } from 'zod';
import { OtherUser } from './user';
import { stringToDateTime } from './utils';

export type Listing = z.infer<typeof Listing>;
export const Listing = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    image_url: z.string().url(),
    price: z.number().lte(1000),
    available: z.boolean(),
    miles_from_campus: z.number().lte(9),
    user: OtherUser,
    created_at: stringToDateTime
});

/**
 * @see https://stackoverflow.com/a/42521680/
 */
export type NewListingFields = z.infer<typeof NewListingFields>;
export const NewListingFields = Listing.pick({
    title: true,
    description: true,
    price: true,
    miles_from_campus: true
}).merge(z.object({
    image: z.object({
        uri: z.string(),
        name: z.string(),
        type: z.string()
    })
}));

export type EditableListingFields = z.infer<typeof EditableListingFields>;
export const EditableListingFields = Listing.pick({
    title: true,
    description: true,
    price: true,
    available: true,
    miles_from_campus: true
});