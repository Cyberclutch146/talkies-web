"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DecryptedText from "@/components/DecryptedText";
import { AchievementItem, achievementCategories } from "@/lib/validations/achievement";
import {
  fetchAdminAchievements,
  updateAchievementStatus,
  deleteAchievement,
} from "./actions";

export default function AdminAchievementsPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Lightbox Modal for Photo Inspection
  const [previewItem, setPreviewItem] = useState<AchievementItem | null>(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Action status loading tracker (by id)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function loadData(pwd: string) {
    setIsLoading(true);
    setErrorMessage("");
    const res = await fetchAdminAchievements(pwd);
    if (res.success && res.achievements) {
      setAchievements(res.achievements);
      setIsAuthenticated(true);
    } else {
      setErrorMessage(res.error || "Failed to load achievements");
      if (res.error === "Invalid credentials") {
        sessionStorage.removeItem("adminPassword");
        window.location.href = "/admin";
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      setPassword(savedPassword);
      loadData(savedPassword);
    } else {
      window.location.href = "/admin";
    }
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    const res = await updateAchievementStatus(password, id, newStatus);
    if (res.success) {
      setAchievements((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (previewItem && previewItem.id === id) {
        setPreviewItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      alert("Failed to update status: " + res.error);
    }
    setActionLoadingId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteAchievement(password, deleteId);
    if (res.success) {
      setAchievements((prev) => prev.filter((item) => item.id !== deleteId));
      if (previewItem && previewItem.id === deleteId) {
        setPreviewItem(null);
      }
      setDeleteId(null);
    } else {
      alert("Failed to delete achievement: " + res.error);
    }
    setIsDeleting(false);
  };

  // Filtered List
  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.fullName.toLowerCase().includes(q) ||
        item.rollNumber.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.achievements.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (item.status || "SUBMITTED").toUpperCase() === statusFilter.toUpperCase();

      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [achievements, searchQuery, statusFilter, categoryFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = achievements.length;
    const submitted = achievements.filter(
      (a) => !a.status || a.status.toUpperCase() === "SUBMITTED"
    ).length;
    const approved = achievements.filter(
      (a) => a.status && a.status.toUpperCase() === "APPROVED"
    ).length;
    const rejected = achievements.filter(
      (a) => a.status && a.status.toUpperCase() === "REJECTED"
    ).length;
    const withPhotos = achievements.filter((a) => !!a.picture).length;

    return { total, submitted, approved, rejected, withPhotos };
  }, [achievements]);

  // Export CSV
  const handleExportCSV = () => {
    if (achievements.length === 0) {
      alert("No achievements to export.");
      return;
    }

    const headers = [
      "ID",
      "Full Name",
      "Department",
      "Roll Number",
      "Category",
      "Date / Year",
      "Status",
      "Achievement Description",
      "Additional Notes",
      "Submission Date",
      "Has Picture",
    ];

    const rows = achievements.map((item) => [
      `"${item.id}"`,
      `"${item.fullName.replace(/"/g, '""')}"`,
      `"${item.department.replace(/"/g, '""')}"`,
      `"${item.rollNumber.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      `"${item.dateYear.replace(/"/g, '""')}"`,
      `"${item.status || "SUBMITTED"}"`,
      `"${item.achievements.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${(item.additionalNotes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${item.createdAt}"`,
      item.picture ? "Yes" : "No",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `talkies_achievements_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen bg-[#14120e] flex items-center justify-center p-4">
        <div className="text-[#e5e0d3] font-sans text-sm uppercase tracking-widest animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c83a1a] animate-ping" />
          Authenticating Archival Console...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14120e] text-[#e5e0d3] relative pb-24 font-sans selection:bg-[#c83a1a] selection:text-[#e5e0d3]">
      {/* Background Subtle Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(#e5e0d3 0.6px, transparent 0.6px), radial-gradient(#e5e0d3 0.6px, transparent 0.6px)",
          backgroundSize: "4px 4px",
          backgroundPosition: "0 0, 2px 2px",
        }}
      />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#14120e]/90 backdrop-blur-md border-b border-[#e5e0d3]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/admin"
              className="text-[#e5e0d3]/40 hover:text-[#e5e0d3] transition-colors text-xs font-sans uppercase tracking-widest flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Back to</span> Admin Console
            </Link>
            <div className="h-4 w-px bg-[#e5e0d3]/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[#c83a1a] text-xs">✦</span>
              <span className="text-xs uppercase tracking-widest font-bold text-[#e5e0d3]">
                06 // ACHIEVEMENTS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(password)}
              disabled={isLoading}
              className="px-3.5 py-1.5 border border-[#e5e0d3]/20 hover:border-[#e5e0d3] text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
              title="Refresh database"
            >
              <span className={isLoading ? "animate-spin" : ""}>↻</span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-[#e5e0d3] text-[#14120e] hover:bg-[#c83a1a] hover:text-[#e5e0d3] text-xs uppercase tracking-widest font-bold transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 space-y-8">
        {/* Title Banner */}
        <div className="border-b border-[#e5e0d3]/15 pb-6">
          <div className="flex items-center gap-2 mb-2 text-[#c83a1a] text-xs uppercase tracking-[0.25em] font-bold">
            <span>OFFICIAL RCC TALKIES ARCHIVE</span>
            <span>·</span>
            <span>ADMIN DISPATCH CONTROL</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#e5e0d3]">
            <DecryptedText
              text="STUDENT ACHIEVEMENTS"
              animateOn="view"
              speed={30}
              maxIterations={10}
              sequential={true}
              className="text-[#e5e0d3]"
              encryptedClassName="text-[#c83a1a]"
            />
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#e5e0d3]/70 mt-2 max-w-2xl">
            Review every submitted accomplishment, inspect uploaded photographs in full resolution, verify academic details, and manage publication statuses.
          </p>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-[#1a1612] border border-[#e5e0d3]/10">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#e5e0d3]/50">
              Total Filed
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#e5e0d3] mt-1">
              {stats.total}
            </div>
          </div>
          <div className="p-4 bg-[#1a1612] border border-[#e5e0d3]/10">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#eab308]">
              Submitted (Pending)
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#eab308] mt-1">
              {stats.submitted}
            </div>
          </div>
          <div className="p-4 bg-[#1a1612] border border-[#e5e0d3]/10">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#34d399]">
              Approved
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#34d399] mt-1">
              {stats.approved}
            </div>
          </div>
          <div className="p-4 bg-[#1a1612] border border-[#e5e0d3]/10">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#f87171]">
              Rejected
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#f87171] mt-1">
              {stats.rejected}
            </div>
          </div>
          <div className="p-4 bg-[#1a1612] border border-[#e5e0d3]/10 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#38bdf8]">
              Photos Attached
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#38bdf8] mt-1">
              {stats.withPhotos}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#1a1612] border border-[#e5e0d3]/15 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#e5e0d3]/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, department, or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-[#14120e] border border-[#e5e0d3]/20 text-xs sm:text-sm font-mono text-[#e5e0d3] placeholder:text-[#e5e0d3]/35 focus:outline-none focus:border-[#c83a1a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono text-[#c83a1a]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#14120e] border border-[#e5e0d3]/20 px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#e5e0d3] focus:outline-none focus:border-[#c83a1a]"
            >
              <option value="ALL">All Statuses ({achievements.length})</option>
              <option value="SUBMITTED">Submitted / Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#14120e] border border-[#e5e0d3]/20 px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#e5e0d3] focus:outline-none focus:border-[#c83a1a] max-w-[200px] truncate"
            >
              <option value="ALL">All Categories</option>
              {achievementCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="py-20 text-center border border-dashed border-[#e5e0d3]/15">
            <div className="text-xs uppercase font-mono tracking-widest text-[#e5e0d3]/50 animate-pulse">
              Loading submissions from Firestore...
            </div>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#e5e0d3]/15 p-8 space-y-3">
            <p className="font-serif italic text-base text-[#e5e0d3]/60">
              No achievements match your filters.
            </p>
            {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                }}
                className="text-xs font-mono uppercase tracking-wider text-[#c83a1a] underline hover:text-[#e5e0d3]"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#e5e0d3]/50 flex justify-between items-center">
              <span>Showing {filteredAchievements.length} of {achievements.length} submissions</span>
            </div>

            {filteredAchievements.map((item) => {
              const currentStatus = (item.status || "SUBMITTED").toUpperCase();
              const isActionLoading = actionLoadingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#1a1612] border border-[#e5e0d3]/15 hover:border-[#e5e0d3]/35 transition-all p-4 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-5 items-start">
                    {/* Picture Preview Thumbnail with Click-to-Zoom */}
                    <div className="w-full sm:w-48 flex-shrink-0">
                      {item.picture ? (
                        <div
                          onClick={() => setPreviewItem(item)}
                          className="group relative aspect-[4/3] w-full border-2 border-[#e5e0d3]/20 bg-[#0f0c0a] overflow-hidden cursor-pointer shadow-md hover:border-[#c83a1a] transition-all"
                          title="Click to view full size photo"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.picture}
                            alt={item.fullName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-mono text-[#e5e0d3]">
                            <span>🔍 Zoom</span>
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono px-1.5 py-0.5 text-[#e5e0d3]">
                            {item.dateYear}
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] w-full border border-dashed border-[#e5e0d3]/20 bg-[#14120e] flex items-center justify-center text-xs font-mono text-[#e5e0d3]/40">
                          No Photo
                        </div>
                      )}

                      {item.picture && (
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="w-full mt-2 py-1 bg-[#14120e] hover:bg-[#e5e0d3] hover:text-[#14120e] border border-[#e5e0d3]/20 text-[10px] font-mono uppercase tracking-wider transition-colors text-center"
                        >
                          View Full Image ↗
                        </button>
                      )}
                    </div>

                    {/* Middle: Student Details & Achievement Narrative */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e0d3]/10 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-black text-xl sm:text-2xl uppercase tracking-tight text-[#e5e0d3]">
                              {item.fullName}
                            </h3>
                            <span className="text-xs font-mono font-bold text-[#c83a1a]">
                              [{item.department}]
                            </span>
                          </div>
                          <p className="font-mono text-xs text-[#e5e0d3]/70">
                            ROLL: <strong className="text-[#e5e0d3]">{item.rollNumber}</strong> · YEAR: {item.dateYear}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider border ${
                              currentStatus === "APPROVED"
                                ? "bg-[#34d399]/15 text-[#34d399] border-[#34d399]/40"
                                : currentStatus === "REJECTED"
                                ? "bg-[#f87171]/15 text-[#f87171] border-[#f87171]/40"
                                : "bg-[#eab308]/15 text-[#eab308] border-[#eab308]/40"
                            }`}
                          >
                            ● {currentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Category tag */}
                      <div className="inline-block px-2.5 py-0.5 bg-[#14120e] border border-[#e5e0d3]/20 text-[10px] font-mono uppercase tracking-wider text-[#e5e0d3]/80">
                        Category: {item.category}
                      </div>

                      {/* Achievement Description */}
                      <div className="bg-[#14120e] border-l-2 border-[#c83a1a] p-3 text-xs sm:text-sm font-serif text-[#e5e0d3]/90 leading-relaxed whitespace-pre-wrap">
                        {item.achievements}
                      </div>

                      {/* Additional Notes */}
                      {item.additionalNotes && (
                        <p className="font-serif italic text-xs text-[#e5e0d3]/70">
                          <span className="font-mono not-italic font-bold text-[10px] uppercase text-[#c83a1a]">
                            Student Notes:{" "}
                          </span>
                          {item.additionalNotes}
                        </p>
                      )}

                      {/* Metadata bar */}
                      <div className="text-[10px] font-mono text-[#e5e0d3]/40 flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span>ID: {item.id}</span>
                        <span>
                          FILED ON: {new Date(item.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Right: Quick Action Panel */}
                    <div className="w-full lg:w-44 flex-shrink-0 flex flex-row lg:flex-col gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#e5e0d3]/10 lg:pl-4">
                      <span className="hidden lg:block text-[9px] font-mono uppercase tracking-widest text-[#e5e0d3]/40">
                        Change Status:
                      </span>

                      <button
                        type="button"
                        disabled={isActionLoading || currentStatus === "APPROVED"}
                        onClick={() => handleStatusUpdate(item.id, "APPROVED")}
                        className={`flex-1 py-1.5 px-2 text-xs font-mono uppercase tracking-wider font-bold border transition-colors ${
                          currentStatus === "APPROVED"
                            ? "bg-[#34d399]/20 text-[#34d399] border-[#34d399]/40 cursor-default"
                            : "bg-[#14120e] hover:bg-[#34d399] hover:text-[#14120e] text-[#34d399] border-[#34d399]/40 cursor-pointer"
                        }`}
                      >
                        ✓ Approve
                      </button>

                      <button
                        type="button"
                        disabled={isActionLoading || currentStatus === "SUBMITTED"}
                        onClick={() => handleStatusUpdate(item.id, "SUBMITTED")}
                        className={`flex-1 py-1.5 px-2 text-xs font-mono uppercase tracking-wider font-bold border transition-colors ${
                          currentStatus === "SUBMITTED"
                            ? "bg-[#eab308]/20 text-[#eab308] border-[#eab308]/40 cursor-default"
                            : "bg-[#14120e] hover:bg-[#eab308] hover:text-[#14120e] text-[#eab308] border-[#eab308]/40 cursor-pointer"
                        }`}
                      >
                        ⟲ Pending
                      </button>

                      <button
                        type="button"
                        disabled={isActionLoading || currentStatus === "REJECTED"}
                        onClick={() => handleStatusUpdate(item.id, "REJECTED")}
                        className={`flex-1 py-1.5 px-2 text-xs font-mono uppercase tracking-wider font-bold border transition-colors ${
                          currentStatus === "REJECTED"
                            ? "bg-[#f87171]/20 text-[#f87171] border-[#f87171]/40 cursor-default"
                            : "bg-[#14120e] hover:bg-[#f87171] hover:text-[#14120e] text-[#f87171] border-[#f87171]/40 cursor-pointer"
                        }`}
                      >
                        ✕ Reject
                      </button>

                      <div className="h-px bg-[#e5e0d3]/10 my-1 hidden lg:block" />

                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        className="py-1.5 px-2 text-xs font-mono uppercase tracking-wider text-[#f87171]/70 hover:text-[#f87171] hover:bg-[#f87171]/10 border border-[#f87171]/20 transition-colors cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          LIGHTBOX MODAL FOR FULL-SIZE PHOTO INSPECTION
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#1a1612] border-2 border-[#e5e0d3]/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-[#e5e0d3]/15 flex items-center justify-between bg-[#14120e]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#e5e0d3] uppercase">
                    {previewItem.fullName} — Photo Inspection
                  </h3>
                  <p className="font-mono text-xs text-[#e5e0d3]/60">
                    DEPT: {previewItem.department} · ROLL: {previewItem.rollNumber} · CATEGORY: {previewItem.category}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {previewItem.picture && (
                    <a
                      href={previewItem.picture}
                      download={`achievement_${previewItem.rollNumber}.webp`}
                      className="px-3 py-1 bg-[#e5e0d3] text-[#14120e] font-mono text-xs uppercase font-bold hover:bg-[#c83a1a] hover:text-[#e5e0d3] transition-colors"
                    >
                      Download Photo ↓
                    </a>
                  )}
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="w-8 h-8 flex items-center justify-center border border-[#e5e0d3]/30 text-[#e5e0d3] hover:bg-[#c83a1a] text-sm transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Photo Display Body */}
              <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#0d0a08]">
                {previewItem.picture ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewItem.picture}
                    alt={previewItem.fullName}
                    className="max-h-[60vh] max-w-full object-contain border border-[#e5e0d3]/20 shadow-lg"
                  />
                ) : (
                  <div className="text-sm font-mono text-[#e5e0d3]/50">No picture available</div>
                )}

                <div className="w-full mt-4 p-3 bg-[#14120e] border border-[#e5e0d3]/15 text-xs font-serif text-[#e5e0d3]/90">
                  <span className="font-mono font-bold uppercase text-[10px] text-[#c83a1a] block mb-1">
                    Achievement Description:
                  </span>
                  {previewItem.achievements}
                </div>
              </div>

              {/* Modal Footer with Status Actions */}
              <div className="p-3 border-t border-[#e5e0d3]/15 bg-[#14120e] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div>
                  STATUS: <strong className="text-[#c83a1a]">{previewItem.status || "SUBMITTED"}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusUpdate(previewItem.id, "APPROVED")}
                    className="px-3 py-1 bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/40 hover:bg-[#34d399] hover:text-[#14120e] uppercase font-bold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(previewItem.id, "REJECTED")}
                    className="px-3 py-1 bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/40 hover:bg-[#f87171] hover:text-[#14120e] uppercase font-bold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="px-3 py-1 border border-[#e5e0d3]/30 text-[#e5e0d3] uppercase"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          DELETE CONFIRMATION DIALOG
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#1a1612] border-2 border-[#f87171]/40 p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#f87171]/15 text-[#f87171] flex items-center justify-center text-xl font-bold border border-[#f87171]/40">
                ⚠
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-black text-xl uppercase text-[#e5e0d3]">
                  Permanently Delete?
                </h3>
                <p className="font-serif text-xs text-[#e5e0d3]/70">
                  This will permanently remove this student submission from the Firestore database. This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-[#e5e0d3]/30 hover:bg-[#e5e0d3] hover:text-[#14120e] uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-[#f87171] hover:bg-[#dc2626] text-[#14120e] font-bold uppercase transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Record"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
