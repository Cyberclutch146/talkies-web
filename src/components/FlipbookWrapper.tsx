"use client";

import dynamic from 'next/dynamic';

const FlipbookReader = dynamic(() => import('./FlipbookReader'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#c83a1a] border-t-transparent rounded-full animate-spin" />
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#e5e0d3]/50 font-bold">
          Loading reader…
        </span>
      </div>
    </div>
  ),
});

export default function FlipbookWrapper({ pdfUrl }: { pdfUrl: string }) {
  return <FlipbookReader pdfUrl={pdfUrl} />;
}
