"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { fetchAgomoniRegistrations, updateAgomoniStatus } from "./actions";

interface AgomoniRegistration {
  id: string;
  teamLeaderName: string;
  department: string;
  year: string;
  contact: string;
  email: string;
  category: string;
  duration: string;
  teamMembers: string;
  message: string;
  status: string;
  timestamp: string;
}

export default function AgomoniAdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<AgomoniRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  async function loadData(pwd: string) {
    setIsLoading(true);
    const res = await fetchAgomoniRegistrations(pwd);
    if (res.success && res.registrations) {
      setRegistrations(res.registrations as AgomoniRegistration[]);
      setIsAuthenticated(true);
    } else {
      console.error(res.error || "Failed to load registrations");
    }
    setIsLoading(false);
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateAgomoniStatus(password, id, newStatus);
    if (res.success) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } else {
      alert("Failed to update status: " + res.error);
    }
  };

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      setPassword(savedPassword);
      loadData(savedPassword);
    } else {
      window.location.href = "/admin";
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#14120e] flex items-center justify-center p-4">
        <div className="text-[#e5e0d3] font-sans text-sm uppercase tracking-widest animate-pulse">
          Authenticating...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14120e] text-[#e5e0d3] relative pb-20">
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
              <DecryptedText text="AGOMONI APPLICATIONS" speed={30} sequential={true} />
            </h1>
          </div>
          
          <div className="text-xs font-sans text-[#e5e0d3]/50">
            Total: {registrations.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 border-2 border-[#e5e0d3]/20 border-t-[#d4a24e] rounded-full animate-spin" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#e5e0d3]/10 rounded-2xl">
            <p className="font-serif italic text-[#e5e0d3]/40">No registrations found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-[#1e1c18] border border-[#e5e0d3]/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#d4a24e]/30"
              >
                {/* Header Row */}
                <div 
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => toggleExpand(reg.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-sans font-bold text-lg text-[#faf6ee]">
                        {reg.teamLeaderName}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        reg.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                        reg.status === 'holding' ? 'bg-[#d4a24e]/20 text-[#d4a24e]' :
                        reg.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {reg.status || 'pending'}
                      </span>
                    </div>
                    <p className="font-serif text-sm text-[#e5e0d3]/60">
                      {reg.department} &bull; {reg.year} &bull; {reg.category}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-sans text-[#e5e0d3]/40">
                    <span>{new Date(reg.timestamp).toLocaleDateString()}</span>
                    <svg 
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`transition-transform duration-300 ${expandedIds.has(reg.id) ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedIds.has(reg.id) && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#e5e0d3]/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-[#d4a24e] mb-1">Contact</span>
                          <p className="font-mono text-sm">{reg.contact}</p>
                          {reg.email && <p className="font-sans text-sm text-[#e5e0d3]/70">{reg.email}</p>}
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-[#d4a24e] mb-1">Performance Details</span>
                          <p className="font-sans text-sm"><span className="text-[#e5e0d3]/50">Category:</span> {reg.category}</p>
                          <p className="font-sans text-sm"><span className="text-[#e5e0d3]/50">Duration:</span> {reg.duration}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-[#d4a24e] mb-1">Team Members</span>
                          <p className="font-sans text-sm whitespace-pre-wrap">{reg.teamMembers}</p>
                        </div>
                        {reg.message && (
                          <div>
                            <span className="block text-[10px] uppercase tracking-widest text-[#d4a24e] mb-1">Additional Message</span>
                            <p className="font-serif text-sm italic text-[#e5e0d3]/80 border-l-2 border-[#d4a24e]/30 pl-3">{reg.message}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#e5e0d3]/5">
                      <span className="text-[10px] uppercase tracking-widest text-[#e5e0d3]/40 mr-2">Set Status:</span>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(reg.id, "pending"); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-colors ${
                          reg.status === 'pending' || !reg.status ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-transparent text-[#e5e0d3]/40 border border-[#e5e0d3]/10 hover:border-blue-500/50 hover:text-blue-400'
                        }`}
                      >
                        Pending
                      </button>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(reg.id, "holding"); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-colors ${
                          reg.status === 'holding' ? 'bg-[#d4a24e]/20 text-[#d4a24e] border border-[#d4a24e]/30' : 'bg-transparent text-[#e5e0d3]/40 border border-[#e5e0d3]/10 hover:border-[#d4a24e]/50 hover:text-[#d4a24e]'
                        }`}
                      >
                        Holding
                      </button>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(reg.id, "approved"); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-colors ${
                          reg.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-transparent text-[#e5e0d3]/40 border border-[#e5e0d3]/10 hover:border-green-500/50 hover:text-green-400'
                        }`}
                      >
                        Approved
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(reg.id, "rejected"); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-colors ${
                          reg.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-transparent text-[#e5e0d3]/40 border border-[#e5e0d3]/10 hover:border-red-500/50 hover:text-red-400'
                        }`}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
