import { Prisma } from '@prisma/client';
import { prisma } from './db';


interface ExistingDataParams {
    inTable: keyof typeof prisma;
    index: string;
    data: string;
}

export async function existingData({ inTable, index, data }: ExistingDataParams) {
    try {
        const table = (prisma as any)[inTable];

        const response = await table.findFirst({
            where: { [index]: data },
            select: { id: true }
        });

        return response !== null;

    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Invalid query (db): field "${index}" may not exist or wrong type provided.`);
        }
        throw error;
    }
}