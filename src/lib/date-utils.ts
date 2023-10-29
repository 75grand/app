import { DateTime } from 'luxon';

function extraDateFormatting(string: string): string {
    return string
        .toLowerCase()
        .replace(' pm', 'pm')
        .replace(' am', 'am');
}

export function isSameDay(date1: DateTime, date2: DateTime) {
    return (
        date1.day === date2.day &&
        date1.month === date2.month &&
        date1.year === date2.year
    );
}

function formattedHours(date: DateTime) {
    return date.toLocaleString({
        hour: 'numeric',
        minute: date.minute === 0 ? undefined : 'numeric'
    });
}

function formattedAbsoluteDate(date: DateTime) {
    return date.toLocaleString({
        month: 'short',
        day: 'numeric',
        year: date.year !== DateTime.now().year ? 'numeric' : undefined
    }) + ' at ' + formattedHours(date);
}

export function toUsefulRelative(date: DateTime): string {
    const diff = date.diffNow();
    const hours = diff.as('hours');
    const days = diff.as('days');

    let formatted = '';

    if(date < DateTime.now()) {
        formatted = formattedAbsoluteDate(date);
    } else if(hours < 1) {
        const { minutes, seconds } = date.diffNow(['hours', 'minutes']);
        formatted = `in ${Math.floor(minutes)}m ${seconds}s`;
    } else if(hours <= 8) {
        const { hours, minutes } = date.diffNow(['hours', 'minutes']);
        formatted = `in ${hours}h ${Math.floor(minutes)}m`;
    } else if(isSameDay(date, DateTime.now())) {
        formatted = 'at ' + formattedHours(date);
    } else if(days < 7) {
        formatted = date.weekdayShort + ' at ' + formattedHours(date);
    } else {
        formatted = formattedAbsoluteDate(date);
    }

    return extraDateFormatting(formatted);
}
