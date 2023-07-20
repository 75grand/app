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
    created_at: string,
    updated_at: string
}

export type NewListingFields =
    Pick<Listing, 'title'|'description'|'price'|'miles_from_campus'>;

export type EditableListingFields =
    Pick<Listing, 'title'|'description'|'price'|'available'|'miles_from_campus'>;

export type Listings =
    Pick<Listing, 'id'|'title'|'image_url'|'price'|'available'|'miles_from_campus'>[];