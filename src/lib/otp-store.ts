// OTP Store — backed by Postgres via Prisma.
// Data survives server restarts and works across multiple instances.

import prisma from "@/lib/prisma";

export const otpStore = {
    async set(email: string, otp: string, expiryMinutes = 10): Promise<void> {
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
        await prisma.otpCode.upsert({
            where: { email: email.toLowerCase() },
            update: { otp, expiresAt, attempts: 0, lockedUntil: null },
            create: { email: email.toLowerCase(), otp, expiresAt },
        });
    },

    async get(email: string) {
        return prisma.otpCode.findUnique({
            where: { email: email.toLowerCase() },
        });
    },

    async verify(
        email: string,
        otp: string
    ): Promise<{ valid: boolean; error?: string }> {
        const data = await prisma.otpCode.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!data) {
            return { valid: false, error: "No verification code found. Please request a new one." };
        }

        if (new Date() > data.expiresAt) {
            await prisma.otpCode.delete({ where: { email: email.toLowerCase() } });
            return { valid: false, error: "Verification code has expired. Please request a new one." };
        }

        if (data.lockedUntil && new Date() < data.lockedUntil) {
            return { valid: false, error: "Too many invalid attempts. Please request a new code." };
        }

        if (data.otp !== otp) {
            const newAttempts = data.attempts + 1;
            const lockedUntil =
                newAttempts >= 5 ? new Date(Date.now() + 10 * 60 * 1000) : null;
            await prisma.otpCode.update({
                where: { email: email.toLowerCase() },
                data: { attempts: newAttempts, ...(lockedUntil ? { lockedUntil } : {}) },
            });
            return { valid: false, error: "Invalid verification code. Please try again." };
        }

        // Valid — remove from store
        await prisma.otpCode.delete({ where: { email: email.toLowerCase() } });
        return { valid: true };
    },

    generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },
};
