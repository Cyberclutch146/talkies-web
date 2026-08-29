"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DecryptedText from "@/components/DecryptedText";

interface InstaPost {
  id: string;
  imageUrl: string;
  postUrl: string;
  caption: string | null;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Expected array from API, got:", data);
          setPosts([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch instagram feed:", err);
        setIsLoading(false);
      });
  }, []);

  // Don't render the section if there are no posts and we're done loading
  if (!isLoading && posts.length === 0) return null;

  return (
    <section className="w-full border-b border-[#14120e]/20">
      {/* Section header bar */}
      <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-[#14120e]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-1">
            FROM THE PHOTO DESK
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#14120e]">
            <DecryptedText
              text="INSTAGRAM"
              animateOn="view"
              speed={35}
              maxIterations={7}
              sequential={true}
              revealDirection="start"
              className="text-[#14120e]"
              encryptedClassName="text-[#c83a1a]"
            />
          </h2>
        </div>
        <a
          href="https://www.instagram.com/rcc_talkies/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.15em] font-bold text-[#14120e] hover:text-[#c83a1a] transition-colors"
        >
          <span>@rcc_talkies</span>
          <span>↗</span>
        </a>
      </div>

      {/* Photo Grid */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#c83a1a] border-t-transparent rounded-full animate-spin" />
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#14120e]/40 font-bold">
                Loading feed…
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post, idx) => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-[#dad4c3] border-r border-b border-[#14120e]/10"
                title={post.caption || `Instagram post ${idx + 1}`}
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || `Instagram post ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#14120e]/0 group-hover:bg-[#14120e]/60 transition-all duration-500 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  {/* Instagram icon */}
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e5e0d3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-2 drop-shadow-lg"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  {post.caption && (
                    <p className="text-[#e5e0d3] text-[10px] sm:text-xs font-sans text-center px-3 max-w-[140px] leading-relaxed">
                      {post.caption}
                    </p>
                  )}
                </div>

                {/* Corner badge */}
                <div className="absolute top-2 left-2 bg-[#14120e]/80 text-[#e5e0d3] text-[8px] font-sans font-bold px-1.5 py-0.5 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
