import * as React from "react";

import { cn } from "@/lib/cn";

type CardPadding = "sm" | "md" | "lg";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: CardPadding;
};

const paddingClassName: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ className, padding = "md", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.04)]",
        paddingClassName[padding],
        className,
      )}
      {...props}
    />
  );
}
