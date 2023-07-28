import { DateTime } from 'luxon';
import { BuildingHoursEvent } from './types/building-hours';

export type BuildingHoursStatus = {
    status: 'open'|'closed'|'error'|'closing-soon',
    message: string
}

export function getStatus(events: BuildingHoursEvent[]): BuildingHoursStatus {
    // Events must be sorted in chronological order
    // They are sorted on the server, so this is just in case
    events = events.sort((e1, e2) => {
        return e1.start_date.toMillis() - e2.start_date.toMillis();
    });

    for(const event of events) {
        const now = DateTime.now();

        // If the first event hasn't started yet, it's closed
        if(now < event.start_date) {
            const time = event.start_date.toRelative();

            return {
                status: 'closed',
                message: `${event.text_before_start} ${time}`
            }
        }

        // The event is happening now, so it's open
        if(now < event.end_date) {
            const time = event.end_date.toRelative();
            const isClosingSoon = event.end_date.diff(now).as('minutes') <= 15;

            return {
                status: isClosingSoon ? 'closing-soon' : 'open',
                message: `${event.text_before_end} ${time}`
            }
        }
    }

    return {
        status: 'error',
        message: 'Error'
    }
}