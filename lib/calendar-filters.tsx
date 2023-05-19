import { Ionicons } from '@expo/vector-icons';
import { CalendarEvent } from './models/calendar';

export type CalendarFilter = {
    name: string,
    icon: keyof typeof Ionicons.glyphMap,
    tint: string,
    filter: (event: CalendarEvent) => boolean
}

export const filters: CalendarFilter[] = [
    {
        name: 'Home Games',
        icon: 'home',
        tint: 'green',
        filter: ({ calendar_name, location }) => calendar_name === 'Sports' && location?.includes('(Home)')
    },
    {
        name: 'Free Food',
        icon: 'fast-food',
        tint: 'orange',
        filter: ({ description }) => description?.includes('snack') || description?.includes('breakfast') || description?.includes('lunch') || description?.includes('dinner') || description?.includes('food') || description?.includes('taco')
    },
    // {
    //     name: 'Sports',
    //     icon: 'american-football',
    //     tint: 'green',
    //     filter: ({ calendar_name }) => calendar_name === 'Sports'
    // },
    {
        name: 'Program Board',
        icon: 'sunny',
        tint: 'accent',
        filter: ({ calendar_name }) => calendar_name === 'Program Board'
    },
    {
        name: 'Anything But Sports',
        icon: 'calendar',
        tint: 'red',
        filter: ({ calendar_name }) => calendar_name !== 'Sports'
    },
    {
        name: 'Career',
        icon: 'person',
        tint: 'brown',
        filter: ({ calendar_name }) => calendar_name === 'Career'
    }
];