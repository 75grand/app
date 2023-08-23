import { DateTime } from 'luxon';
import { z } from 'zod';

/**
 * An alias of Record<string, string> to avoid nested brackets (>>)
 */
export type StringRecord = Record<string, string>;

export const zMacPass =
    z.string().length(9, 'Must be a valid MacPass number')
    .regex(/^\d*$/).optional().or(z.literal(''));

export const zMailboxCombination =
    z.string().regex(/^[0-4][0-9][0-4][0-9][0-4][0-9]$/, 'Must be valid')
    .optional().or(z.literal(''));

/**
 * Transform ISO 8601 date strings into DateTime objects
 */
export const zDateTime =
    z.string().transform((value, context) => {
        const dateTime = DateTime.fromISO(value);
        if(dateTime.isValid) return dateTime;

        context.addIssue({
            code: z.ZodIssueCode.invalid_date,
            message: dateTime.invalidExplanation!
        });
        return z.NEVER;
    });