import Link from "next/link";
import siteData from "@/data/site.json";

export function Footer() {
  return (
    <footer className="border-t border-[#14120e]/20 bg-[#e5e0d3] text-[#14120e]">
      {/* Top running hairline divider */}
      <div className="w-full px-4 sm:px-8 py-8 md:py-12 border-b border-[#14120e]/15">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-sm font-serif">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="RCC Talkies" className="h-8 w-auto" />
              <h3 className="font-gothic text-2xl sm:text-3xl text-[#14120e]">
                The RCC Talkies
              </h3>
            </div>
            <p className="text-base text-[#14120e]/80 leading-relaxed max-w-md">
              The official independent journalism society of RCC Institute of Information Technology, Kolkata. Documenting campus chronicles, fests, debates, and visual culture since 2022.
            </p>
          </div>

          {/* Col 2: Desks */}
          <div className="space-y-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold text-[#14120e]/50 block mb-3">
              Editorial Desks
            </span>
            <ul className="space-y-1 text-xs font-sans uppercase tracking-widest text-[#14120e]/75">
              {siteData.desks.map((d) => (
                <li key={d} className="hover:text-[#c83a1a] transition-colors cursor-default">
                  — {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Affiliation & Address */}
          <div className="space-y-2 text-xs font-sans">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold text-[#14120e]/50 block mb-3">
              Campus Headquarters
            </span>
            <p className="text-[#14120e]/80 leading-relaxed">
              RCC Institute of Information Technology<br />
              Canal South Road, Beliaghata<br />
              Kolkata – 700015, WB
            </p>
            <a
              href={`mailto:${siteData.contact.email}`}
              className="inline-block mt-2 text-[#c83a1a] font-medium tracking-wide underline underline-offset-4"
            >
              {siteData.contact.email}
            </a>
          </div>
        </div>
      </div>

      {/* Signature Bottom Strip (Exact replica of Image 3 style) */}
      <div className="w-full px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans uppercase tracking-[0.2em] text-[#14120e]/80">
        {/* Left: Brand Copyright & Stamp */}
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-[0.22em] text-[#14120e]">TALKIES ©</span>
          <Link href="/admin" className="inline-flex items-center justify-center px-1.5 py-0.5 border border-[#14120e]/30 bg-[#e0dbcd] text-[9px] font-mono no-underline text-inherit">
            EST. 2022
          </Link>
          <Link href="/contact" className="hover:text-[#c83a1a] transition-colors text-[11px]">
            Masthead & Legal
          </Link>
        </div>

        {/* Right: Social Links with bullet separators */}
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          {Object.entries(siteData.contact.social).map(([platform, url], idx, arr) => (
            <span key={platform} className="contents">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c83a1a] transition-colors uppercase"
              >
                {platform}
              </a>
              {idx < arr.length - 1 && <span className="text-[#14120e]/30">•</span>}
            </span>
          ))}
          <span className="text-[#14120e]/30">•</span>
          <Link
            href="/magazine"
            className="hover:text-[#c83a1a] transition-colors"
          >
            ARCHIVE
          </Link>
        </div>
      </div>
    </footer>
  );
}
