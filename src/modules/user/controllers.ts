import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../BaseController';
import { validate } from '../../utils/validate';
import { createUserService } from './services';
import { createUserPayload, CreateUserPayloadDTO } from './dto/schemas';


export class UserController extends BaseController {

    // CREATE USER
    async createUser(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            const validation = validate<CreateUserPayloadDTO>(createUserPayload, req.body);
            if (!validation.success) return validation;

            return await createUserService();
        });
    }
}