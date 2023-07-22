import { OtherUser } from './user';

export type Listing = {
    id: number,
    title: string,
    description: string|null,
    image_url: string,
    price: number,
    available: boolean,
    miles_from_campus: number,
    user: OtherUser,
    created_at: string
}

/**
 * @see https://stackoverflow.com/a/42521680/
 */
type FormDataFile = {
    uri: string,
    name: string,
    type: string
}

export type NewListingFields =
    Pick<Listing, 'title'|'description'|'price'|'miles_from_campus'> & { image: FormDataFile };

export type EditableListingFields =
    Pick<Listing, 'title'|'description'|'price'|'available'|'miles_from_campus'>;