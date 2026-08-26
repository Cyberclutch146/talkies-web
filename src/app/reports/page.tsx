"use client";

import pubsData from "@/data/publications.json";

export default function ReportsPage() {
  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] py-6 sm:py-10 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              FIELD JOURNALISM & EVENT METRICS
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              EVENT REPORTS
            </h1>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/70 max-w-sm">
            Official post-event breakdown reports published by the RCC Talkies reporting & research wings.
          </p>
        </div>
      </section>

      {/* Editorial Statement */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-b border-[#14120e]/20">
        <div className="flex items-baseline gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#14120e]/70">
          <span className="text-[#c83a1a]">✦</span>
          <span>Verified stats, department rankings, participant metrics, and winner interviews</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="border border-[#14120e]/30 divide-y divide-[#14120e]/20 bg-[#eae5d9]">
          {pubsData.reports.map((report, idx) => (
            <div
              key={report.title}
              className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-[#e0dbcd] transition-colors group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl text-[#c83a1a]">
                    0{idx + 1}
                  </span>
                  <span className="bg-[#14120e] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5">
                    {report.year}
                  </span>
                  <span className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 font-semibold">
                    // {report.event}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#14120e] group-hover:text-[#c83a1a] transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm font-serif text-[#14120e]/80 max-w-xl">
                  Comprehensive audit and journalistic record covering participant statistics, key match timelines, judges' scoring, and photo galleries.
                </p>
              </div>

              <a
                href={report.link}
                className="inline-flex items-center gap-2 bg-[#14120e] text-[#e5e0d3] font-display text-base uppercase tracking-tight px-6 py-3 hover:bg-[#c83a1a] transition-colors shrink-0"
              >
                <span>View PDF Report</span>
                <span>↗</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
