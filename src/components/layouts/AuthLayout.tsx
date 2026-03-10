import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/cn";

export type AuthLayoutProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-[#f0f5ff] to-white text-slate-800",
        "flex items-center justify-center",
        className,
      )}
    >
      <div className="w-full max-w-[380px] px-4 py-10 text-center">
        <div className="mb-7 flex justify-center">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/lion.png"
              alt="SmartInvest"
              width={160}
              height={60}
              className="h-[60px] w-auto cursor-pointer object-contain"
            />
          </Link>
        </div>

        {title ? (
          <h1 className="text-[1.4rem] font-extrabold tracking-[-0.3px]">{title}</h1>
        ) : null}
        {subtitle ? (
          <p className="mt-2 text-[0.85rem] leading-snug text-slate-500">{subtitle}</p>
        ) : null}

        <div className={cn(title || subtitle ? "mt-5" : "")}>{children}</div>

        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  );
}
