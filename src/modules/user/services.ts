import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from '../../lib/prisma/db';
import { response, Response } from '../BaseController';
import { AuthEmailPayloadDTO, AuthUserPayloadDTO, ChangePasswordPayloadDTO, CreateUserPayloadDTO } from './dto/schemas';

import { existingData } from '../../lib/prisma/commonQueries';
import { v4 as uuidV4 } from 'uuid';


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
            select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
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
        const { password, ...safeUserData } = user;
        const token = jwt.sign(safeUserData, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        // ===========================================================================================
        return response.success({
            message: 'Login successful!',
            data: {
                token: token,
                user: safeUserData
            }
        });

    } catch (error: any) {
        const err = error as Error;
        return response.error({ message: err.message || 'Unknow error!' });
    }
}


/**
 * ===========================================================================================
 * AUTH EMAIL
 * ===========================================================================================
 */
const authEmailCodes = new Map<string, string>();

// SET CODE
function saveCode(email: string, code: string) {
    authEmailCodes.set(email, code);
    
    setTimeout(() => {
        authEmailCodes.delete(email);
    }, 5 * 60 * 1000);
}

// GET CODE
function getCode(email: string) {
    return authEmailCodes.get(email);
}

// DELETE CODE
function deleteCode(email: string) {
    authEmailCodes.delete(email);
}

// SEND CODE
export async function sendAuthEmailService(email: string): Promise<Response> {
    try {
        // ===========================================================================================
        const user = await prisma.users.findUnique({ where: { email: email } });

        if (!user) {
            return response.error({ message: 'Unregistered user, register your account!' });
        }

        // ===========================================================================================
        if (getCode(email)) {
            return response.error({ message: 'Code already sent! Please wait a few minutes and try again!' });
        }

        const newCode = uuidV4();
        saveCode(email, newCode);

        // ===========================================================================================
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        await transporter.sendMail({
            from: 'Webhook Tester <no-reply@webhooktester.com>',
            to: email,
            subject: 'Email authentication',
            text: `Click the link to authenticate your email: ${process.env.FRONT_URL}/auth_email/${email}_${newCode}`
        });

        // ===========================================================================================
        return response.success({ message: 'Authentication link successfully sent to your email!' });

    } catch (error: any) {
        const err = error as Error;
        return response.error({ message: 'Error sending authentication code!', error: err });
    }
}


// AUTHENTICATING EMAIL
export async function authEmailService(data: AuthEmailPayloadDTO): Promise<Response> {
    try {
        // ===========================================================================================
        const savedCode = getCode(data.email);

        if (!savedCode || (savedCode !== data.code)) {
            return response.error({ message: 'Invalid or expired verification link! Generate a new link and try again.' });
        }
        deleteCode(data.email);

        // ===========================================================================================
        await prisma.users.update({
            where: { email: data.email },
            data: { status: true }
        });

        // ===========================================================================================
        return response.success({ message: 'Email successfully authenticated!' });

    } catch (error: any) {
        const err = error as Error;
        return response.error({ message: 'Error authenticating email!', error: err });
    }
}


/**
 * ===========================================================================================
 * CHANGE PASSWORD
 * ===========================================================================================
 */
export async function changePasswordService(data: ChangePasswordPayloadDTO) {
    try {
        // ===========================================================================================
        const savedCode = getCode(data.email);

        if (!savedCode || (savedCode !== data.code)) {
            return response.error({ message: 'Invalid or expired verification link! Generate a new link and try again.' });
        }
        deleteCode(data.email);

        // ===========================================================================================
        const hashedPassword = await bcrypt.hash(data.password, 10);

        await prisma.users.update({
            where: { email: data.email },
            data: { password: hashedPassword }
        });

        // ===========================================================================================
        return response.success({ message: 'Password changed successfully!' });

    } catch (error: any) {
        const err = error as Error;
        return response.error({ message: 'Error changing password!' });
    }
}