"use client";

import { useState, useEffect } from "react";
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
  whyRCCTalkies?: string;
  whyJoin?: string;
  status: string;
  createdAt: string;
}

export default function RecruitmentDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  async function fetchApplications(pwd: string) {
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
      } else {
        window.location.href = "/admin";
      }
    } catch {
      window.location.href = "/admin";
    } finally {
      setIsLoading(false);
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

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }
    setUpdateError("");
    setUpdateSuccess("");
    try {
      const res = await fetch(`/api/applications/${id}?password=${encodeURIComponent(password)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setApplications(apps => apps.filter(app => app.id !== id));
        setUpdateSuccess("Application deleted successfully");
        setTimeout(() => setUpdateSuccess(""), 2000);
      } else {
        const data = await res.json();
        setUpdateError(data.error || "Failed to delete application");
      }
    } catch {
      setUpdateError("Failed to delete application");
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

    // Open Gmail compose in a new tab — works reliably in any browser
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${bcc}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  const handleCopyEmails = (role: string) => {
    const shortlistedEmails = applications
      .filter(app => app.positionAppliedFor === role && app.status === "SHORTLISTED")
      .map(app => app.collegeEmail);

    if (shortlistedEmails.length === 0) {
      setEmailAlert({ role, message: "No shortlisted candidates to copy." });
      setTimeout(() => setEmailAlert(null), 4000);
      return;
    }

    navigator.clipboard.writeText(shortlistedEmails.join(", "));
    setEmailAlert({ role, message: `✓ ${shortlistedEmails.length} email(s) copied to clipboard!` });
    setTimeout(() => setEmailAlert(null), 3000);
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
      <div className="min-h-screen bg-[#14120e] flex items-center justify-center p-4">
        <div className="text-[#e5e0d3] font-sans text-sm uppercase tracking-widest animate-pulse">
          Authenticating...
        </div>
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
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleCopyEmails(group.role)}
                                      className="border border-[#14120e]/30 text-[#14120e] px-3 py-2 text-[10px] font-sans uppercase font-bold tracking-widest hover:bg-[#14120e]/5 transition-colors flex items-center gap-1.5"
                                    >
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                      </svg>
                                      Copy Emails
                                    </button>
                                    <button
                                      onClick={() => handleSendEmail(group.role)}
                                      className="bg-[#c83a1a] text-[#e5e0d3] px-4 py-2 text-[10px] font-sans uppercase font-bold tracking-widest hover:bg-[#a62b10] transition-colors flex items-center gap-2"
                                    >
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                      </svg>
                                      Gmail Compose
                                    </button>
                                  </div>
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
                                      <div className="flex flex-col items-end gap-2 shrink-0">
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
                                        <button
                                          onClick={() => handleDeleteApplication(app.id)}
                                          className="text-[9px] text-[#c83a1a] font-sans uppercase tracking-widest font-bold hover:underline"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>

                                    {app.whyRCCTalkies && (
                                      <div className="mt-3 bg-[#e5e0d3] p-3 text-sm font-serif italic text-[#14120e]/80 border-l-2 border-[#c83a1a]">
                                        &ldquo;{app.whyRCCTalkies}&rdquo;
                                      </div>
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

        {/* Quick Info Bar */}
        <div className="mt-10 border-t border-[#14120e]/20 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans uppercase tracking-widest text-[#14120e]/40">
          <div className="flex items-center gap-2">
            <span className="text-[#c83a1a]">✦</span>
            <span>Authenticated as Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/admin"
              className="hover:text-[#c83a1a] transition-colors font-bold"
            >
              ← Admin Dashboard
            </Link>
            <Link
              href="/"
              className="hover:text-[#c83a1a] transition-colors font-bold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
