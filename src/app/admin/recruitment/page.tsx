"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";

interface Application {
  id: string;
  type: string;
  name: string;
  collegeEmail: string;
  rollNumber: string;
  yearOfStudy: string;
  phoneNumber: string;
  positionAppliedFor: string;
  portfolioLink?: string;
  whyJoin?: string;
  status: string;
  createdAt: string;
}

export default function RecruitmentDashboard() {
  // Auth state
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Data state
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  
  // UI state
  const [expandedType, setExpandedType] = useState<string | null>(null); // "LEAD" or "TEAM"
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const fetchApplications = async (pwd: string) => {
    setIsLoading(true);
    setUpdateError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications);
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError(data.error || "Authentication failed");
      }
    } catch (err) {
      setAuthError("Failed to connect to server");
    } finally {
      setIsLoading(false);
      setIsVerifying(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    fetchApplications(password);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, status: newStatus }),
      });
      if (res.ok) {
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
      } else {
        const data = await res.json();
        setUpdateError(data.error || "Failed to update status");
      }
    } catch (err) {
      setUpdateError("Failed to update status");
    }
  };

  const handleSendEmail = (role: string) => {
    const shortlistedEmails = applications
      .filter(app => app.positionAppliedFor === role && app.status === "SHORTLISTED")
      .map(app => app.collegeEmail);

    if (shortlistedEmails.length === 0) {
      alert("No shortlisted candidates found for this role.");
      return;
    }

    const bcc = shortlistedEmails.join(",");
    const subject = encodeURIComponent(`RCC Talkies - Next Steps for ${role}`);
    const body = encodeURIComponent(`Hello,\n\nCongratulations! You have been shortlisted for the ${role} position at RCC Talkies.\n\nWe will be reaching out shortly with details for your interview.\n\nBest,\nThe RCC Talkies Team`);
    
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  // Grouping logic
  const getGroupedRoles = (type: string) => {
    const appsForType = applications.filter(app => app.type === type);
    const roles = Array.from(new Set(appsForType.map(app => app.positionAppliedFor)));
    return roles.map(role => ({
      role,
      applicants: appsForType.filter(app => app.positionAppliedFor === role)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#14120e] flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="max-w-sm w-full bg-[#eae5d9] p-8 border border-[#14120e]/20 shadow-[8px_8px_0px_#c83a1a]">
          <h1 className="font-display text-4xl text-[#14120e] uppercase mb-2 tracking-tight">Recruitment AMS</h1>
          <p className="font-serif text-sm text-[#14120e]/60 mb-6">Restricted access area.</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-1 block">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#e5e0d3] border-b-2 border-[#14120e]/30 focus:border-[#c83a1a] text-[#14120e] p-3 font-sans outline-none transition-colors"
              />
            </div>
          </div>

          {authError && <p className="text-[#c83a1a] text-xs font-sans uppercase mt-4">{authError}</p>}
          
          <button type="submit" disabled={isVerifying} className="w-full mt-6 bg-[#14120e] text-[#e5e0d3] font-display text-xl uppercase py-3 hover:bg-[#c83a1a] transition-colors disabled:opacity-50">
            {isVerifying ? "Verifying..." : "Access Data"}
          </button>
          
          <Link href="/admin" className="block text-center mt-4 text-xs font-sans uppercase tracking-widest text-[#14120e]/50 hover:text-[#c83a1a]">
            ← Back to Admin
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e0d3] text-[#14120e] pt-32 sm:pt-40 pb-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-[#14120e]/20 pb-6 mb-8">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              APPLICANT MANAGEMENT SYSTEM
            </span>
            <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-tighter text-[#14120e]">
              <DecryptedText text="RECRUITMENT" animateOn="view" speed={40} className="text-[#14120e]" encryptedClassName="text-[#c83a1a]" />
            </h1>
          </div>
          <Link href="/admin" className="text-xs font-sans uppercase tracking-widest text-[#14120e]/50 hover:text-[#c83a1a]">
            ← Dashboard
          </Link>
        </div>

        {updateError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 font-sans text-sm">
            {updateError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {["LEAD", "TEAM"].map((type) => (
            <div key={type} className="border border-[#14120e]/20 bg-[#eae5d9] p-6 shadow-[8px_8px_0px_#14120e]">
              <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setExpandedType(expandedType === type ? null : type)}>
                <h2 className="font-display text-3xl uppercase tracking-tight">
                  {type === "LEAD" ? "Team Leads" : "Team Members"}
                </h2>
                <span className="text-2xl font-bold">{expandedType === type ? "−" : "+"}</span>
              </div>

              {expandedType === type && (
                <div className="space-y-4">
                  {getGroupedRoles(type).length === 0 ? (
                    <p className="text-sm font-serif text-[#14120e]/50 italic">No applications yet.</p>
                  ) : (
                    getGroupedRoles(type).map((group) => (
                      <div key={group.role} className="border border-[#14120e]/10 bg-[#e5e0d3]">
                        <div 
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#14120e]/5 transition-colors"
                          onClick={() => setExpandedRole(expandedRole === group.role ? null : group.role)}
                        >
                          <span className="font-sans font-bold uppercase text-sm">{group.role} ({group.applicants.length})</span>
                          <span className="text-xl">{expandedRole === group.role ? "▾" : "▸"}</span>
                        </div>
                        
                        {expandedRole === group.role && (
                          <div className="p-4 border-t border-[#14120e]/10 space-y-4 bg-white/50">
                            <div className="flex justify-end mb-4">
                              <button 
                                onClick={() => handleSendEmail(group.role)}
                                className="bg-[#c83a1a] text-[#e5e0d3] px-4 py-2 text-xs font-sans uppercase font-bold tracking-widest hover:bg-[#a62b10] transition-colors"
                              >
                                Email Shortlisted
                              </button>
                            </div>

                            {group.applicants.map((app) => (
                              <div key={app.id} className="border border-[#14120e]/20 p-4 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg">{app.name}</h3>
                                    <a href={`mailto:${app.collegeEmail}`} className="text-sm text-[#c83a1a] hover:underline block">{app.collegeEmail}</a>
                                    <span className="text-xs text-[#14120e]/60 font-mono block mt-1">{app.rollNumber} • {app.yearOfStudy} • {app.phoneNumber}</span>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <select 
                                      value={app.status}
                                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                      className={`text-xs font-bold uppercase tracking-widest px-2 py-1 border ${
                                        app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-800 border-green-300' : 
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-300' : 
                                        'bg-gray-100 text-gray-800 border-gray-300'
                                      }`}
                                    >
                                      <option value="PENDING">Pending</option>
                                      <option value="SHORTLISTED">Shortlisted</option>
                                      <option value="REJECTED">Rejected</option>
                                    </select>
                                  </div>
                                </div>
                                {app.portfolioLink && (
                                  <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mt-2">
                                    View Portfolio / CV ↗
                                  </a>
                                )}
                                {app.whyJoin && (
                                  <div className="mt-3 bg-[#e5e0d3] p-3 text-sm font-serif italic text-[#14120e]/80 border-l-2 border-[#c83a1a]">
                                    "{app.whyJoin}"
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
