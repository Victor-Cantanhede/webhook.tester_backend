import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../BaseController';
import { validate } from '../../utils/validate';
import { authEmailService, authUserService, changePasswordService, createUserService, sendAuthEmailService } from './services';
import {
    sendAuthEmailPayload,
    SendAuthEmailPayloadDTO,
    authUserPayload,
    AuthUserPayloadDTO,
    createUserPayload,
    CreateUserPayloadDTO,
    AuthEmailPayloadDTO,
    authEmailPayload,
    ChangePasswordPayloadDTO,
    changePasswordPayload
} from './dto/schemas';


export class UserController extends BaseController {

    // CREATE USER
    async createUser(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<CreateUserPayloadDTO>(createUserPayload, req.body);
            if (!payload.success) return payload;

            return await createUserService(payload.data as CreateUserPayloadDTO);
        });
    }


    // AUTH USER
    async authUser(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<AuthUserPayloadDTO>(authUserPayload, req.body);
            if (!payload.success) return payload;

            const response = await authUserService(payload.data as AuthUserPayloadDTO);
            if (!response.success) return response;

            res.setCookie('token', response.data.token as string, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Enter false to test in development/test
                sameSite: 'none',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        });
    }


    // SEND AUTH EMAIL
    async sendAuthEmail(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<SendAuthEmailPayloadDTO>(sendAuthEmailPayload, req.body);
            if (!payload.success) return payload;

            return await sendAuthEmailService(payload.data?.email as string);
        });
    }


    // AUTH EMAIL
    async authEmail(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<AuthEmailPayloadDTO>(authEmailPayload, req.body);
            if (!payload.success) return payload;

            return await authEmailService(payload.data as AuthEmailPayloadDTO);
        });
    }


    // CHANGE PASSWORD
    async changePassword(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<ChangePasswordPayloadDTO>(changePasswordPayload, req.body);
            if (!payload.success) return payload;

            return await changePasswordService(payload.data as ChangePasswordPayloadDTO);
        });
    }
}