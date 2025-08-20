import { ZodType, ZodError } from 'zod';
import { Response } from '../modules/BaseController';


export function validate<T>(schema: ZodType<T>, data: any): Response<T> {
    try {
        const parsed = schema.parse(data);

        return {
            success: true,
            message: 'Validation successful!',
            statusCode: 200,
            data: parsed
        };

    } catch (error: any) {
        const err = error as ZodError;
        return {
            success: false,
            message: 'Validation error!',
            statusCode: 400,
            error: { errors: err.issues }
        };
    }
}