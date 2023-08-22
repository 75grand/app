import { DateTime } from 'luxon';
import { z } from 'zod';

/**
 * An alias of Record<string, string> to avoid nested brackets (>>)
 */
export type StringRecord = Record<string, string>;

/**
 * Transform ISO 8601 date strings into DateTime objects
 */
export const stringToDateTime =
    z.string().transform((value, context) => {
        const dateTime = DateTime.fromISO(value);
        if(dateTime.isValid) return dateTime;

        context.addIssue({
            code: z.ZodIssueCode.invalid_date,
            message: dateTime.invalidExplanation!
        });
        return z.NEVER;
    });