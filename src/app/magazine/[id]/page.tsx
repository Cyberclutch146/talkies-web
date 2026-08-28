import { notFound } from 'next/navigation';
import Link from 'next/link';
import FlipbookWrapper from '@/components/FlipbookWrapper';
import { prisma } from '@/lib/prisma';

interface MagazineViewerProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function MagazineViewer({ params }: MagazineViewerProps) {
  const { id } = await params;

  const magazine = await prisma.magazine.findUnique({
    where: { id },
  });

  if (!magazine) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f0d09] flex flex-col overflow-hidden">
      {/* ── Subtle texture overlay ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e0d3' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Vignette effect ────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="relative z-20 w-full border-b border-[#e5e0d3]/8 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 bg-[#0f0d09]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/magazine"
            className="flex items-center justify-center w-8 h-8 border border-[#e5e0d3]/15 text-[#e5e0d3]/50 hover:text-[#e5e0d3] hover:bg-[#e5e0d3]/5 transition-colors"
            aria-label="Back to magazines"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex flex-col">
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#c83a1a] font-bold leading-none">
              {magazine.volume} // {magazine.year}
            </span>
            <h1 className="font-display text-base sm:text-xl uppercase tracking-tight text-[#e5e0d3] leading-none mt-1">
              {magazine.title}
            </h1>
          </div>
        </div>

        <a
          href={magazine.pdfUrl}
          download
          className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.15em] font-bold text-[#e5e0d3]/40 hover:text-[#e5e0d3] transition-colors border border-[#e5e0d3]/10 px-3 py-1.5 hover:bg-[#e5e0d3]/5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span className="hidden sm:inline">Download</span>
        </a>
      </header>

      {/* ── Reader Area ────────────────────────────────────── */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center overflow-hidden">
        <FlipbookWrapper pdfUrl={magazine.pdfUrl} />
      </main>

      {/* ── Bottom Bar ─────────────────────────────────────── */}
      <div className="relative z-20 w-full border-t border-[#e5e0d3]/8 px-4 sm:px-6 py-2 flex items-center justify-between bg-[#0f0d09]/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="RCC Talkies" className="h-4 w-auto opacity-30" />
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#e5e0d3]/25 font-bold hidden sm:inline">
            The RCC Talkies
          </span>
        </div>
        <span className="font-sans text-[9px] uppercase tracking-widest text-[#e5e0d3]/25 font-bold">
          RCCIIT, Kolkata · Est. 2023
        </span>
      </div>
    </div>
  );
}
