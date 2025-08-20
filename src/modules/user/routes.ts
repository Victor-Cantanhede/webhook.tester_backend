import { FastifyInstance } from 'fastify';
import { UserController } from './controllers';


export async function userRoutes(app: FastifyInstance) {
    const controller = new UserController();

    app.post('/create', (req, res) => controller.createUser(req, res));
    app.post('/auth', (req, res) => controller.authUser(req, res));
    
    app.post('/auth_email', (req, res) => controller.sendAuthEmail(req, res));
    app.put('/auth_email', (req, res) => controller.authEmail(req, res));
    app.put('/change_password', (req, res) => controller.changePassword(req, res));
}