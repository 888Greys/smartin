import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "smartInvest | AI-Powered Investment Dashboard",
  description: "Deposit $10. See yield in 24h. AI-powered investment platform with tokenized T-Bills.",
  keywords: ["investment", "AI", "yield", "crypto", "T-Bills", "smartInvest"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
