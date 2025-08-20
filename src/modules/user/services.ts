import { prisma } from '../../lib/prisma/db';
import { Response } from '../BaseController';


export async function createUserService(): Promise<Response> {
    
    return {
        success: true,
        message: 'Usuário cadastrado com sucesso!',
        statusCode: 201
    };
}