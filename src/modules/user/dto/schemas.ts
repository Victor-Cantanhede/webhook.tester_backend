import { z } from 'zod';


/**
 * ===========================================================================================
 * CREATE USER PAYLOAD
 * ===========================================================================================
 */
export const createUserPayload = z.object({
    name: z.string().min(3).max(100),
    email: z.email().min(3).max(100),

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