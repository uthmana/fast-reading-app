import { PrismaClient } from '@prisma/client';
var globalForPrisma = global;
export var prisma = globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
export default prisma;
