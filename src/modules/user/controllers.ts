import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../BaseController';
import { validate } from '../../utils/validate';
import { createUserService } from './services';
import { createUserPayload, CreateUserPayloadDTO } from './dto/schemas';


export class UserController extends BaseController {

    // CREATE USER
    async createUser(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const payload = validate<CreateUserPayloadDTO>(createUserPayload, req.body);
            if (!payload.success) return payload;

            return await createUserService(payload.data as CreateUserPayloadDTO);
        });
    }
}