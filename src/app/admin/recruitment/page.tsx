"use client";

import { useState } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { verifyPassword } from "../actions";

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
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Allow multiple types and roles to be expanded independently
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const toggleType = (type: string) => {
    setExpandedTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const toggleRole = (role: string) => {
    setExpandedRoles(prev => {
      const next = new Set(prev);
      next.has(role) ? next.delete(role) : next.add(role);
      return next;
    });
  };

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
        setShakeKey(k => k + 1);
      }
    } catch {
      setAuthError("Failed to connect to server");
      setShakeKey(k => k + 1);
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
      fetchApplications(password);
    } else {
      setAuthError(result.error || "Invalid credentials");
      setShakeKey(k => k + 1);
      setIsVerifying(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdateError("");
    setUpdateSuccess("");
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, status: newStatus }),
      });
      if (res.ok) {
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
        setUpdateSuccess("Status updated successfully");
        setTimeout(() => setUpdateSuccess(""), 2000);
      } else {
        const data = await res.json();
        setUpdateError(data.error || "Failed to update status");
      }
    } catch {
      setUpdateError("Failed to update status");
    }
  };

  const [emailAlert, setEmailAlert] = useState<{ role: string; message: string } | null>(null);

  const handleSendEmail = (role: string) => {
    const shortlistedEmails = applications
      .filter(app => app.positionAppliedFor === role && app.status === "SHORTLISTED")
      .map(app => app.collegeEmail);

    if (shortlistedEmails.length === 0) {
      setEmailAlert({ role, message: "No shortlisted candidates. Mark candidates as Shortlisted first." });
      setTimeout(() => setEmailAlert(null), 4000);
      return;
    }

    const bcc = shortlistedEmails.join(",");
    const subject = encodeURIComponent(`RCC Talkies - Next Steps for ${role}`);
    const body = encodeURIComponent(
      `Hello,\n\nCongratulations! You have been shortlisted for the ${role} position at RCC Talkies.\n\nWe will be reaching out shortly with details for your interview.\n\nBest,\nThe RCC Talkies Team`
    );

    // Create a temporary anchor element to reliably trigger mailto
    const a = document.createElement("a");
    a.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
    a.click();
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

  const getCountForType = (type: string) => applications.filter(app => app.type === type).length;
  const getShortlistedCount = (role: string) => applications.filter(app => app.positionAppliedFor === role && app.status === "SHORTLISTED").length;

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
          style={authError ? { animation: "shake 0.4s ease-in-out" } : undefined}
        >
          <div className="flex items-center gap-3 text-[9px] font-sans uppercase tracking-[0.3em] text-[#e5e0d3]/30">
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
            <span>RESTRICTED</span>
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-tighter text-[#e5e0d3]">
              RECRUITMENT
            </h1>
            <p className="font-serif text-sm italic text-[#e5e0d3]/30">
              Applicant data access
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
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-[#c83a1a] text-[#e5e0d3] font-display text-lg uppercase tracking-wide py-3.5 hover:bg-[#a62b10] transition-colors disabled:opacity-50"
          >
            {isVerifying ? "VERIFYING..." : "ACCESS DATA"}
          </button>

          <div className="flex items-center gap-3 text-[9px] font-sans uppercase tracking-[0.3em] text-[#e5e0d3]/20">
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
            <Link href="/admin" className="hover:text-[#c83a1a] transition-colors">← DASHBOARD</Link>
            <span className="flex-1 h-px bg-[#e5e0d3]/10" />
          </div>
        </form>

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
      {/* Header Banner */}
      <div className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#c83a1a] animate-pulse" />
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold">
              APPLICANT MANAGEMENT SYSTEM
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3] mb-4">
            <DecryptedText text="RECRUITMENT" animateOn="view" speed={40} maxIterations={8} sequential={true} className="text-[#e5e0d3]" encryptedClassName="text-[#c83a1a]" />
          </h1>
          <div className="flex items-center gap-6">
            <p className="font-serif text-sm text-[#e5e0d3]/50">
              {applications.length} total applications · {applications.filter(a => a.status === "SHORTLISTED").length} shortlisted
            </p>
            <Link href="/admin" className="text-xs font-sans uppercase tracking-widest text-[#e5e0d3]/40 hover:text-[#c83a1a] transition-colors">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Status Messages */}
        {updateError && (
          <div className="p-4 border border-[#c83a1a] bg-[#c83a1a]/5 text-[#c83a1a] font-sans text-sm uppercase tracking-wider font-bold mb-6">
            {updateError}
          </div>
        )}
        {updateSuccess && (
          <div className="p-4 border border-[#14120e]/30 bg-[#14120e]/5 text-[#14120e] font-sans text-sm uppercase tracking-wider font-bold mb-6">
            ✓ {updateSuccess}
          </div>
        )}

        <div className="space-y-8">
          {["LEAD", "TEAM"].map((type) => {
            const count = getCountForType(type);
            const isExpanded = expandedTypes.has(type);
            const groupedRoles = getGroupedRoles(type);

            return (
              <div key={type} className="border border-[#14120e]/20 bg-[#eae5d9] shadow-[8px_8px_0px_#14120e]">
                {/* Type Header */}
                <div
                  className="flex justify-between items-center p-6 sm:p-8 cursor-pointer hover:bg-[#14120e]/5 transition-colors"
                  onClick={() => toggleType(type)}
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-1">
                      {type === "LEAD" ? "01" : "02"}
                    </span>
                    <div>
                      <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight">
                        {type === "LEAD" ? "Team Leads" : "Team Members"}
                      </h2>
                      <span className="font-sans text-xs uppercase tracking-widest text-[#14120e]/50 font-bold">
                        {count} {count === 1 ? "application" : "applications"} · {groupedRoles.length} {groupedRoles.length === 1 ? "role" : "roles"}
                      </span>
                    </div>
                  </div>
                  <span className={`text-2xl font-bold transition-transform ${isExpanded ? "rotate-45" : ""}`}>+</span>
                </div>

                {/* Roles List */}
                {isExpanded && (
                  <div className="border-t border-[#14120e]/10">
                    {groupedRoles.length === 0 ? (
                      <p className="p-6 text-sm font-serif text-[#14120e]/50 italic">No applications received yet.</p>
                    ) : (
                      groupedRoles.map((group, roleIdx) => {
                        const isRoleExpanded = expandedRoles.has(group.role);
                        const shortlisted = getShortlistedCount(group.role);

                        return (
                          <div key={group.role} className="border-b border-[#14120e]/10 last:border-b-0">
                            {/* Role Header */}
                            <div
                              className="flex justify-between items-center px-6 sm:px-8 py-4 cursor-pointer hover:bg-[#14120e]/5 transition-colors"
                              onClick={() => toggleRole(group.role)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="bg-[#14120e] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5 w-6 text-center">
                                  {String(roleIdx + 1).padStart(2, "0")}
                                </span>
                                <span className="font-sans font-bold uppercase text-sm tracking-wider">{group.role}</span>
                                <span className="font-sans text-xs text-[#14120e]/50">({group.applicants.length})</span>
                                {shortlisted > 0 && (
                                  <span className="bg-[#14120e]/10 text-[#14120e] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5">
                                    {shortlisted} shortlisted
                                  </span>
                                )}
                              </div>
                              <span className="text-lg">{isRoleExpanded ? "▾" : "▸"}</span>
                            </div>

                            {/* Applicants */}
                            {isRoleExpanded && (
                              <div className="px-6 sm:px-8 pb-6 space-y-4">
                                {/* Email Action Bar */}
                                <div className="flex items-center justify-between py-3 border-b border-[#14120e]/10">
                                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#14120e]/40 font-bold">
                                    {group.applicants.length} {group.applicants.length === 1 ? "CANDIDATE" : "CANDIDATES"}
                                  </span>
                                  <button
                                    onClick={() => handleSendEmail(group.role)}
                                    className="bg-[#c83a1a] text-[#e5e0d3] px-4 py-2 text-[10px] font-sans uppercase font-bold tracking-widest hover:bg-[#a62b10] transition-colors flex items-center gap-2"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect width="20" height="16" x="2" y="4" rx="2" />
                                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    Email Shortlisted
                                  </button>
                                </div>
                                {emailAlert && emailAlert.role === group.role && (
                                  <div className="p-3 border border-[#c83a1a]/30 bg-[#c83a1a]/5 text-[#c83a1a] font-sans text-[10px] uppercase tracking-widest font-bold">
                                    ⚠ {emailAlert.message}
                                  </div>
                                )}

                                {group.applicants.map((app, appIdx) => (
                                  <div
                                    key={app.id}
                                    className={`border p-4 sm:p-5 transition-colors ${
                                      app.status === "SHORTLISTED"
                                        ? "border-[#14120e]/30 bg-[#14120e]/5"
                                        : app.status === "REJECTED"
                                        ? "border-[#c83a1a]/20 bg-[#c83a1a]/5"
                                        : "border-[#14120e]/15 bg-[#eae5d9]"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5">
                                            #{String(appIdx + 1).padStart(2, "0")}
                                          </span>
                                          <h3 className="font-display text-xl uppercase tracking-tight">{app.name}</h3>
                                        </div>
                                        <a href={`mailto:${app.collegeEmail}`} className="text-sm text-[#c83a1a] hover:underline underline-offset-2 block font-sans">
                                          {app.collegeEmail}
                                        </a>
                                        <span className="text-[10px] text-[#14120e]/50 font-sans uppercase tracking-widest block mt-1">
                                          {app.rollNumber} · Year {app.yearOfStudy} · {app.phoneNumber}
                                        </span>
                                        <span className="text-[10px] text-[#14120e]/40 font-sans uppercase tracking-widest block mt-0.5">
                                          Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                      </div>
                                      <select
                                        value={app.status}
                                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                        className={`text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 border cursor-pointer outline-none ${
                                          app.status === "SHORTLISTED"
                                            ? "bg-[#14120e] text-[#e5e0d3] border-[#14120e]"
                                            : app.status === "REJECTED"
                                            ? "bg-[#c83a1a] text-[#e5e0d3] border-[#c83a1a]"
                                            : "bg-[#e5e0d3] text-[#14120e] border-[#14120e]/30"
                                        }`}
                                      >
                                        <option value="PENDING">Pending</option>
                                        <option value="SHORTLISTED">Shortlisted</option>
                                        <option value="REJECTED">Rejected</option>
                                      </select>
                                    </div>

                                    {app.portfolioLink && (
                                      <a
                                        href={app.portfolioLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-[#c83a1a] font-sans uppercase tracking-widest font-bold mt-3 hover:underline underline-offset-2"
                                      >
                                        Portfolio / CV ↗
                                      </a>
                                    )}
                                    {app.whyJoin && (
                                      <div className="mt-3 bg-[#e5e0d3] p-3 text-sm font-serif italic text-[#14120e]/80 border-l-2 border-[#c83a1a]">
                                        &ldquo;{app.whyJoin}&rdquo;
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
