"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState("Starting up...");
  const [fadeOut, setFadeOut] = useState(false);

  const messages = [
    "Setting things up...",
    "Checking your savings...",
    "Almost ready...",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setStatus(messages[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            router.push("/register");
          }, 800);
        }, 500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(at 0% 0%, rgba(0, 82, 255, 0.03) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(0, 82, 255, 0.03) 0px, transparent 50%)
        `,
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo with Pulse */}
        <div style={{ position: 'relative', marginBottom: '25px' }}>
          {/* Pulse Circle */}
          <div
            style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              background: '#0052ff',
              borderRadius: '20px',
              zIndex: 1,
              opacity: 0.4,
              animation: 'friendlyPulse 3s ease-out infinite',
            }}
          />
          {/* Logo Box */}
          <div
            style={{
              width: '80px',
              height: '80px',
              background: '#0052ff',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 900,
              boxShadow: '0 20px 40px rgba(0, 82, 255, 0.2)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            S
          </div>
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#1e293b',
            letterSpacing: '-0.5px',
            marginBottom: '10px',
            animation: 'fadeInUp 0.6s forwards 0.3s',
            opacity: 0,
            transform: 'translateY(10px)',
          }}
        >
          smart<span style={{ color: '#0052ff' }}>Invest</span>
        </h1>

        {/* Status Text */}
        <p
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#64748b',
            height: '20px',
            animation: 'fadeInUp 0.6s forwards 0.5s',
            opacity: 0,
          }}
        >
          {status}
        </p>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes friendlyPulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
