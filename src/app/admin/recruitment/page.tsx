"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import {
  exportCSV,
  exportXLSX,
  ALL_EXPORT_COLUMNS,
  type ExportColumn,
} from "@/lib/exportUtils";
import type { ExportableApplication } from "@/lib/exportUtils";

/* ═══════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════ */

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

type SortField = "name" | "createdAt" | "status" | "yearOfStudy";
type SortDirection = "asc" | "desc";

const STATUS_ORDER: Record<string, number> = { PENDING: 0, SHORTLISTED: 1, REJECTED: 2 };

/* ═══════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════ */

export default function RecruitmentDashboard() {
  /* ─── Auth ─── */
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ─── Core data ─── */
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  /* ─── Accordion ─── */
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  /* ─── Search & Filters ─── */
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterTypes, setFilterTypes] = useState<Set<string>>(new Set());
  const [filterStatuses, setFilterStatuses] = useState<Set<string>>(new Set());
  const [filterRoles, setFilterRoles] = useState<Set<string>>(new Set());
  const [filterYears, setFilterYears] = useState<Set<string>>(new Set());
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  /* ─── Sort ─── */
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  /* ─── Bulk selection ─── */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  /* ─── Export ─── */
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportColumns, setExportColumns] = useState<ExportColumn[]>(
    () => ALL_EXPORT_COLUMNS.map((c) => ({ ...c }))
  );

  /* ─── Enhanced cards ─── */
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  /* ─── Email ─── */
  const [emailAlert, setEmailAlert] = useState<{ role: string; message: string } | null>(null);

  /* ─── Refs ─── */
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ═══════════════════════════════════════════════════════════════════
     Auth & Fetch
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      setPassword(savedPassword);
      fetchApplications(savedPassword);
    } else {
      window.location.href = "/admin";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }

  /* ═══════════════════════════════════════════════════════════════════
     Debounced search
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ═══════════════════════════════════════════════════════════════════
     Filtered + Sorted applications (useMemo)
     ═══════════════════════════════════════════════════════════════════ */

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Full-text search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.collegeEmail.toLowerCase().includes(q) ||
          app.rollNumber.toLowerCase().includes(q) ||
          app.phoneNumber.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filterTypes.size > 0) {
      result = result.filter((app) => filterTypes.has(app.type));
    }

    // Status filter
    if (filterStatuses.size > 0) {
      result = result.filter((app) => filterStatuses.has(app.status));
    }

    // Role filter
    if (filterRoles.size > 0) {
      result = result.filter((app) => filterRoles.has(app.positionAppliedFor));
    }

    // Year filter
    if (filterYears.size > 0) {
      result = result.filter((app) => filterYears.has(app.yearOfStudy));
    }

    // Date range
    if (filterDateFrom) {
      const from = new Date(filterDateFrom);
      result = result.filter((app) => new Date(app.createdAt) >= from);
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((app) => new Date(app.createdAt) <= to);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "status":
          cmp = (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3);
          break;
        case "yearOfStudy":
          cmp = a.yearOfStudy.localeCompare(b.yearOfStudy);
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [applications, debouncedSearch, filterTypes, filterStatuses, filterRoles, filterYears, filterDateFrom, filterDateTo, sortField, sortDirection]);

  /* ─── Derived data ─── */
  const allRoles = useMemo(
    () => Array.from(new Set(applications.map((a) => a.positionAppliedFor))).sort(),
    [applications]
  );
  const allYears = useMemo(
    () => Array.from(new Set(applications.map((a) => a.yearOfStudy))).sort(),
    [applications]
  );

  const hasActiveFilters =
    filterTypes.size > 0 ||
    filterStatuses.size > 0 ||
    filterRoles.size > 0 ||
    filterYears.size > 0 ||
    !!filterDateFrom ||
    !!filterDateTo ||
    !!debouncedSearch;

  /* ═══════════════════════════════════════════════════════════════════
     Analytics (useMemo)
     ═══════════════════════════════════════════════════════════════════ */

  const analytics = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "PENDING").length;
    const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;
    const rejected = applications.filter((a) => a.status === "REJECTED").length;
    const leads = applications.filter((a) => a.type === "LEAD").length;
    const team = applications.filter((a) => a.type === "TEAM").length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = applications.filter((a) => new Date(a.createdAt) >= sevenDaysAgo).length;
    return { total, pending, shortlisted, rejected, leads, team, recentCount };
  }, [applications]);

  /* ═══════════════════════════════════════════════════════════════════
     Grouping logic (uses filteredApplications)
     ═══════════════════════════════════════════════════════════════════ */

  const getGroupedRoles = useCallback(
    (type: string) => {
      const appsForType = filteredApplications.filter((app) => app.type === type);
      const roles = Array.from(new Set(appsForType.map((app) => app.positionAppliedFor)));
      return roles.map((role) => ({
        role,
        applicants: appsForType.filter((app) => app.positionAppliedFor === role),
      }));
    },
    [filteredApplications]
  );

  const getCountForType = useCallback(
    (type: string) => filteredApplications.filter((app) => app.type === type).length,
    [filteredApplications]
  );

  const getShortlistedCount = useCallback(
    (role: string) =>
      filteredApplications.filter(
        (app) => app.positionAppliedFor === role && app.status === "SHORTLISTED"
      ).length,
    [filteredApplications]
  );

  /* ═══════════════════════════════════════════════════════════════════
     Handlers — Individual
     ═══════════════════════════════════════════════════════════════════ */

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
        setApplications((apps) => apps.map((app) => (app.id === id ? { ...app, status: newStatus } : app)));
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
        setApplications((apps) => apps.filter((app) => app.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
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

  /* ═══════════════════════════════════════════════════════════════════
     Handlers — Email
     ═══════════════════════════════════════════════════════════════════ */

  const handleSendEmail = (role: string) => {
    const shortlistedEmails = applications
      .filter((app) => app.positionAppliedFor === role && app.status === "SHORTLISTED")
      .map((app) => app.collegeEmail);

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
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${bcc}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  const handleCopyEmails = (role: string) => {
    const shortlistedEmails = applications
      .filter((app) => app.positionAppliedFor === role && app.status === "SHORTLISTED")
      .map((app) => app.collegeEmail);

    if (shortlistedEmails.length === 0) {
      setEmailAlert({ role, message: "No shortlisted candidates to copy." });
      setTimeout(() => setEmailAlert(null), 4000);
      return;
    }

    navigator.clipboard.writeText(shortlistedEmails.join(", "));
    setEmailAlert({ role, message: `✓ ${shortlistedEmails.length} email(s) copied to clipboard!` });
    setTimeout(() => setEmailAlert(null), 3000);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Handlers — Filters
     ═══════════════════════════════════════════════════════════════════ */

  const toggleFilterSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setFilterTypes(new Set());
    setFilterStatuses(new Set());
    setFilterRoles(new Set());
    setFilterYears(new Set());
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  /* ═══════════════════════════════════════════════════════════════════
     Handlers — Bulk Actions
     ═══════════════════════════════════════════════════════════════════ */

  const toggleSelectAll = useCallback(() => {
    const visibleIds = filteredApplications.map((a) => a.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleIds));
    }
  }, [filteredApplications, selectedIds]);

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkStatusUpdate = useCallback(async (newStatus: string) => {
    if (selectedIds.size === 0) return;
    const idsToUpdate = new Set(selectedIds);
    setIsBulkUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");
    const results = await Promise.allSettled(
      Array.from(idsToUpdate).map((id) =>
        fetch(`/api/applications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, status: newStatus }),
        })
      )
    );
    const successCount = results.filter((r) => r.status === "fulfilled" && (r.value as Response).ok).length;
    if (successCount > 0) {
      setApplications((apps) =>
        apps.map((app) => (idsToUpdate.has(app.id) ? { ...app, status: newStatus } : app))
      );
      setUpdateSuccess(`${successCount} application(s) updated to ${newStatus}`);
      setTimeout(() => setUpdateSuccess(""), 3000);
    }
    const failCount = idsToUpdate.size - successCount;
    if (failCount > 0) {
      setUpdateError(`${failCount} application(s) failed to update`);
    }
    setSelectedIds(new Set());
    setIsBulkUpdating(false);
  }, [selectedIds, password]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.size} application(s)? This action cannot be undone.`
      )
    )
      return;

    const idsToDelete = new Set(selectedIds);
    setIsBulkUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");
    const results = await Promise.allSettled(
      Array.from(idsToDelete).map((id) =>
        fetch(`/api/applications/${id}?password=${encodeURIComponent(password)}`, {
          method: "DELETE",
        })
      )
    );
    const successCount = results.filter((r) => r.status === "fulfilled" && (r.value as Response).ok).length;
    if (successCount > 0) {
      setApplications((apps) => apps.filter((app) => !idsToDelete.has(app.id)));
      setUpdateSuccess(`${successCount} application(s) deleted`);
      setTimeout(() => setUpdateSuccess(""), 3000);
    }
    const failCount = idsToDelete.size - successCount;
    if (failCount > 0) {
      setUpdateError(`${failCount} application(s) failed to delete`);
    }
    setSelectedIds(new Set());
    setIsBulkUpdating(false);
  }, [selectedIds, password]);

  const handleCopySelectedEmails = () => {
    const emails = filteredApplications
      .filter((a) => selectedIds.has(a.id))
      .map((a) => a.collegeEmail);
    if (emails.length === 0) return;
    navigator.clipboard.writeText(emails.join(", "));
    setUpdateSuccess(`${emails.length} email(s) copied to clipboard`);
    setTimeout(() => setUpdateSuccess(""), 2000);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Handlers — Export
     ═══════════════════════════════════════════════════════════════════ */

  const getExportData = useCallback((scope: "all" | "filtered" | "selected"): Application[] => {
    switch (scope) {
      case "all":
        return applications;
      case "selected":
        return filteredApplications.filter((a) => selectedIds.has(a.id));
      case "filtered":
      default:
        return filteredApplications;
    }
  }, [applications, filteredApplications, selectedIds]);

  const handleExportCSV = useCallback((scope: "all" | "filtered" | "selected") => {
    const data = getExportData(scope);
    exportCSV(data as ExportableApplication[], exportColumns);
    setShowExportModal(false);
  }, [getExportData, exportColumns]);

  const handleExportXLSX = useCallback(async (scope: "all" | "filtered" | "selected") => {
    const data = getExportData(scope);
    await exportXLSX(data as ExportableApplication[], exportColumns);
    setShowExportModal(false);
  }, [getExportData, exportColumns]);

  /* ═══════════════════════════════════════════════════════════════════
     Handlers — Enhanced cards
     ═══════════════════════════════════════════════════════════════════ */

  const toggleExpandResponse = (appId: string) => {
    setExpandedResponses((prev) => {
      const next = new Set(prev);
      next.has(appId) ? next.delete(appId) : next.add(appId);
      return next;
    });
  };

  const handleCopyField = (value: string, fieldId: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Accordion toggles
     ═══════════════════════════════════════════════════════════════════ */

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const toggleRole = (role: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      next.has(role) ? next.delete(role) : next.add(role);
      return next;
    });
  };

  /* ═══════════════════════════════════════════════════════════════════
     Keyboard Shortcuts
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (!isAuthenticated) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA";

      // "/" or Ctrl+K → focus search
      if ((e.key === "/" && !isInput) || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Escape → clear search / close modals
      if (e.key === "Escape") {
        if (showExportModal) {
          setShowExportModal(false);
          return;
        }
        if (searchQuery) {
          setSearchQuery("");
          searchInputRef.current?.blur();
          return;
        }
      }

      // Ctrl+A → select all visible
      if (e.key === "a" && (e.ctrlKey || e.metaKey) && !isInput) {
        e.preventDefault();
        toggleSelectAll();
        return;
      }

      // Ctrl+Shift+E → export CSV
      if (e.key === "E" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        handleExportCSV("filtered");
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAuthenticated, showExportModal, searchQuery, toggleSelectAll, handleExportCSV]);

  /* ═══════════════════════════════════════════════════════════════════
     Login Gate
     ═══════════════════════════════════════════════════════════════════ */

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#14120e] flex items-center justify-center p-4">
        <div className="text-[#e5e0d3] font-sans text-sm uppercase tracking-widest animate-pulse">
          Authenticating...
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     Render Helpers
     ═══════════════════════════════════════════════════════════════════ */

  const visibleAllSelected =
    filteredApplications.length > 0 && filteredApplications.every((a) => selectedIds.has(a.id));

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[#e5e0d3] text-[#14120e]">
      {/* ───────────── Header Banner ───────────── */}
      <div className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-6xl mx-auto">
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
              {applications.length} total applications · {applications.filter((a) => a.status === "SHORTLISTED").length} shortlisted
            </p>
            <Link href="/admin" className="text-xs font-sans uppercase tracking-widest text-[#e5e0d3]/40 hover:text-[#c83a1a] transition-colors">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* ───────────── Component 5: Analytics Summary ───────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {/* Total */}
          <div className="border border-[#14120e]/20 bg-[#eae5d9] p-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/40 font-bold block mb-1">Total</span>
            <span className="font-display text-3xl sm:text-4xl text-[#14120e]">{analytics.total}</span>
          </div>
          {/* Pending */}
          <div className="border border-[#14120e]/20 bg-[#eae5d9] p-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/40 font-bold block mb-1">Pending</span>
            <span className="font-display text-3xl sm:text-4xl text-[#14120e]">{analytics.pending}</span>
            <div className="mt-2 h-1.5 bg-[#14120e]/10 overflow-hidden">
              <div className="h-full bg-[#14120e]/40 transition-all duration-700" style={{ width: analytics.total ? `${(analytics.pending / analytics.total) * 100}%` : "0%" }} />
            </div>
          </div>
          {/* Shortlisted */}
          <div className="border border-[#14120e]/20 bg-[#eae5d9] p-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/40 font-bold block mb-1">Shortlisted</span>
            <span className="font-display text-3xl sm:text-4xl text-[#14120e]">{analytics.shortlisted}</span>
            <div className="mt-2 h-1.5 bg-[#14120e]/10 overflow-hidden">
              <div className="h-full bg-[#14120e] transition-all duration-700" style={{ width: analytics.total ? `${(analytics.shortlisted / analytics.total) * 100}%` : "0%" }} />
            </div>
          </div>
          {/* Rejected */}
          <div className="border border-[#14120e]/20 bg-[#eae5d9] p-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#c83a1a]/70 font-bold block mb-1">Rejected</span>
            <span className="font-display text-3xl sm:text-4xl text-[#c83a1a]">{analytics.rejected}</span>
            <div className="mt-2 h-1.5 bg-[#c83a1a]/10 overflow-hidden">
              <div className="h-full bg-[#c83a1a] transition-all duration-700" style={{ width: analytics.total ? `${(analytics.rejected / analytics.total) * 100}%` : "0%" }} />
            </div>
          </div>
          {/* Recent */}
          <div className="border border-[#14120e]/20 bg-[#eae5d9] p-4 col-span-2 sm:col-span-4 lg:col-span-1">
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/40 font-bold block mb-1">Last 7 Days</span>
            <span className="font-display text-3xl sm:text-4xl text-[#14120e]">{analytics.recentCount}</span>
            <div className="mt-2 flex items-center gap-3 text-[10px] font-sans uppercase tracking-wider text-[#14120e]/40">
              <span>Leads: {analytics.leads}</span>
              <span className="text-[#14120e]/20">|</span>
              <span>Team: {analytics.team}</span>
            </div>
          </div>
        </section>

        {/* ───────────── Component 1 & 2: Search, Filter & Sort Toolbar ───────────── */}
        <div className="border border-[#14120e]/20 bg-[#eae5d9] mb-6">
          {/* Top row: Search + Sort + Export */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-5">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#14120e]/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search name, email, roll no, phone…   ( / )"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#e5e0d3] border border-[#14120e]/15 text-[#14120e] pl-9 pr-8 py-2.5 font-sans text-sm tracking-wider outline-none focus:border-[#c83a1a]/50 transition-colors placeholder:text-[#14120e]/25"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#14120e]/40 hover:text-[#c83a1a] transition-colors text-lg font-bold leading-none">
                  ×
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="bg-[#e5e0d3] border border-[#14120e]/15 text-[#14120e] px-3 py-2.5 font-sans text-[11px] uppercase tracking-widest font-bold outline-none cursor-pointer"
              >
                <option value="createdAt">Date Applied</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
                <option value="yearOfStudy">Year</option>
              </select>
              <button
                onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
                className="border border-[#14120e]/15 bg-[#e5e0d3] px-2.5 py-2.5 font-sans text-sm text-[#14120e] hover:bg-[#14120e]/5 transition-colors"
                title={sortDirection === "asc" ? "Ascending" : "Descending"}
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`border px-4 py-2.5 font-sans text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-2 ${
                showFilterPanel || hasActiveFilters
                  ? "border-[#c83a1a] text-[#c83a1a] bg-[#c83a1a]/5"
                  : "border-[#14120e]/15 text-[#14120e] hover:bg-[#14120e]/5"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters{hasActiveFilters ? ` ●` : ""}
            </button>

            {/* Export */}
            <button
              onClick={() => setShowExportModal(true)}
              className="border border-[#14120e]/15 text-[#14120e] px-4 py-2.5 font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-[#14120e]/5 transition-colors flex items-center gap-2"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
          </div>

          {/* Filter Panel (collapsible) */}
          {showFilterPanel && (
            <div className="border-t border-[#14120e]/10 p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Type */}
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-2">Type</label>
                  <div className="flex gap-2">
                    {["LEAD", "TEAM"].map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleFilterSet(setFilterTypes, t)}
                        className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold border transition-colors ${
                          filterTypes.has(t)
                            ? "bg-[#14120e] text-[#e5e0d3] border-[#14120e]"
                            : "bg-[#e5e0d3] text-[#14120e] border-[#14120e]/20 hover:border-[#14120e]/40"
                        }`}
                      >
                        {t === "LEAD" ? "Team Lead" : "Team Member"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {["PENDING", "SHORTLISTED", "REJECTED"].map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleFilterSet(setFilterStatuses, s)}
                        className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold border transition-colors ${
                          filterStatuses.has(s)
                            ? s === "REJECTED"
                              ? "bg-[#c83a1a] text-[#e5e0d3] border-[#c83a1a]"
                              : "bg-[#14120e] text-[#e5e0d3] border-[#14120e]"
                            : "bg-[#e5e0d3] text-[#14120e] border-[#14120e]/20 hover:border-[#14120e]/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-2">Year of Study</label>
                  <div className="flex flex-wrap gap-2">
                    {allYears.map((y) => (
                      <button
                        key={y}
                        onClick={() => toggleFilterSet(setFilterYears, y)}
                        className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold border transition-colors ${
                          filterYears.has(y)
                            ? "bg-[#14120e] text-[#e5e0d3] border-[#14120e]"
                            : "bg-[#e5e0d3] text-[#14120e] border-[#14120e]/20 hover:border-[#14120e]/40"
                        }`}
                      >
                        Year {y}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role / Desk */}
                <div className="sm:col-span-2">
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-2">Role / Desk</label>
                  <div className="flex flex-wrap gap-2">
                    {allRoles.map((r) => (
                      <button
                        key={r}
                        onClick={() => toggleFilterSet(setFilterRoles, r)}
                        className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold border transition-colors ${
                          filterRoles.has(r)
                            ? "bg-[#14120e] text-[#e5e0d3] border-[#14120e]"
                            : "bg-[#e5e0d3] text-[#14120e] border-[#14120e]/20 hover:border-[#14120e]/40"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-2">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="bg-[#e5e0d3] border border-[#14120e]/15 text-[#14120e] px-2 py-1.5 font-sans text-xs outline-none flex-1"
                    />
                    <span className="text-[#14120e]/30 text-xs">→</span>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="bg-[#e5e0d3] border border-[#14120e]/15 text-[#14120e] px-2 py-1.5 font-sans text-xs outline-none flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active filter tags + result count */}
          {hasActiveFilters && (
            <div className="border-t border-[#14120e]/10 px-4 sm:px-5 py-3 flex flex-wrap items-center gap-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#14120e]/40 font-bold mr-1">
                Showing {filteredApplications.length} of {applications.length}
              </span>

              {debouncedSearch && (
                <span className="inline-flex items-center gap-1.5 bg-[#14120e]/10 text-[#14120e] px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-bold">
                  &ldquo;{debouncedSearch}&rdquo;
                  <button onClick={() => setSearchQuery("")} className="hover:text-[#c83a1a]">×</button>
                </span>
              )}
              {Array.from(filterTypes).map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 bg-[#14120e] text-[#e5e0d3] px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-bold">
                  {t}
                  <button onClick={() => toggleFilterSet(setFilterTypes, t)} className="hover:text-[#c83a1a]">×</button>
                </span>
              ))}
              {Array.from(filterStatuses).map((s) => (
                <span key={s} className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-bold ${s === "REJECTED" ? "bg-[#c83a1a] text-[#e5e0d3]" : "bg-[#14120e] text-[#e5e0d3]"}`}>
                  {s}
                  <button onClick={() => toggleFilterSet(setFilterStatuses, s)} className="hover:text-[#c83a1a]">×</button>
                </span>
              ))}
              {Array.from(filterRoles).map((r) => (
                <span key={r} className="inline-flex items-center gap-1.5 bg-[#14120e]/10 text-[#14120e] px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-bold">
                  {r}
                  <button onClick={() => toggleFilterSet(setFilterRoles, r)} className="hover:text-[#c83a1a]">×</button>
                </span>
              ))}
              {Array.from(filterYears).map((y) => (
                <span key={y} className="inline-flex items-center gap-1.5 bg-[#14120e]/10 text-[#14120e] px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-bold">
                  Year {y}
                  <button onClick={() => toggleFilterSet(setFilterYears, y)} className="hover:text-[#c83a1a]">×</button>
                </span>
              ))}
              {(filterDateFrom || filterDateTo) && (
                <span className="inline-flex items-center gap-1.5 bg-[#14120e]/10 text-[#14120e] px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-bold">
                  {filterDateFrom || "…"} → {filterDateTo || "…"}
                  <button onClick={() => { setFilterDateFrom(""); setFilterDateTo(""); }} className="hover:text-[#c83a1a]">×</button>
                </span>
              )}

              <button onClick={clearAllFilters} className="ml-auto text-[10px] font-sans uppercase tracking-widest font-bold text-[#c83a1a] hover:underline">
                Clear All
              </button>
            </div>
          )}

          {/* Select All + count (always visible in toolbar) */}
          <div className="border-t border-[#14120e]/10 px-4 sm:px-5 py-2.5 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={visibleAllSelected && filteredApplications.length > 0}
                onChange={toggleSelectAll}
                className="accent-[#c83a1a] w-3.5 h-3.5"
              />
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#14120e]/50 font-bold">
                Select All ({filteredApplications.length})
              </span>
            </label>
            {selectedIds.size > 0 && (
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#c83a1a] font-bold">
                {selectedIds.size} selected
              </span>
            )}
          </div>
        </div>

        {/* ───────────── Status Messages ───────────── */}
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

        {/* ───────────── Application List (grouped) ───────────── */}
        {isLoading ? (
          <div className="text-center py-20">
            <span className="font-sans text-sm uppercase tracking-widest text-[#14120e]/50 animate-pulse">Loading applications…</span>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="border border-[#14120e]/20 bg-[#eae5d9] p-12 text-center">
            <p className="font-display text-2xl uppercase tracking-tight text-[#14120e]/40 mb-2">No Applications Found</p>
            <p className="font-serif text-sm text-[#14120e]/40 italic">
              {hasActiveFilters ? "Try adjusting your filters or search query." : "No applications received yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {["LEAD", "TEAM"].map((type) => {
              const count = getCountForType(type);
              if (count === 0 && hasActiveFilters) return null; // Hide empty types when filtering
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
                        <p className="p-6 text-sm font-serif text-[#14120e]/50 italic">No applications match current filters.</p>
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

                                  {/* ───── Applicant Cards (Component 6: Enhanced) ───── */}
                                  {group.applicants.map((app, appIdx) => {
                                    const isSelected = selectedIds.has(app.id);
                                    const isResponseExpanded = expandedResponses.has(app.id);
                                    const hasLongResponse =
                                      (app.whyRCCTalkies && app.whyRCCTalkies.length > 120) ||
                                      (app.whyJoin && app.whyJoin.length > 120);

                                    return (
                                      <div
                                        key={app.id}
                                        className={`border transition-all relative ${
                                          isSelected ? "ring-2 ring-[#c83a1a] " : ""
                                        }${
                                          app.status === "SHORTLISTED"
                                            ? "border-[#14120e]/30 bg-[#14120e]/5"
                                            : app.status === "REJECTED"
                                            ? "border-[#c83a1a]/20 bg-[#c83a1a]/5"
                                            : "border-[#14120e]/15 bg-[#eae5d9]"
                                        }`}
                                      >
                                        {/* Status band at top */}
                                        <div
                                          className={`h-1 w-full ${
                                            app.status === "SHORTLISTED"
                                              ? "bg-[#14120e]"
                                              : app.status === "REJECTED"
                                              ? "bg-[#c83a1a]"
                                              : "bg-[#14120e]/15"
                                          }`}
                                        />

                                        <div className="p-4 sm:p-5">
                                          <div className="flex justify-between items-start gap-4">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                              {/* Checkbox */}
                                              <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelectOne(app.id)}
                                                className="accent-[#c83a1a] w-3.5 h-3.5 mt-1 shrink-0"
                                              />

                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5">
                                                    #{String(appIdx + 1).padStart(2, "0")}
                                                  </span>
                                                  <h3 className="font-display text-xl uppercase tracking-tight">{app.name}</h3>
                                                </div>

                                                {/* Email + copy */}
                                                <div className="flex items-center gap-1.5 group/email">
                                                  <a href={`mailto:${app.collegeEmail}`} className="text-sm text-[#c83a1a] hover:underline underline-offset-2 font-sans">
                                                    {app.collegeEmail}
                                                  </a>
                                                  <button
                                                    onClick={() => handleCopyField(app.collegeEmail, `email-${app.id}`)}
                                                    className="opacity-0 group-hover/email:opacity-100 transition-opacity text-[#14120e]/30 hover:text-[#c83a1a]"
                                                    title="Copy email"
                                                  >
                                                    {copiedField === `email-${app.id}` ? (
                                                      <span className="text-[9px] font-sans uppercase tracking-widest font-bold text-[#c83a1a]">✓</span>
                                                    ) : (
                                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                                    )}
                                                  </button>
                                                </div>

                                                {/* Info row with copy buttons */}
                                                <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                  <span className="text-[10px] text-[#14120e]/50 font-sans uppercase tracking-widest group/roll inline-flex items-center gap-1">
                                                    {app.rollNumber}
                                                    <button
                                                      onClick={() => handleCopyField(app.rollNumber, `roll-${app.id}`)}
                                                      className="opacity-0 group-hover/roll:opacity-100 transition-opacity text-[#14120e]/30 hover:text-[#c83a1a]"
                                                      title="Copy roll number"
                                                    >
                                                      {copiedField === `roll-${app.id}` ? <span className="text-[8px] text-[#c83a1a]">✓</span> : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>}
                                                    </button>
                                                  </span>
                                                  <span className="text-[10px] text-[#14120e]/25">·</span>
                                                  <span className="text-[10px] text-[#14120e]/50 font-sans uppercase tracking-widest">Year {app.yearOfStudy}</span>
                                                  <span className="text-[10px] text-[#14120e]/25">·</span>
                                                  <span className="text-[10px] text-[#14120e]/50 font-sans uppercase tracking-widest group/phone inline-flex items-center gap-1">
                                                    {app.phoneNumber}
                                                    <button
                                                      onClick={() => handleCopyField(app.phoneNumber, `phone-${app.id}`)}
                                                      className="opacity-0 group-hover/phone:opacity-100 transition-opacity text-[#14120e]/30 hover:text-[#c83a1a]"
                                                      title="Copy phone"
                                                    >
                                                      {copiedField === `phone-${app.id}` ? <span className="text-[8px] text-[#c83a1a]">✓</span> : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>}
                                                    </button>
                                                  </span>
                                                </div>

                                                {/* Timestamp with tooltip */}
                                                <span
                                                  className="text-[10px] text-[#14120e]/40 font-sans uppercase tracking-widest block mt-0.5 cursor-help"
                                                  title={new Date(app.createdAt).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "medium" })}
                                                >
                                                  Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Status + actions */}
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

                                          {/* Responses with expand/collapse */}
                                          {(app.whyRCCTalkies || app.whyJoin) && (
                                            <div className="mt-3 space-y-2">
                                              {app.whyRCCTalkies && (
                                                <div className="bg-[#e5e0d3] p-3 text-sm font-serif italic text-[#14120e]/80 border-l-2 border-[#c83a1a]">
                                                  <span className="not-italic font-sans text-[9px] uppercase tracking-widest text-[#14120e]/40 font-bold block mb-1">Why RCC Talkies?</span>
                                                  <span className={!isResponseExpanded && hasLongResponse ? "line-clamp-2" : ""}>
                                                    &ldquo;{app.whyRCCTalkies}&rdquo;
                                                  </span>
                                                </div>
                                              )}
                                              {app.whyJoin && (
                                                <div className="bg-[#e5e0d3] p-3 text-sm font-serif italic text-[#14120e]/80 border-l-2 border-[#c83a1a]">
                                                  <span className="not-italic font-sans text-[9px] uppercase tracking-widest text-[#14120e]/40 font-bold block mb-1">Why Join?</span>
                                                  <span className={!isResponseExpanded && hasLongResponse ? "line-clamp-2" : ""}>
                                                    &ldquo;{app.whyJoin}&rdquo;
                                                  </span>
                                                </div>
                                              )}
                                              {hasLongResponse && (
                                                <button
                                                  onClick={() => toggleExpandResponse(app.id)}
                                                  className="text-[10px] font-sans uppercase tracking-widest font-bold text-[#c83a1a] hover:underline"
                                                >
                                                  {isResponseExpanded ? "Show Less ▲" : "Read More ▼"}
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
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
        )}

        {/* ───────────── Quick Info Bar ───────────── */}
        <div className="mt-10 border-t border-[#14120e]/20 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans uppercase tracking-widest text-[#14120e]/40">
          <div className="flex items-center gap-2">
            <span className="text-[#c83a1a]">✦</span>
            <span>Authenticated as Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-[#14120e]/20">
              / search · Ctrl+A select · Ctrl+Shift+E export
            </span>
            <Link href="/admin" className="hover:text-[#c83a1a] transition-colors font-bold">
              ← Admin Dashboard
            </Link>
            <Link href="/" className="hover:text-[#c83a1a] transition-colors font-bold">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* ───────────── Component 4: Floating Bulk Action Bar ───────────── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#14120e] text-[#e5e0d3] border-t-2 border-[#c83a1a] shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold text-[#e5e0d3]/70">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-[10px] font-sans uppercase tracking-widest text-[#e5e0d3]/40 hover:text-[#e5e0d3] transition-colors"
              >
                Deselect
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkStatusUpdate("SHORTLISTED")}
                disabled={isBulkUpdating}
                className="border border-[#e5e0d3]/20 text-[#e5e0d3] px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#e5e0d3]/10 transition-colors disabled:opacity-40"
              >
                ✓ Shortlist
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("REJECTED")}
                disabled={isBulkUpdating}
                className="border border-[#c83a1a]/50 text-[#c83a1a] px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#c83a1a]/10 transition-colors disabled:opacity-40"
              >
                ✗ Reject
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("PENDING")}
                disabled={isBulkUpdating}
                className="border border-[#e5e0d3]/20 text-[#e5e0d3]/60 px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#e5e0d3]/10 transition-colors disabled:opacity-40"
              >
                ↺ Reset
              </button>
              <span className="w-px h-5 bg-[#e5e0d3]/10" />
              <button
                onClick={handleCopySelectedEmails}
                className="border border-[#e5e0d3]/20 text-[#e5e0d3] px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#e5e0d3]/10 transition-colors"
              >
                Copy Emails
              </button>
              <button
                onClick={() => handleExportCSV("selected")}
                className="border border-[#e5e0d3]/20 text-[#e5e0d3] px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#e5e0d3]/10 transition-colors"
              >
                Export CSV
              </button>
              <span className="w-px h-5 bg-[#e5e0d3]/10" />
              <button
                onClick={handleBulkDelete}
                disabled={isBulkUpdating}
                className="bg-[#c83a1a] text-[#e5e0d3] px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#a62b10] transition-colors disabled:opacity-40"
              >
                Delete ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────── Component 3: Export Modal ───────────── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14120e]/60 backdrop-blur-sm p-4">
          <div className="bg-[#eae5d9] border border-[#14120e]/20 shadow-[8px_8px_0px_#14120e] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-[#14120e]/10">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-tight">Export Data</h2>
                <p className="font-serif text-sm text-[#14120e]/50 italic mt-1">Select columns and format</p>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-2xl text-[#14120e]/40 hover:text-[#c83a1a] transition-colors leading-none">×</button>
            </div>

            {/* Column Selection */}
            <div className="p-5 space-y-3">
              <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block">Columns</label>
              <div className="grid grid-cols-2 gap-2">
                {exportColumns.map((col, idx) => (
                  <label key={col.key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={col.enabled}
                      onChange={() => {
                        setExportColumns((prev) => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], enabled: !next[idx].enabled };
                          return next;
                        });
                      }}
                      className="accent-[#c83a1a] w-3.5 h-3.5"
                    />
                    <span className="font-sans text-xs text-[#14120e]">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Actions */}
            <div className="p-5 border-t border-[#14120e]/10 space-y-4">
              {/* Current View */}
              <div>
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-2">
                  Export Current View ({filteredApplications.length} applications)
                </label>
                <div className="flex gap-2">
                  <button onClick={() => handleExportCSV("filtered")} className="flex-1 border border-[#14120e]/20 text-[#14120e] px-4 py-2.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#14120e]/5 transition-colors">
                    CSV
                  </button>
                  <button onClick={() => handleExportXLSX("filtered")} className="flex-1 bg-[#14120e] text-[#e5e0d3] px-4 py-2.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#14120e]/90 transition-colors">
                    Excel (XLSX)
                  </button>
                </div>
              </div>

              {/* All */}
              {hasActiveFilters && (
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-2">
                    Export All ({applications.length} applications)
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => handleExportCSV("all")} className="flex-1 border border-[#14120e]/20 text-[#14120e] px-4 py-2.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#14120e]/5 transition-colors">
                      CSV
                    </button>
                    <button onClick={() => handleExportXLSX("all")} className="flex-1 border border-[#14120e]/20 text-[#14120e] px-4 py-2.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#14120e]/5 transition-colors">
                      Excel (XLSX)
                    </button>
                  </div>
                </div>
              )}

              {/* Selected */}
              {selectedIds.size > 0 && (
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#c83a1a]/70 font-bold block mb-2">
                    Export Selected ({selectedIds.size} applications)
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => handleExportCSV("selected")} className="flex-1 border border-[#c83a1a]/30 text-[#c83a1a] px-4 py-2.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#c83a1a]/5 transition-colors">
                      CSV
                    </button>
                    <button onClick={() => handleExportXLSX("selected")} className="flex-1 bg-[#c83a1a] text-[#e5e0d3] px-4 py-2.5 text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#a62b10] transition-colors">
                      Excel (XLSX)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
