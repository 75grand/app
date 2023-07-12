import { DateTime } from 'luxon';
import { BuildingHoursEvent } from './models/building-hours';

export type BuildingHoursStatus = {
    status: 'open'|'closed'|'error'|'closing-soon',
    message: string
}

export function getStatus(events: BuildingHoursEvent[]): BuildingHoursStatus {
    for(let i = 0; i < events.length; i++) {
        const event = events[i];

        // const now = DateTime.now();
        const now = DateTime.now().plus({ week: 1 });
        const startDate = DateTime.fromISO(event.start_date);
        const endDate = DateTime.fromISO(event.end_date);

        if(now > startDate && now < endDate) {
            const time = endDate.toRelative();
            const isClosingSoon = endDate.diff(now).as('minutes') <= 15;

            return {
                status: isClosingSoon ? 'closing-soon' : 'open',
                message: `${event.text_before_end} ${time}`
            }
        } else if(events.length > i + 1) {
            const nextEvent = events[i + 1];
            const nextStartDate = DateTime.fromISO(nextEvent.start_date);

            if(now > endDate && now < nextStartDate) {
                const time = nextStartDate.toRelative();
    
                return {
                    status: 'closed',
                    message: `${nextEvent.text_before_start} ${time}`
                }
            }
        }
    }

    return {
        status: 'error',
        message: 'error'
    }
}