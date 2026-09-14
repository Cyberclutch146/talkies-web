"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";

import { verifyPassword } from "./actions";

const adminModules = [
  {
    title: "Magazine Issues",
    description: "Upload, manage, and delete magazine PDF issues from the archive.",
    href: "/admin/magazines",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    tag: "01 // PUBLICATIONS",
  },
  {
    title: "Instagram Feed",
    description: "Curate the Instagram photo wall shown on the landing page.",
    href: "/admin/instagram",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    tag: "02 // SOCIAL MEDIA",
  },
  {
    title: "Applicant Tracking",
    description: "Manage applications for Team Leads and Team Members securely.",
    href: "/admin/recruitment",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    tag: "03 // RECRUITMENT",
  },
  {
    title: "Inbox",
    description: "Read and manage incoming messages from the contact page.",
    href: "/admin/inbox",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </svg>
    ),
    tag: "04 // DISPATCHES",
  },
];

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const [storageStats, setStorageStats] = useState<{
    totalMB: string;
    limitMB: number;
    percentage: string;
    fileCount: number;
  } | null>(null);
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPassword(savedPassword);
      setIsAuthenticated(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStorageStats(savedPassword);
    }
  }, []);

  async function fetchStorageStats(authPassword: string) {
    setIsLoadingStorage(true);
    try {
      const res = await fetch("/api/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: authPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setStorageStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch storage stats", e);
    } finally {
      setIsLoadingStorage(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    const result = await verifyPassword(password);
    
    if (result.success) {
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem("adminPassword", password);
      fetchStorageStats(password);
    } else {
      setError(result.error || "Invalid credentials");
      setShakeKey((k) => k + 1);
    }
    
    setIsVerifying(false);
  };

  /* ─── Login Gate ─── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#14120e] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#e5e0d3 0.6px, transparent 0.6px), radial-gradient(#e5e0d3 0.6px, transparent 0.6px)",
            backgroundSize: "4px 4px",
            backgroundPosition: "0 0, 2px 2px",
          }}
        />

        <form
          key={shakeKey}
          onSubmit={handleAuth}
          className="relative max-w-sm w-full space-y-6"
          style={error ? { animation: "shake 0.4s ease-in-out" } : undefined}
        >
          {/* Decorative top rule */}
          <div className="flex items-center gap-3 text-[9px] font-sans uppercase tracking-[0.3em] text-[#e5e0d3]/30">
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
            <span>RESTRICTED</span>
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-tighter text-[#e5e0d3]">
              ADMIN
            </h1>
            <p className="font-serif text-sm italic text-[#e5e0d3]/30">
              Editorial board access only
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoFocus
              className="w-full bg-[#e5e0d3]/5 border border-[#e5e0d3]/15 text-[#e5e0d3] p-4 font-sans text-sm tracking-wider outline-none focus:border-[#c83a1a]/50 transition-colors placeholder:text-[#e5e0d3]/20"
            />
            {error && (
              <p className="text-[#c83a1a] text-[10px] font-sans uppercase tracking-widest text-center font-bold">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#c83a1a] text-[#e5e0d3] font-display text-lg uppercase tracking-wide py-3.5 hover:bg-[#a62b10] transition-colors"
          >
            ENTER DASHBOARD
          </button>

          <div className="flex items-center gap-3 text-[9px] font-sans uppercase tracking-[0.3em] text-[#e5e0d3]/20">
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
            <span>RCC TALKIES</span>
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
          </div>
        </form>

        {/* Shake animation */}
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }
        `}</style>
      </div>
    );
  }

  /* ─── Dashboard ─── */
  return (
    <div className="min-h-screen bg-[#e5e0d3] text-[#14120e]">
      {/* Header */}
      <div className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#c83a1a] animate-pulse" />
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold">
              EDITORIAL BOARD DASHBOARD
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3] mb-4">
            <DecryptedText
              text="ADMIN PANEL"
              animateOn="view"
              speed={40}
              maxIterations={8}
              sequential={true}
              className="text-[#e5e0d3]"
              encryptedClassName="text-[#c83a1a]"
            />
          </h1>
          <p className="font-serif text-sm text-[#e5e0d3]/50 max-w-md">
            Manage publications, social feeds, and editorial content for The RCC Talkies.
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {adminModules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group border border-[#14120e]/20 bg-[#eae5d9] p-6 sm:p-8 flex flex-col justify-between hover:border-[#14120e] hover:shadow-[6px_6px_0px_#14120e] hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#c83a1a]">
                    {mod.tag}
                  </span>
                  <div className="w-10 h-10 border border-[#14120e]/20 flex items-center justify-center text-[#14120e]/50 group-hover:border-[#c83a1a] group-hover:text-[#c83a1a] transition-colors">
                    {mod.icon}
                  </div>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#14120e] mb-2 group-hover:text-[#c83a1a] transition-colors">
                  {mod.title}
                </h2>
                <p className="font-serif text-sm text-[#14120e]/60 leading-relaxed">
                  {mod.description}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.15em] font-bold text-[#14120e]/40 group-hover:text-[#c83a1a] transition-colors">
                <span>Open Panel</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Storage Usage Widget */}
        <div className="mt-12 border border-[#14120e]/20 bg-[#eae5d9] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-tight text-[#14120e]">
                Cloud Storage
              </h2>
              <p className="font-serif text-sm text-[#14120e]/60 mt-1">
                Vercel Blob capacity (Hobby Tier limit: 250MB)
              </p>
            </div>
            <div className="w-10 h-10 border border-[#14120e]/20 flex items-center justify-center text-[#14120e]/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
          </div>
          
          {isLoadingStorage ? (
            <div className="flex items-center gap-3 text-xs font-sans uppercase tracking-widest text-[#14120e]/50 py-4">
              <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              Calculating usage...
            </div>
          ) : storageStats ? (
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-3xl text-[#14120e]">
                  {storageStats.percentage}% <span className="text-lg text-[#14120e]/50">Used</span>
                </span>
                <span className="font-mono text-sm text-[#14120e]/70">
                  {storageStats.totalMB}MB / {storageStats.limitMB}MB
                </span>
              </div>
              
              {/* Progress bar background */}
              <div className="w-full h-4 bg-[#14120e]/10 overflow-hidden relative">
                {/* Progress bar fill */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${Number(storageStats.percentage) > 90 ? 'bg-[#c83a1a]' : 'bg-[#14120e]'}`}
                  style={{ width: `${storageStats.percentage}%` }}
                />
              </div>
              
              <div className="mt-4 flex items-center gap-6">
                <div className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60">
                  <span className="font-bold text-[#14120e]">{storageStats.fileCount}</span> total files stored
                </div>
                {Number(storageStats.percentage) > 90 && (
                  <div className="text-xs font-sans uppercase tracking-widest text-[#c83a1a] font-bold flex items-center gap-1">
                    ⚠️ Approaching Limit
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs font-sans uppercase tracking-widest text-[#c83a1a] py-4">
              Failed to load storage statistics.
            </div>
          )}
        </div>

        {/* Quick Info Bar */}
        <div className="mt-10 border-t border-[#14120e]/20 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans uppercase tracking-widest text-[#14120e]/40">
          <div className="flex items-center gap-2">
            <span className="text-[#c83a1a]">✦</span>
            <span>Authenticated as Admin</span>
          </div>
          <Link
            href="/"
            className="hover:text-[#c83a1a] transition-colors font-bold"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
