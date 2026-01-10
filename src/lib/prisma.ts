import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// TCP connection with password
const pool = new Pool({
    host: '127.0.0.1',
    port: 5433,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres123',
    database: 'smartinvest',
});

const adapter = new PrismaPg(pool);

const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
