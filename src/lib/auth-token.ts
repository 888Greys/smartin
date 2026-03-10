import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
    userId: string;
    email?: string;
}

const DEV_JWT_SECRET = "dev-only-jwt-secret-change-me";

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        return secret;
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET is required in production.");
    }

    return DEV_JWT_SECRET;
}

export function signAuthToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (!decoded || typeof decoded === "string") {
            return null;
        }

        const userId = decoded.userId;
        if (typeof userId !== "string" || userId.length === 0) {
            return null;
        }

        const email = typeof decoded.email === "string" ? decoded.email : undefined;

        return { userId, email };
    } catch {
        return null;
    }
}

export function getBearerToken(request: Request): string | null {
    const authHeader =
        request.headers.get("authorization") ??
        request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.slice(7).trim();
    return token.length > 0 ? token : null;
}
