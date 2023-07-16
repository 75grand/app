import { DateTime } from 'luxon';
import { BuildingHoursEvent } from './models/building-hours';

export type BuildingHoursStatus = {
    status: 'open'|'closed'|'error'|'closing-soon',
    message: string
}

export function getStatus(events: BuildingHoursEvent[]): BuildingHoursStatus {
    // Events must be sorted in chronological order
    // They are sorted on the server, so this is just in case
    events = events.sort((e1, e2) => {
        const d1 = new Date(e1.start_date);
        const d2 = new Date(e2.start_date);
        return d1.getTime() - d2.getTime();
    });

    for(const event of events) {
        const now = DateTime.now();
        const startDate = DateTime.fromISO(event.start_date);
        const endDate = DateTime.fromISO(event.end_date);

        // If the first event hasn't started yet, it's clsoed
        if(now < startDate) {
            const time = startDate.toRelative();

            return {
                status: 'closed',
                message: `${event.text_before_start} ${time}`
            }
        }

        // The event is happening now, so it's open
        if(now < endDate) {
            const time = endDate.toRelative();
            const isClosingSoon = endDate.diff(now).as('minutes') <= 15;

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