import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Connection with explicit empty password for trust auth
const pool = new Pool({
    host: '/var/run/postgresql',
    port: 5433,
    user: 'postgres',
    password: '',
    database: 'smartinvest',
});

const adapter = new PrismaPg(pool);

const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
