import { pluralize } from './text-utils';

/**
 * Format the distance an item is from campus
 */
export function formatDistance(distance: number): string {
    if(distance === 0) return 'On campus';
    if(distance < 9) return `${distance} ${pluralize(distance, 'mile')} from campus`;
    return '9+ miles from campus';
}