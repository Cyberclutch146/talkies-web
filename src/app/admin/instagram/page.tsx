"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { verifyPassword } from "../actions";

interface InstaPost {
  id: string;
  imageUrl: string;
  postUrl: string;
  caption: string | null;
  order: number;
}

export default function AdminInstagram() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postUrl, setPostUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/instagram");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error("API returned error:", data);
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPassword(savedPassword);
      setIsAuthenticated(true);
    } else {
      window.location.href = "/admin";
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAuthenticated) fetchPosts();
  }, [isAuthenticated]);

  // Generate preview when file changes
  useEffect(() => {
    if (!imageFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);


  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Please select an image file", type: "error" });
      return;
    }
    setImageFile(file);
    setMessage({ text: "", type: "" });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage({ text: "Please select an image", type: "error" });
      return;
    }
    if (!postUrl) {
      setMessage({ text: "Instagram Post URL is required", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("password", password);
    formData.append("image", imageFile);
    formData.append("postUrl", postUrl);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/instagram", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Post added successfully!", type: "success" });
        setImageFile(null);
        setPostUrl("");
        setCaption("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchPosts();
      } else {
        setMessage({ text: data.error || "Failed to add post", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl || !editingId) {
      setMessage({ text: "Instagram Post URL is required", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "Updating database...", type: "" });

    try {
      const res = await fetch(`/api/instagram/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          postUrl,
          caption,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Post updated successfully!", type: "success" });
        cancelEdit();
        fetchPosts();
      } else {
        setMessage({ text: data.error || "Update failed", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred during update", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (post: InstaPost) => {
    setEditingId(post.id);
    setPostUrl(post.postUrl);
    setCaption(post.caption || "");
    setMessage({ text: "", type: "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPostUrl("");
    setCaption("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage({ text: "", type: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Instagram post from the feed?")) return;

    setDeletingId(id);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`/api/instagram/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Post removed!", type: "success" });
        fetchPosts();
      } else {
        setMessage({ text: data.error || "Failed to delete", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred during deletion", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

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
    <div className="min-h-screen bg-[#e5e0d3] text-[#14120e] pt-32 sm:pt-40 pb-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* LEFT: ADD POST FORM */}
        <div>
          <div className="mb-8">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              INSTAGRAM FEED MANAGER
            </span>
            <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-tighter text-[#14120e]">
              <DecryptedText
                text={editingId ? "EDIT POST" : "ADD POST"}
                animateOn="view"
                speed={40}
                maxIterations={8}
                sequential={true}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>

          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-6 bg-[#eae5d9] border border-[#14120e]/30 p-6 sm:p-8 shadow-[8px_8px_0px_#14120e]">
            {message.text && (
              <div className={`p-4 border ${message.type === "success" ? "border-green-500 bg-green-50 text-green-800" : "border-[#c83a1a] bg-red-50 text-[#c83a1a]"} font-sans text-sm uppercase tracking-wider font-bold`}>
                {message.text}
              </div>
            )}

            {/* Drag & Drop Image Upload */}
            {!editingId && (
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">
                  Image *
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-[#c83a1a] bg-[#c83a1a]/5"
                      : imagePreview
                      ? "border-[#14120e]/30 bg-[#e5e0d3]"
                      : "border-[#14120e]/20 bg-[#e5e0d3] hover:border-[#14120e]/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-[#14120e]/0 hover:bg-[#14120e]/40 transition-colors flex items-center justify-center">
                        <span className="opacity-0 hover:opacity-100 text-[#e5e0d3] font-sans text-xs uppercase tracking-widest font-bold">
                          Click to change
                        </span>
                      </div>
                      {/* File info badge */}
                      <div className="absolute bottom-2 left-2 bg-[#14120e]/80 text-[#e5e0d3] text-[9px] font-sans font-bold px-2 py-1 tracking-wider uppercase">
                        {imageFile?.name} · {((imageFile?.size || 0) / 1024).toFixed(0)}KB
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 sm:py-16 flex flex-col items-center gap-3 text-center px-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]/30">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <div>
                        <p className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/50 mb-1">
                          {isDragging ? "DROP IMAGE HERE" : "DRAG & DROP IMAGE"}
                        </p>
                        <p className="font-serif text-sm text-[#14120e]/40">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instagram Post URL */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">
                Instagram Post URL *
              </label>
              <input
                type="url"
                required
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/ABC123/"
                className="w-full bg-[#e5e0d3] border-b-2 border-[#14120e]/30 focus:border-[#c83a1a] text-[#14120e] p-3 font-serif outline-none transition-colors"
              />
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-[#14120e]/70">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short caption shown on hover..."
                className="w-full bg-[#e5e0d3] border-b-2 border-[#14120e]/30 focus:border-[#c83a1a] text-[#14120e] p-3 font-serif outline-none transition-colors"
              />
            </div>

            <div className="flex gap-4">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-1/3 mt-8 border-2 border-[#14120e] text-[#14120e] font-display text-xl uppercase tracking-tight py-4 hover:bg-[#14120e]/5 transition-colors flex items-center justify-center"
                >
                  CANCEL
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${editingId ? 'w-2/3' : 'w-full'} mt-8 bg-[#14120e] text-[#e5e0d3] font-display text-2xl uppercase tracking-tight py-4 hover:bg-[#c83a1a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#e5e0d3] border-t-transparent rounded-full animate-spin" />
                    {editingId ? "UPDATING..." : "UPLOADING..."}
                  </>
                ) : (
                  editingId ? "UPDATE POST" : "ADD TO FEED"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: MANAGE POSTS */}
        <div>
          <div className="mb-8 pt-2">
            <h2 className="font-display text-3xl uppercase tracking-tighter text-[#14120e] border-b border-[#14120e]/20 pb-4">
              Current Feed
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-[#14120e]/50 font-sans text-xs uppercase tracking-widest">
                Loading...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-[#14120e]/50 font-sans text-xs uppercase tracking-widest">
                No posts in the feed yet.
              </div>
            ) : (
              posts.map((post, idx) => (
                <div key={post.id} className="bg-[#eae5d9] border border-[#14120e]/20 p-3 flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden border border-[#14120e]/20 bg-[#dad4c3]">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || `Post ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {post.caption && (
                      <p className="text-xs font-serif text-[#14120e]/70 truncate mb-1">
                        {post.caption}
                      </p>
                    )}
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-sans text-[#c83a1a] underline underline-offset-2 truncate block"
                    >
                      {post.postUrl}
                    </a>
                  </div>
                  <div className="flex gap-1 self-center">
                    <button
                      onClick={() => startEdit(post)}
                      disabled={deletingId === post.id || editingId === post.id}
                      className="w-8 h-8 flex-shrink-0 border border-[#14120e]/30 text-[#14120e] flex items-center justify-center hover:bg-[#14120e]/10 transition-colors disabled:opacity-50"
                      aria-label="Edit post"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="w-8 h-8 flex-shrink-0 border border-[#c83a1a]/30 text-[#c83a1a] flex items-center justify-center hover:bg-[#c83a1a] hover:text-[#e5e0d3] transition-colors disabled:opacity-50"
                      aria-label="Delete post"
                    >
                      {deletingId === post.id ? (
                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="max-w-5xl mx-auto mt-10 border-t border-[#14120e]/20 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans uppercase tracking-widest text-[#14120e]/40">
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
  );
}
