import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../BaseController';
import { createUserService } from './services';


export class UserController extends BaseController {

    // CREATE USER
    async createUser(req: FastifyRequest, res: FastifyReply) {
        return this.request(req, res, async () => {

            return await createUserService();
        });
    }
}