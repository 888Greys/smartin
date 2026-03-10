function getConfiguredCallbackSecret(): string | null {
    const value = process.env.MEGAPAY_CALLBACK_SECRET?.trim();
    return value ? value : null;
}

function getAppUrl(): string {
    const appUrl = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (appUrl) {
        return appUrl;
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("APP_URL (or NEXT_PUBLIC_APP_URL) is required in production.");
    }

    return "http://localhost:3000";
}

export function buildMpesaCallbackUrl(): string {
    const secret = getConfiguredCallbackSecret();
    if (!secret && process.env.NODE_ENV === "production") {
        throw new Error("MEGAPAY_CALLBACK_SECRET is required in production.");
    }

    const url = new URL("/api/mpesa/callback", getAppUrl());
    if (secret) {
        url.searchParams.set("token", secret);
    }

    return url.toString();
}

export function verifyMpesaCallbackToken(request: Request): boolean {
    const secret = getConfiguredCallbackSecret();

    if (!secret) {
        return process.env.NODE_ENV !== "production";
    }

    const token = new URL(request.url).searchParams.get("token");
    return token === secret;
}
