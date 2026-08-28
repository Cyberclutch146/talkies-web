import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function MagazinePage() {
  const magazines = await prisma.magazine.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              CAMPUS PRINT & DIGITAL ARCHIVES
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="THE MAGAZINE"
                animateOn="view"
                speed={40}
                maxIterations={8}
                sequential={true}
                revealDirection="center"
                className="text-[#e5e0d3]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/70 max-w-sm">
            Quarterly editorial publications featuring student research,
            investigative journalism, art, and poetry.
          </p>
        </div>
      </section>

      {/* Editorial Statement */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-b border-[#14120e]/20">
        <div className="flex items-baseline gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#14120e]/70">
          <span className="text-[#c83a1a]">✦</span>
          <span>
            Official issues published and distributed across MAKAUT affiliated
            colleges
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {magazines.length === 0 ? (
            <div className="col-span-1 md:col-span-2 text-center py-20">
              <span className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-[#14120e]/20 block mb-4">
                No Issues Yet
              </span>
              <p className="font-serif text-base text-[#14120e]/50">
                Published magazines will appear here once uploaded by the
                editorial board.
              </p>
            </div>
          ) : (
            magazines.map((mag) => (
              <div
                key={mag.id}
                className="border border-[#14120e]/30 bg-[#eae5d9] p-6 sm:p-8 flex flex-col justify-between group hover:border-[#14120e] transition-colors"
              >
                <div>
                  {/* Magazine Cover Frame */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#14120e] bg-[#14120e] text-[#e5e0d3] p-6 sm:p-8 flex flex-col justify-between mb-6">
                    {mag.coverImage ? (
                      <img
                        src={mag.coverImage}
                        alt={`${mag.title} cover`}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                      />
                    ) : null}
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5">
                        {mag.volume}
                      </span>
                      <span className="font-mono text-xs text-[#e5e0d3]/60">
                        EDITION // {mag.year}
                      </span>
                    </div>

                    <div className="relative z-10 text-center my-auto">
                      <span className="font-gothic text-xl text-[#e5e0d3]/50 block mb-1">
                        The RCC Talkies
                      </span>
                      <h3 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-[#e5e0d3]">
                        {mag.title}
                      </h3>
                    </div>

                    <div className="relative z-10 flex justify-between items-end text-[10px] font-sans uppercase tracking-widest text-[#e5e0d3]/50">
                      <span>RCCIIT, Kolkata</span>
                      <span>Quarterly Issue</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-xl sm:text-2xl uppercase tracking-tight text-[#14120e]">
                      {mag.volume} — {mag.title}
                    </span>
                    <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5">
                      {mag.year}
                    </span>
                  </div>

                  <p className="font-serif text-base text-[#14120e]/85 leading-relaxed">
                    {mag.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#14120e]/20 flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 font-semibold">
                    Flipbook Reader
                  </span>
                  <Link
                    href={`/magazine/${mag.id}`}
                    className="inline-flex items-center gap-2 bg-[#14120e] text-[#e5e0d3] font-display text-base uppercase tracking-tight px-4 py-2 hover:bg-[#c83a1a] transition-colors"
                  >
                    <span>Read Issue</span>
                    <span>↗</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
