import { FastifyInstance } from 'fastify';
import { UserController } from './controllers';


export async function userRoutes(app: FastifyInstance) {
    const controller = new UserController();

    app.post('/create', (req, res) => controller.createUser(req, res));
    app.post('/auth', (req, res) => controller.authUser(req, res));
}