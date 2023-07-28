import { DateTime } from 'luxon';
import { z } from 'zod';

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