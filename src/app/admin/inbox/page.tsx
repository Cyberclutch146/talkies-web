"use client";

import { useState } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { verifyPassword } from "../actions";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  desk: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function InboxDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchMessages = async (pwd: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError(data.error || "Authentication failed");
        setShakeKey((k) => k + 1);
      }
    } catch {
      setAuthError("Failed to connect to server");
      setShakeKey((k) => k + 1);
    } finally {
      setIsLoading(false);
      setIsVerifying(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length === 0) {
      setAuthError("Please enter the admin password");
      return;
    }
    setIsVerifying(true);
    const result = await verifyPassword(password);
    if (result.success) {
      fetchMessages(password);
    } else {
      setAuthError(result.error || "Invalid credentials");
      setShakeKey((k) => k + 1);
      setIsVerifying(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
      }
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      const res = await fetch("/api/inbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id }),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#14120e] flex items-center justify-center p-4 relative overflow-hidden">
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
          style={authError ? { animation: "shake 0.4s ease-in-out" } : undefined}
        >
          <div className="flex items-center gap-3 text-[9px] font-sans uppercase tracking-[0.3em] text-[#e5e0d3]/30">
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
            <span>RESTRICTED</span>
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-tighter text-[#e5e0d3]">
              INBOX
            </h1>
            <p className="font-serif text-sm italic text-[#e5e0d3]/30">
              Read incoming contact dispatches
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError("");
              }}
              autoFocus
              className="w-full bg-[#e5e0d3]/5 border border-[#e5e0d3]/15 text-[#e5e0d3] p-4 font-sans text-sm tracking-wider outline-none focus:border-[#c83a1a]/50 transition-colors placeholder:text-[#e5e0d3]/20"
            />
            {authError && (
              <p className="text-[#c83a1a] text-[10px] font-sans uppercase tracking-widest text-center font-bold">
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#e5e0d3] text-[#14120e] p-4 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#c83a1a] hover:text-[#e5e0d3] transition-colors disabled:opacity-50"
            >
              {isVerifying ? "VERIFYING..." : "ACCESS INBOX"}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/admin" className="text-[#e5e0d3]/40 hover:text-[#e5e0d3] transition-colors text-[10px] font-sans uppercase tracking-widest">
              ← Back to Dashboard
            </Link>
          </div>
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-4px); }
              40% { transform: translateX(4px); }
              60% { transform: translateX(-4px); }
              80% { transform: translateX(4px); }
            }
          `}} />
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14120e] text-[#e5e0d3] relative">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(#e5e0d3 0.6px, transparent 0.6px), radial-gradient(#e5e0d3 0.6px, transparent 0.6px)",
          backgroundSize: "4px 4px",
          backgroundPosition: "0 0, 2px 2px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#14120e]/80 backdrop-blur-md border-b border-[#e5e0d3]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/admin"
              className="text-[#e5e0d3]/40 hover:text-[#e5e0d3] transition-colors text-xs font-sans uppercase tracking-widest flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">DASHBOARD</span>
            </Link>
            <div className="h-4 w-px bg-[#e5e0d3]/10" />
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText text="INBOX" speed={30} sequential={true} />
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 border-2 border-[#e5e0d3]/20 border-t-[#c83a1a] rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 border border-[#e5e0d3]/10 border-dashed">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#e5e0d3]/30">
              No messages found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isExpanded = expandedIds.has(msg.id);
              return (
                <div key={msg.id} className="border border-[#e5e0d3]/15 bg-[#14120e] hover:bg-[#e5e0d3]/5 transition-colors overflow-hidden">
                  {/* Header Row */}
                  <div 
                    onClick={() => toggleExpand(msg.id)}
                    className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`inline-block px-2 py-0.5 text-[9px] font-sans uppercase tracking-widest font-bold ${
                          msg.status === "UNREAD" ? "bg-[#c83a1a] text-[#e5e0d3]" :
                          msg.status === "READ" ? "bg-[#e5e0d3]/20 text-[#e5e0d3]" :
                          "bg-transparent border border-[#e5e0d3]/20 text-[#e5e0d3]/40"
                        }`}>
                          {msg.status}
                        </span>
                        <span className="text-xs font-sans text-[#e5e0d3]/50">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-sans text-[#c83a1a] uppercase tracking-wider">
                          [{msg.desk}]
                        </span>
                      </div>
                      <h3 className="font-gothic text-xl truncate text-[#e5e0d3]">
                        {msg.name} <span className="font-sans text-sm text-[#e5e0d3]/40 ml-2">({msg.email})</span>
                      </h3>
                    </div>
                    <div className="flex items-center text-[#e5e0d3]/30">
                      <svg
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t border-[#e5e0d3]/10 bg-black/20">
                      <div className="mb-6">
                        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#e5e0d3]/40 block mb-2">Message</span>
                        <p className="font-serif text-[#e5e0d3]/80 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#e5e0d3]/10">
                        {msg.status !== "READ" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, "READ"); }}
                            className="px-3 py-1.5 border border-[#e5e0d3]/20 text-xs font-sans uppercase tracking-widest text-[#e5e0d3]/70 hover:bg-[#e5e0d3] hover:text-[#14120e] transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                        {msg.status !== "UNREAD" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, "UNREAD"); }}
                            className="px-3 py-1.5 border border-[#e5e0d3]/20 text-xs font-sans uppercase tracking-widest text-[#e5e0d3]/70 hover:bg-[#e5e0d3] hover:text-[#14120e] transition-colors"
                          >
                            Mark Unread
                          </button>
                        )}
                        {msg.status !== "ARCHIVED" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, "ARCHIVED"); }}
                            className="px-3 py-1.5 border border-[#e5e0d3]/20 text-xs font-sans uppercase tracking-widest text-[#e5e0d3]/70 hover:bg-[#e5e0d3] hover:text-[#14120e] transition-colors"
                          >
                            Archive
                          </button>
                        )}
                        <div className="flex-1" />
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                          className="px-3 py-1.5 border border-[#c83a1a]/40 text-[#c83a1a] text-xs font-sans uppercase tracking-widest hover:bg-[#c83a1a] hover:text-[#e5e0d3] transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
