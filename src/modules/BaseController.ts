import { FastifyRequest, FastifyReply } from 'fastify';


export interface Response<T = any> {
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
    error?: any;
}

export class BaseController {
    protected async request(
        req: FastifyRequest,
        res: FastifyReply,
        callback: () => Promise<Response>

    ): Promise<Response> {

        try {
            const response = await callback();
            const { success, message, statusCode, data, error } = response;

            return res.status(statusCode).send({ success, message, data, error });

        } catch (error: any) {
            return res.status(500).send({
                success: false,
                message: 'Internal error!',
                error: error
            });
        }
    }
}


function success<T>(params: { message: string; data?: T; statusCode?: number }): Response<T> {
    return {
        success: true,
        message: params.message,
        statusCode: params.statusCode ?? 200,
        data: params.data
    };
}

function error(params: { message: string; statusCode?: number; error?: any }): Response {
    return {
        success: false,
        message: params.message,
        statusCode: params.statusCode ?? 400,
        error: params.error
    };
}

export const response = { success, error };