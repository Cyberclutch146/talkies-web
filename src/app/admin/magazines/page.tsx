"use client";

import { useState, useEffect } from "react";
import DecryptedText from "@/components/DecryptedText";
import { verifyPassword } from "../actions";

interface Magazine {
  id: string;
  title: string;
  volume: string;
  year: string;
  createdAt: string;
}

export default function AdminMagazines() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoadingMags, setIsLoadingMags] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMagazines = async () => {
    setIsLoadingMags(true);
    try {
      const res = await fetch("/api/magazines");
      if (res.ok) {
        const data = await res.json();
        setMagazines(data);
      }
    } catch (err) {
      console.error("Failed to fetch magazines", err);
    } finally {
      setIsLoadingMags(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMagazines();
    }
  }, [isAuthenticated]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim().length === 0) {
      setMessage({ text: "Please enter the admin password", type: "error" });
      return;
    }
    
    const result = await verifyPassword(password);
    
    if (result.success) {
      setIsAuthenticated(true);
      setMessage({ text: "", type: "" });
    } else {
      setMessage({ text: result.error || "Invalid password", type: "error" });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !volume || !year || !pdfFile) {
      setMessage({ text: "Please fill all required fields", type: "error" });
      return;
    }

    setIsUploading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("password", password);
    formData.append("title", title);
    formData.append("volume", volume);
    formData.append("year", year);
    formData.append("description", description);
    formData.append("pdf", pdfFile);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const res = await fetch("/api/magazines", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Magazine uploaded successfully!", type: "success" });
        // Reset form
        setTitle("");
        setVolume("");
        setDescription("");
        setPdfFile(null);
        setCoverImage(null);
        // reset file inputs
        const pdfInput = document.getElementById("pdf") as HTMLInputElement;
        if (pdfInput) pdfInput.value = "";
        const coverInput = document.getElementById("cover") as HTMLInputElement;
        if (coverInput) coverInput.value = "";
        
        // Refresh list
        fetchMagazines();
      } else {
        setMessage({ text: data.error || "Upload failed", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred during upload", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this issue? This cannot be undone.")) return;
    
    setDeletingId(id);
    setMessage({ text: "", type: "" });
    
    try {
      const res = await fetch(`/api/magazines/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ text: "Magazine deleted successfully!", type: "success" });
        fetchMagazines();
      } else {
        setMessage({ text: data.error || "Failed to delete", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred during deletion", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#e5e0d3] flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="max-w-sm w-full bg-[#14120e] p-8 border border-[#14120e]/20 shadow-[8px_8px_0px_#c83a1a]">
          <h1 className="font-display text-4xl text-[#e5e0d3] uppercase mb-6 tracking-tight">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#e5e0d3] text-[#14120e] p-3 font-sans outline-none mb-4"
          />
          {message.text && message.type === "error" && (
            <p className="text-[#c83a1a] text-xs font-sans uppercase mb-4">{message.text}</p>
          )}
          <button type="submit" className="w-full bg-[#c83a1a] text-[#e5e0d3] font-display text-xl uppercase py-2 hover:bg-[#a62b10] transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e0d3] text-[#14120e] pt-32 sm:pt-40 pb-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* LEFT COLUMN: UPLOAD FORM */}
        <div>
          <div className="mb-8">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              EDITORIAL BOARD DASHBOARD
            </span>
            <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-tighter text-[#14120e]">
              <DecryptedText
                text="UPLOAD ISSUE"
                animateOn="view"
                speed={40}
                maxIterations={8}
                sequential={true}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>

          <form onSubmit={handleUpload} className="space-y-6 bg-[#eae5d9] border border-[#14120e]/30 p-6 sm:p-8 shadow-[8px_8px_0px_#14120e]">
            {message.text && (
              <div className={`p-4 border ${message.type === "success" ? "border-green-500 bg-green-50 text-green-800" : "border-[#c83a1a] bg-red-50 text-[#c83a1a]"} font-sans text-sm uppercase tracking-wider font-bold`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Beginning"
                  className="w-full bg-[#e5e0d3] border-b-2 border-[#14120e]/30 focus:border-[#c83a1a] text-[#14120e] p-3 font-serif outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">Volume *</label>
                <input
                  type="text"
                  required
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="e.g. VOL. I"
                  className="w-full bg-[#e5e0d3] border-b-2 border-[#14120e]/30 focus:border-[#c83a1a] text-[#14120e] p-3 font-serif outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">Year *</label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#e5e0d3] border-b-2 border-[#14120e]/30 focus:border-[#c83a1a] text-[#14120e] p-3 font-serif outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short blurb about this issue..."
                rows={3}
                className="w-full bg-[#e5e0d3] border-b-2 border-[#14120e]/30 focus:border-[#c83a1a] text-[#14120e] p-3 font-serif outline-none transition-colors resize-y"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 border-t border-[#14120e]/20">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">PDF File *</label>
                  <span className="text-[10px] font-sans text-[#c83a1a] uppercase font-bold tracking-wider">⚠️ Compress before upload (Max 4.5MB)</span>
                </div>
                <input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-[#14120e] file:text-[#e5e0d3] hover:file:bg-[#c83a1a] file:cursor-pointer file:transition-colors text-sm"
                />
                <p className="text-[10px] font-serif italic text-[#14120e]/60">
                  Please use a tool like ILovePDF or Adobe Acrobat to compress your magazine PDF before uploading. Vercel enforces strict size limits on server uploads.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">Cover Image (Optional)</label>
                <input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-[#14120e]/10 file:text-[#14120e] hover:file:bg-[#14120e]/20 file:cursor-pointer file:transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full mt-8 bg-[#14120e] text-[#e5e0d3] font-display text-2xl uppercase tracking-tight py-4 hover:bg-[#c83a1a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#e5e0d3] border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                "PUBLISH ISSUE"
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: MANAGE ISSUES */}
        <div>
          <div className="mb-8 pt-2">
            <h2 className="font-display text-3xl uppercase tracking-tighter text-[#14120e] border-b border-[#14120e]/20 pb-4">
              Manage Issues
            </h2>
          </div>
          
          <div className="space-y-4">
            {isLoadingMags ? (
              <div className="text-center py-8 text-[#14120e]/50 font-sans text-xs uppercase tracking-widest">
                Loading...
              </div>
            ) : magazines.length === 0 ? (
              <div className="text-center py-8 text-[#14120e]/50 font-sans text-xs uppercase tracking-widest">
                No issues published yet.
              </div>
            ) : (
              magazines.map((mag) => (
                <div key={mag.id} className="bg-[#eae5d9] border border-[#14120e]/20 p-4 flex flex-col gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5">
                        {mag.volume}
                      </span>
                      <span className="font-mono text-[10px] text-[#14120e]/60">
                        {mag.year}
                      </span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-tight leading-none text-[#14120e]">
                      {mag.title}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(mag.id)}
                    disabled={deletingId === mag.id}
                    className="w-full border border-[#c83a1a]/30 text-[#c83a1a] font-sans text-[10px] font-bold uppercase tracking-widest py-2 hover:bg-[#c83a1a] hover:text-[#e5e0d3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deletingId === mag.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete Issue
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
