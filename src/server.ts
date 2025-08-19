import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';


async function bootstrap() {
    const PORT = Number(process.env.PORT) || 5000;
    const FRONT_URL = process.env.FRONT_URL?.toString() || 'http://localhost:3000';

    const app = Fastify();

    // CONFIG CORS
    await app.register(fastifyCors, {
        origin: FRONT_URL,
        credentials: true
    });

    // CONFIG JWT
    app.register(fastifyCookie, {
        secret: process.env.JWT_SECRET as string || 'JWT_SECRET_DEV'
    });

    // REQUEST TEST
    app.get('/', (req, res) => {
        console.log('New connection detected!');
        res.status(200).send({ message: 'Server connected!' });
    });

    app.listen({ port: PORT }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server running on ${address}`);
    });
}
bootstrap();