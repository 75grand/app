import { useMemo, useState } from 'react';
import { AnyZodObject, ZodDefault, ZodTypeAny, z } from 'zod';
import { InputProps } from '../../components/Input';
import { StringRecord } from '../types/utils';

interface Form<T extends AnyZodObject> {
    fields: Record<keyof z.infer<T>, Field>,
    isValid: boolean,
    formData: z.infer<T>|StringRecord,
    reset: () => void,
    clear: () => void
}

interface Field {
    value: InputProps['value'],
    setValue: InputProps['setValue'],
    error: InputProps['error'],
    key: React.Key
}

/**
 * Provides unified state managment and validation for forms.
 * Note: If you're using an input for numeric values, be sure to `.coerce` it with Zod.
 * 
 * @todo Automatic coercion of numeric values with Zod?
 * 
 * @returns formData If the form `isValid`, the form data as parsed by Zod. Otherwise, the raw form data from the inputs.
 */
export function useForm<T extends AnyZodObject>(type: T): Form<T> {
    // Infer TypeScript type from Zod object for type safety
    type FormType = z.infer<T>;

    const defaults = getDefaults(type);

    // The raw string values from the form inputs
    const [values, setValues] = useState<StringRecord>(defaults);

    // The parsed result from Zod
    const safeResult = useMemo(() => type.safeParse(values), [type, values]);


    // Generate form field prop helpers
    const fields = {} as Record<keyof FormType, Field>;

    for(const name in type.shape) {
        const errorMessage = safeResult.success === false
            ? safeResult.error.format()[name]?._errors.join('\n') ?? null
            : null;

        fields[name as keyof FormType] = {
            value: values[name] || '',
            error: errorMessage,
            key: name,
            setValue: value => {
                setValues(values => {
                    return {
                        ...values,
                        [name]: value
                    }
                })
            }
        };
    }


    return {
        fields: fields,
        isValid: safeResult.success,
        formData: safeResult.success === true ? safeResult.data : values,
        reset: () => setValues(defaults),
        clear: () => setValues({})
    }
}

/**
 * Get the default values from a Zod type
 * 
 * @see https://github.com/colinhacks/zod/discussions/1953#discussioncomment-4811588
 * @returns An object in the shape of the input object where the values are the default values
 */
function getDefaults<T extends AnyZodObject>(type: T): Partial<z.infer<T>> {
    return Object.fromEntries(
        Object.entries(type.shape).map(([key, value]) => {
            if(value instanceof ZodDefault) return [key, value._def.defaultValue()];
            return [key, undefined];
        })
    ) as Partial<z.infer<T>>;
}