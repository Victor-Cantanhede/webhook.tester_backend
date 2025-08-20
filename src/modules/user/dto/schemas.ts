import { z } from 'zod';


/**
 * ===========================================================================================
 * CREATE USER PAYLOAD
 * ===========================================================================================
 */
export const createUserPayload = z.object({
    name: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .toUpperCase()
        .transform((val) => val.replace(/\s+/g, ' ')),

    email: z
        .email()
        .trim()
        .min(3)
        .max(100)
        .toLowerCase(),

    password: z
        .string()
        .min(8, { message: 'The password must be at least 8 characters long!' })
        .max(20, { message: 'The password must be at most 20 characters long!' })
        .refine((val) => /[a-z]/.test(val), { message: 'The password must contain at least one lowercase letter!' })
        .refine((val) => /[A-Z]/.test(val), { message: 'The password must contain at least one uppercase letter!' })
        .refine((val) => /[0-9]/.test(val), { message: 'The password must contain at least one number!' })
        .refine((val) => /[^A-Za-z0-9]/.test(val), { message: 'The password must contain at least one special character!' })
        .refine((val) => !/\s/.test(val), { message: 'The password cannot contain spaces!' }),
});
export type CreateUserPayloadDTO = z.infer<typeof createUserPayload>;


/**
 * ===========================================================================================
 * AUTH USER PAYLOAD
 * ===========================================================================================
 */
export const authUserPayload = createUserPayload.pick({ email: true }).extend({ password: z.string().max(100) });
export type AuthUserPayloadDTO = z.infer<typeof authUserPayload>;