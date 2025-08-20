import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../BaseController';
import { validate } from '../../utils/validate';
import { authEmailService, authUserService, createUserService, sendAuthEmailService } from './services';
import { sendAuthEmailPayload, SendAuthEmailPayloadDTO, authUserPayload, AuthUserPayloadDTO, createUserPayload, CreateUserPayloadDTO, AuthEmailPayloadDTO, authEmailPayload } from './dto/schemas';


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

            return await authUserService(payload.data as AuthUserPayloadDTO);
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
}