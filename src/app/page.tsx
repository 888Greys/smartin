"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState("Initializing...");

  const statuses = [
    "Connecting to servers...",
    "Preparing your experience...",
    "Almost ready...",
    "Welcome!",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < statuses.length) {
        setStatus(statuses[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/register");
        }, 500);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#f0f5ff] to-white flex flex-col justify-center items-center gap-8">
      {/* Animated Core */}
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-[#0052ff]/20 rounded-[38%_62%_63%_37%/41%_44%_56%_59%] animate-[morph_5s_linear_infinite,spin_12s_linear_infinite]" />
        {/* Inner ring */}
        <div className="absolute inset-2 border border-[#0052ff]/10 rounded-[60%_40%_70%_30%/50%_60%_40%_50%] animate-[morph_5s_linear_infinite_reverse,spin_10s_linear_infinite_reverse]" />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0052ff] rounded-full shadow-[0_0_20px_#0052ff] animate-pulse" />
      </div>

      {/* Brand */}
      <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight animate-fade-in">
        SMART<span className="text-[#0052ff]">INVEST</span>
      </h1>

      {/* Status */}
      <p className="text-sm text-[#64748b] font-medium uppercase tracking-wider">
        {status}
      </p>
    </div>
  );
}
