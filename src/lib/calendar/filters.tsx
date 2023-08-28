import { Ionicons } from '@expo/vector-icons';
import { CalendarEvent } from '../types/calendar';

export type CalendarFilter = {
    name: string,
    icon: keyof typeof Ionicons.glyphMap,
    tint: string,
    filter: (event: CalendarEvent) => boolean
}

export function filterEvents(events: CalendarEvent[], filter: CalendarFilter) {
    return events.filter(filter?.filter ?? defaultFilter);
}

/** Exclude away games by default */
export const defaultFilter: CalendarFilter['filter'] = ({ calendar_name, location }) => {
    if(calendar_name === 'Sports') {
        return location?.includes('(Home)');
    } else {
        return true;
    }
}

/** Get a random sport's icon since there is no good icon to represent sports in general */
function randomSportsIcon() {
    const icons: CalendarFilter['icon'][] = ['american-football', 'baseball', 'basketball', 'football', 'tennisball'];
    return icons.sort(() => Math.random() - 0.5)[0];
}

export const calendarFilters: CalendarFilter[] = [
    {
        name: 'Free Food',
        icon: 'fast-food',
        tint: 'orange',
        filter: ({ description }) => {
            if(description === null) return false;
            const keywords = ['snack', 'breakfast', 'lunch', 'dinner', 'taco', 'pizza', 'boba', 'complimentary'];
            description = description.toLowerCase();
            return keywords.some(word => description.includes(word));
        }
    },
    {
        name: 'Program Board',
        icon: 'sunny',
        tint: 'accent',
        filter: ({ calendar_name }) => calendar_name === 'Program Board'
    },
    {
        name: 'All Games',
        icon: randomSportsIcon(),
        tint: 'green',
        filter: ({ calendar_name }) => calendar_name === 'Sports'
    },
    {
        name: 'Anything But Sports',
        icon: randomSportsIcon(),
        tint: 'red',
        filter: ({ calendar_name }) => calendar_name !== 'Sports'
    },
    {
        name: 'Job Fairs',
        icon: 'person',
        tint: 'brown',
        filter: ({ calendar_name }) => calendar_name === 'Career'
    },
    {
        name: 'Computer Science',
        icon: 'code-slash',
        tint: 'indigo',
        filter: ({ calendar_name, description }) => {
            if(calendar_name === 'Dev Garden') return true;
            if(description === null) return false;
            const keywords = ['coding', 'javascript', 'html', 'computer science', 'hackalester'];
            description = description.toLowerCase();
            return keywords.some(word => description.includes(word));
        }
    }
];