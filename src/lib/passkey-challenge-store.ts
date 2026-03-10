// Passkey Challenge Store — backed by Postgres via Prisma.
// Data survives server restarts and works across multiple instances.

import prisma from "@/lib/prisma";

export const passkeyChallengeStore = {
    async set(key: string, challenge: string, ttlMs = 5 * 60 * 1000): Promise<void> {
        const expiresAt = new Date(Date.now() + ttlMs);
        await prisma.passkeyChallenge.upsert({
            where: { key },
            update: { challenge, expiresAt },
            create: { key, challenge, expiresAt },
        });
    },

    async consume(key: string): Promise<string | null> {
        const record = await prisma.passkeyChallenge.findUnique({ where: { key } });

        if (!record) return null;

        // Always delete so the challenge is single-use
        await prisma.passkeyChallenge.delete({ where: { key } });

        if (new Date() > record.expiresAt) return null;

        return record.challenge;
    },
};
