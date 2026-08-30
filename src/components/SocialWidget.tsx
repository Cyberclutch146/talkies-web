"use client";

import siteData from "@/data/site.json";
import { useEffect, useState, useRef } from "react";

export function SocialWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Small delay before showing widget to let the page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      
      {/* Dialogue Box */}
      <div 
        className={`
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}
          mb-2 w-72 rounded-2xl border border-[#14120e]/10 bg-[#e5e0d3] shadow-2xl p-5
        `}
      >
        <div className="flex flex-col w-full">
          
          {/* Header */}
          <div className="w-full flex flex-col items-center mb-6">
             <div className="flex items-center gap-2 text-[#c83a1a] mb-2 opacity-60">
               <span className="w-4 h-px bg-[#c83a1a]/40"></span>
               <span className="text-[8px]">✦</span>
               <span className="w-4 h-px bg-[#c83a1a]/40"></span>
             </div>
             <h3 className="font-gothic text-3xl text-[#14120e] text-center leading-none mb-2">
               Stay Connected
             </h3>
             <p className="font-serif italic text-xs text-[#14120e]/60 text-center">
               Join the conversation
             </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            {/* WhatsApp Link */}
            <a
              href={siteData.contact.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-[#14120e]/10 hover:bg-[#14120e]/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#14120e]/20 bg-transparent text-[#14120e] group-hover:border-[#14120e]/40 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg text-[#14120e] leading-none mb-1 group-hover:text-[#c83a1a] transition-colors">WhatsApp</span>
                  <span className="text-[10px] text-[#14120e]/50 uppercase tracking-[0.2em] font-sans">Community</span>
                </div>
              </div>
              <span className="font-serif text-xl text-[#14120e] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">→</span>
            </a>

            {/* Instagram Link */}
            <a
              href={siteData.contact.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-[#14120e]/10 hover:bg-[#14120e]/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#14120e]/20 bg-transparent text-[#14120e] group-hover:border-[#14120e]/40 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg text-[#14120e] leading-none mb-1 group-hover:text-[#c83a1a] transition-colors">Instagram</span>
                  <span className="text-[10px] text-[#14120e]/50 uppercase tracking-[0.2em] font-sans">Updates</span>
                </div>
              </div>
              <span className="font-serif text-xl text-[#14120e] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#14120e] text-[#e5e0d3] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#c83a1a] hover:shadow-xl focus:outline-none"
        aria-label="Social Links"
        aria-expanded={isOpen}
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'} absolute`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
          </svg>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0'} absolute`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>
      </button>
    </div>
  );
}
