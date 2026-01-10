// Shared OTP Store
// Note: This works for development. In production, use Redis or a database.

interface OTPData {
    otp: string;
    expires: number;
}

class OTPStore {
    private store = new Map<string, OTPData>();

    set(email: string, otp: string, expiryMinutes: number = 10): void {
        this.store.set(email.toLowerCase(), {
            otp,
            expires: Date.now() + expiryMinutes * 60 * 1000,
        });
    }

    get(email: string): OTPData | undefined {
        return this.store.get(email.toLowerCase());
    }

    verify(email: string, otp: string): { valid: boolean; error?: string } {
        const data = this.store.get(email.toLowerCase());

        if (!data) {
            return { valid: false, error: 'No verification code found. Please request a new one.' };
        }

        if (Date.now() > data.expires) {
            this.store.delete(email.toLowerCase());
            return { valid: false, error: 'Verification code has expired. Please request a new one.' };
        }

        if (data.otp !== otp) {
            return { valid: false, error: 'Invalid verification code. Please try again.' };
        }

        // Valid - remove from store
        this.store.delete(email.toLowerCase());
        return { valid: true };
    }

    generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

// Singleton instance
export const otpStore = new OTPStore();
