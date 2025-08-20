import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma/db';
import { response, Response } from '../BaseController';
import { AuthUserPayloadDTO, CreateUserPayloadDTO } from './dto/schemas';

import { existingData } from '../../lib/prisma/commonQueries';


/**
 * ===========================================================================================
 * CREATE USER
 * ===========================================================================================
 */
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


/**
 * ===========================================================================================
 * AUTH USER
 * ===========================================================================================
 */
export async function authUserService(credentials: AuthUserPayloadDTO): Promise<Response> {
    try {
        // ===========================================================================================
        const user = await prisma.users.findUnique({ where: { email: credentials.email } });

        if (!user) {
            return response.error({ message: 'Unregistered user, register your account!' });
        }

        // ===========================================================================================
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
            return response.error({ message: 'Invalid password!' });
        }

        // ===========================================================================================
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        return response.success({ message: 'Login successful!', data: { token } });

    } catch (error: any) {
        const err = error as Error;
        return response.error({ message: err.message || 'Unknow error!' });
    }
}