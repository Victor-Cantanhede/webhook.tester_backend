import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma/db';
import { response, Response } from '../BaseController';
import { CreateUserPayloadDTO } from './dto/schemas';

import { existingData } from '../../lib/prisma/commonQueries';


export async function createUserService(user: CreateUserPayloadDTO): Promise<Response> {
    try {
        // ===========================================================================================
        const existingEmail = await existingData({
            inTable: 'users',
            index: 'email',
            data: user.email
        });

        if (existingEmail) {
            return response.error({ message: 'Email already registered!' });
        }

        // ===========================================================================================
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = await prisma.users.create({
            data: { ...user, password: hashedPassword },
            select: { id: true, email: true, name: true, createdAt: true }
        });

        // ===========================================================================================
        return response.success({
            message: 'User registered successfully!',
            statusCode: 201,
            data: { newUser }
        });

    } catch (error: any) {
        const err = error as Error;
        return response.error({ message: err.message || 'Unknow error!' });
    }
}