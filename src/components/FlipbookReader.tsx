"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface FlipbookReaderProps {
  pdfUrl: string;
}

/* ────────────────────────────────────────────────────────────
   Virtualized Page
──────────────────────────────────────────────────────────── */
const FlipPage = React.forwardRef<
  HTMLDivElement,
  { pageNumber: number; width: number; height: number; shouldRender: boolean }
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="overflow-hidden"
      style={{
        width: props.width,
        height: props.height,
        backgroundColor: '#faf8f4',
      }}
    >
      {props.shouldRender ? (
        <Page
          pageNumber={props.pageNumber}
          width={props.width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          devicePixelRatio={Math.min(window.devicePixelRatio || 1, 1.5)}
          loading={
            <div
              className="flex items-center justify-center bg-[#faf8f4]"
              style={{ width: props.width, height: props.height }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 border border-[#14120e]/20 border-t-[#c83a1a] rounded-full animate-spin" />
                <span className="text-[#14120e]/25 font-sans text-[9px] uppercase tracking-widest">
                  {props.pageNumber}
                </span>
              </div>
            </div>
          }
        />
      ) : (
        <div
          className="flex items-center justify-center bg-[#faf8f4]"
          style={{ width: props.width, height: props.height }}
        >
          <span className="text-[#14120e]/15 font-sans text-[9px] uppercase tracking-widest">
            {props.pageNumber}
          </span>
        </div>
      )}
    </div>
  );
});
FlipPage.displayName = 'FlipPage';

/* ────────────────────────────────────────────────────────────
   Main Component
──────────────────────────────────────────────────────────── */
export default function FlipbookReader({ pdfUrl }: FlipbookReaderProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [sizeKey, setSizeKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Calculate page size ──────────────────────────────── */
  const calculateSize = useCallback(() => {
    if (!containerRef.current) return;

    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    const padX = mobile ? 12 : 40;
    const padY = mobile ? 12 : 24;
    const aw = cw - padX * 2;
    const ah = ch - padY * 2;

    // A4 ratio
    const ratio = 1 / 1.414;
    let pw: number, ph: number;

    if (mobile) {
      // Single page — maximize within container
      pw = Math.min(aw, 420);
      ph = pw / ratio;
      if (ph > ah) {
        ph = ah;
        pw = ph * ratio;
      }
    } else {
      // Two pages — maximize height, constrain width
      ph = Math.min(ah, 900);
      pw = ph * ratio;
      if (pw * 2 > aw) {
        pw = aw / 2;
        ph = pw / ratio;
      }
    }

    pw = Math.floor(pw);
    ph = Math.floor(ph);

    setPageSize((prev) => {
      if (prev.width !== pw || prev.height !== ph) {
        // Debounce the key change so the flipbook only remounts after resize stabilizes
        if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = setTimeout(() => {
          setSizeKey((k) => k + 1);
        }, 400);
        return { width: pw, height: ph };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => {
      window.removeEventListener('resize', calculateSize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [calculateSize]);

  /* ── PDF callbacks ────────────────────────────────────── */
  const onDocumentLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
      setIsLoading(false);
    },
    []
  );

  const onDocumentLoadError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  /* ── Flip callbacks ───────────────────────────────────── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const goNext = useCallback(() => flipBookRef.current?.pageFlip()?.flipNext(), []);
  const goPrev = useCallback(() => flipBookRef.current?.pageFlip()?.flipPrev(), []);

  /* ── Keyboard controls ────────────────────────────────── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  /* ── Error state ──────────────────────────────────────── */
  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-[#e5e0d3] px-4">
        <span className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-center">
          Failed to Load
        </span>
        <p className="font-serif text-sm text-[#e5e0d3]/50 max-w-sm text-center">
          The document could not be loaded. Try downloading it instead.
        </p>
        <a
          href={pdfUrl}
          download
          className="border border-[#e5e0d3]/20 px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#e5e0d3]/10 transition-colors text-[#e5e0d3]/70"
        >
          Download PDF
        </a>
      </div>
    );
  }

  /* ── Initial loading ──────────────────────────────────── */
  if (pageSize.width === 0) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#c83a1a] border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#e5e0d3]/40 font-bold">
            Preparing…
          </span>
        </div>
      </div>
    );
  }

  // Render window: only render pages within ±3 of current
  const RENDER_WINDOW = 3;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center relative select-none"
    >
      {/* ── Book ─────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex flex-col items-center gap-3 py-20">
              <div className="w-5 h-5 border-2 border-[#c83a1a] border-t-transparent rounded-full animate-spin" />
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#e5e0d3]/40 font-bold">
                Loading document…
              </span>
            </div>
          }
        >
          {numPages > 0 && (
            /* @ts-expect-error - React HTMLFlipBook typings mismatch with React 18 children */
            <HTMLFlipBook
              key={`fb-${sizeKey}`}
              ref={flipBookRef}
              width={pageSize.width}
              height={pageSize.height}
              size="fixed"
              minWidth={200}
              maxWidth={1200}
              minHeight={280}
              maxHeight={1700}
              maxShadowOpacity={0.3}
              showCover={true}
              mobileScrollSupport={false}
              usePortrait={isMobile}
              onFlip={onFlip}
              drawShadow={true}
              flippingTime={500}
              startPage={0}
              startZIndex={0}
              autoSize={false}
              clickEventForward={false}
              useMouseEvents={true}
              swipeDistance={20}
              showPageCorners={true}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <FlipPage
                  key={`p-${i}`}
                  pageNumber={i + 1}
                  width={pageSize.width}
                  height={pageSize.height}
                  shouldRender={Math.abs(i - currentPage) <= RENDER_WINDOW}
                />
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>

      {/* ── Controls Bar ─────────────────────────────────── */}
      {numPages > 0 && !isLoading && (
        <div className="relative z-20 shrink-0 pb-2 pt-4 flex items-center gap-4">
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="w-8 h-8 flex items-center justify-center border border-[#e5e0d3]/15 text-[#e5e0d3]/50 hover:text-[#e5e0d3] hover:bg-[#e5e0d3]/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-[#e5e0d3]/40 font-bold min-w-[70px] justify-center">
            <span className="text-[#e5e0d3]/80">{currentPage + 1}</span>
            <span className="text-[#e5e0d3]/20">/</span>
            <span>{numPages}</span>
          </div>

          <button
            onClick={goNext}
            disabled={currentPage >= numPages - 1}
            className="w-8 h-8 flex items-center justify-center border border-[#e5e0d3]/15 text-[#e5e0d3]/50 hover:text-[#e5e0d3] hover:bg-[#e5e0d3]/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
