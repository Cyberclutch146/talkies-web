"use client";

import pubsData from "@/data/publications.json";
import DecryptedText from "@/components/DecryptedText";

const reportDescriptions: Record<string, string> = {
  "GOT 2024 Sports Report":
    "In-depth coverage of GOT 2024 — including football league tables, cricket scorecards, athletics records, and department-wise medal tallies with photo galleries from every match day.",
  "TechTrix 2024 Report":
    "Full hackathon breakdown — team rankings, project abstracts, judges' commentary, robo-wars bracket results, and behind-the-scenes interviews with winning teams.",
  "Regalia 2024 Report":
    "Three days of cultural festivities documented — dance battle scores, music night setlists, dramatic skit reviews, fashion show highlights, and audience engagement metrics.",
};

export default function ReportsPage() {
  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-2">
              FIELD JOURNALISM & EVENT METRICS
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="EVENT REPORTS"
                animateOn="view"
                speed={40}
                maxIterations={8}
                sequential={true}
                revealDirection="start"
                className="text-[#e5e0d3]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/60 max-w-sm">
            Official post-event breakdown reports published by the RCC Talkies reporting & research wings.
          </p>
        </div>
      </section>

      {/* Editorial Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 border-b border-[#14120e]/20">
        <div className="flex items-center gap-3 text-[11px] sm:text-sm font-sans uppercase tracking-[0.15em] text-[#14120e]/70">
          <span className="text-[#c83a1a]">✦</span>
          <span>Verified stats, department rankings, participant metrics, and winner interviews</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <div className="border border-[#14120e]/30 divide-y divide-[#14120e]/20 bg-[#eae5d9]">
          {pubsData.reports.map((report, idx) => (
            <div
              key={report.title}
              className="p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:bg-[#e0dbcd] transition-colors group"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-display text-xl sm:text-2xl text-[#c83a1a]">
                    0{idx + 1}
                  </span>
                  <span className="bg-[#14120e] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5">
                    {report.year}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans uppercase tracking-widest text-[#14120e]/60 font-semibold">
                    // {report.event}
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-[#14120e] group-hover:text-[#c83a1a] transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm font-serif text-[#14120e]/75 max-w-xl leading-relaxed">
                  {reportDescriptions[report.title] ||
                    "Comprehensive audit and journalistic record covering participant statistics, key match timelines, and photo galleries."}
                </p>
              </div>

              <a
                href={report.link}
                className="inline-flex items-center gap-2 bg-[#14120e] text-[#e5e0d3] font-display text-sm sm:text-base uppercase tracking-tight px-5 sm:px-6 py-2.5 sm:py-3 hover:bg-[#c83a1a] transition-colors shrink-0 self-start sm:self-center"
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
