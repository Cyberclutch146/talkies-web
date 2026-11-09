"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DriftWall, { type DriftWallItem } from "./DriftWall";
import {
  CATEGORY_ITEMS,
  CATEGORY_LABELS,
  type DriftWallCategory,
} from "../../data/driftWallCategories";

interface AgomoniCategoryOverlayProps {
  category: DriftWallCategory | null;
  onClose: () => void;
}

/**
 * Full-screen photo overlay for one Agomoni category. Renders nothing while
 * `category` is null. Clicking a photo opens it enlarged (with previous/next).
 * Escape closes the enlarged photo first, then the gallery.
 */
export function AgomoniCategoryOverlay({ category, onClose }: AgomoniCategoryOverlayProps) {
  const [entered, setEntered] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!category) return;

    const frame = requestAnimationFrame(() => setEntered(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(frame);
      setEntered(false);
      setOpenIndex(null);
      document.body.style.overflow = previousOverflow;
    };
  }, [category]);

  const items = category ? CATEGORY_ITEMS[category] : [];
  const isOpen = openIndex !== null;

  const goTo = useCallback(
    (delta: number) => {
      setOpenIndex(current => {
        if (current === null || items.length === 0) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (!category) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openIndex !== null) setOpenIndex(null);
        else onClose();
      } else if (openIndex !== null && e.key === "ArrowRight") {
        goTo(1);
      } else if (openIndex !== null && e.key === "ArrowLeft") {
        goTo(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [category, openIndex, onClose, goTo]);

  const handleClose = useCallback(() => onClose(), [onClose]);

  if (!category || typeof document === "undefined") return null;

  const label = CATEGORY_LABELS[category];
  const current = openIndex !== null ? items[openIndex] : null;

  return createPortal(
    <div
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="agomoni-category-title"
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm transition-opacity duration-300 sm:p-6 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative flex h-[min(86vh,760px)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#d4a24e]/25 bg-[#14120e] shadow-2xl transition-all duration-500 ease-out ${
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#d4a24e]/15 px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#d4a24e]">
              Agomoni 2026 · Gallery
            </p>
            <h3
              id="agomoni-category-title"
              className="mt-1 truncate font-serif text-2xl text-[#faf6ee] sm:text-3xl"
            >
              {label}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="font-sans text-xs text-[#faf6ee]/50">
              {items.length} {items.length === 1 ? "photo" : "photos"}
            </span>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close gallery"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4a24e]/30 text-[#faf6ee] transition-colors hover:border-[#d4a24e] hover:text-[#d4a24e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div className="relative min-h-0 flex-1">
          <DriftWall
            items={items}
            columns={narrow ? 3 : 5}
            tileWidth={narrow ? 150 : 200}
            tileHeight={narrow ? 100 : 132}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.6}
            dim={0.55}
            overlayColor="#060010"
            onItemClick={(item: DriftWallItem) =>
              setOpenIndex(items.findIndex(photo => photo.image === item.image))
            }
          />
        </div>

        <footer className="border-t border-[#d4a24e]/15 px-5 py-3 text-center font-sans text-[9px] uppercase tracking-[.22em] text-[#faf6ee]/35">
          Click a photo to enlarge <span className="mx-2 text-[#d4a24e]">✦</span> Esc to close
        </footer>
      </div>

      {current && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title} enlarged`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 sm:p-10"
          onClick={e => {
            e.stopPropagation();
            setOpenIndex(null);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.image}
            alt={current.title}
            draggable={false}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          <p className="pointer-events-none absolute bottom-5 left-0 right-0 text-center font-sans text-[10px] uppercase tracking-[.22em] text-[#faf6ee]/60">
            {current.title} <span className="mx-2 text-[#d4a24e]">✦</span> {openIndex + 1} / {items.length}
          </p>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setOpenIndex(null);
            }}
            aria-label="Close photo"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4a24e]/30 bg-black/40 text-[#faf6ee] transition-colors hover:border-[#d4a24e] hover:text-[#d4a24e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  goTo(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d4a24e]/30 bg-black/40 text-[#faf6ee] transition-colors hover:border-[#d4a24e] hover:text-[#d4a24e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] sm:left-6"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  goTo(1);
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d4a24e]/30 bg-black/40 text-[#faf6ee] transition-colors hover:border-[#d4a24e] hover:text-[#d4a24e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] sm:right-6"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
