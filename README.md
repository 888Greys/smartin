# SmartInvest

Investment dashboard built with Next.js 16, TypeScript, Prisma, and Tailwind CSS.

## Features

- Registration and login with JWT auth
- OTP email verification
- Passkey registration and biometric authentication
- Wallet flows for M-Pesa deposits and withdrawals
- Referral bonuses and transaction history

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Database: PostgreSQL + Prisma
- Styling: Tailwind CSS
- Animations: Framer Motion

## Required Environment Variables

- `DATABASE_URL`
- `JWT_SECRET`
- `APP_URL` (or `NEXT_PUBLIC_APP_URL`)
- `MEGAPAY_API_KEY`
- `MEGAPAY_EMAIL`
- `MEGAPAY_CALLBACK_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `RP_ID`
- `ORIGIN`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Deployment

```bash
npm run build
npm start
```

## License

MIT
