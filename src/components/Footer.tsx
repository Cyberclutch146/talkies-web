import Link from "next/link";
import Image from "next/image";
import siteData from "@/data/site.json";

export function Footer() {
  return (
    <footer className="border-t border-[#14120e]/20 bg-[#e5e0d3] text-[#14120e]">
      <div className="w-full px-4 sm:px-8 py-4 md:py-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm font-serif items-stretch">
          
          {/* Col 1: About & Left Footer */}
          <div className="flex flex-col justify-between space-y-4 items-center md:items-start text-center md:text-left">
            <div className="space-y-2">
              <h3 className="font-gothic text-xl sm:text-2xl text-[#14120e]">
                The RCC Talkies
              </h3>
              <p className="text-sm text-[#14120e]/80 leading-relaxed max-w-sm">
                The official independent journalism society of RCC Institute of Information Technology, Kolkata. Documenting campus chronicles, fests, debates, and cultural milestones since 2022.
              </p>
            </div>
            
            {/* Moved from bottom strip */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] text-[#14120e]/80 pt-2">
              <span className="font-bold tracking-[0.22em] text-[#14120e]">TALKIES ©</span>
              <Link href="/admin" className="inline-flex items-center justify-center px-2 py-0.5 border border-[#14120e]/30 bg-[#e0dbcd] text-[10px] font-mono no-underline text-inherit">
                EST. 2022
              </Link>
              <Link href="/contact" className="hover:text-[#c83a1a] transition-colors text-xs">
                Masthead & Legal
              </Link>
            </div>
          </div>

          {/* Col 2: LOGO & QUOTE */}
          <div className="flex flex-col justify-center items-center py-1">
            <div className="flex items-center gap-2 text-[#c83a1a] mb-2 opacity-60">
              <span className="w-6 h-px bg-[#c83a1a]/40"></span>
              <span className="text-[10px]">✦</span>
              <span className="w-6 h-px bg-[#c83a1a]/40"></span>
            </div>
            <Image 
              src="/logo.png" 
              alt="RCC Talkies Logo" 
              width={120} 
              height={120} 
              className="w-24 md:w-32 h-auto opacity-90 hover:opacity-100 transition-opacity mb-2" 
            />
            <div className="flex items-center gap-2 text-[#c83a1a] mb-2 opacity-60">
              <span className="w-6 h-px bg-[#c83a1a]/40"></span>
              <span className="text-[10px]">✦</span>
              <span className="w-6 h-px bg-[#c83a1a]/40"></span>
            </div>
            <p className="font-serif italic text-xs sm:text-sm text-[#14120e]/50 text-center max-w-[240px] leading-relaxed">
              &quot;Documenting the untold stories of campus life, one issue at a time.&quot;
            </p>
          </div>

          {/* Col 3: Affiliation, Address & Right Footer */}
          <div className="flex flex-col justify-between space-y-4 items-center md:items-end text-center md:text-right">
            <div className="space-y-1">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold text-[#14120e]/50 block mb-1">
                Campus Headquarters
              </span>
              <p className="text-[#14120e]/80 leading-relaxed text-xs font-sans">
                RCC Institute of Information Technology<br />
                Canal South Road, Beliaghata<br />
                Kolkata – 700015, WB
              </p>
              <a
                href={`mailto:${siteData.contact.email}`}
                className="inline-block mt-1 text-xs font-sans text-[#c83a1a] font-medium tracking-wide underline underline-offset-4"
              >
                {siteData.contact.email}
              </a>
            </div>

            {/* Moved from bottom strip */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] text-[#14120e]/80 pt-2">
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
        </div>
      </div>
    </footer>
  );
}
