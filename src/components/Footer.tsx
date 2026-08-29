import Link from "next/link";
import Image from "next/image";
import siteData from "@/data/site.json";

export function Footer() {
  return (
    <footer className="border-t border-[#14120e]/20 bg-[#e5e0d3] text-[#14120e]">
      <div className="w-full px-4 sm:px-8 py-8 md:py-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-sm font-serif items-stretch">
          
          {/* Col 1: About & Left Footer */}
          <div className="flex flex-col justify-between space-y-6 items-center md:items-start text-center md:text-left">
            <div className="space-y-3">
              <h3 className="font-gothic text-2xl sm:text-3xl lg:text-4xl text-[#14120e]">
                The RCC Talkies
              </h3>
              <p className="text-base sm:text-lg text-[#14120e]/80 leading-relaxed max-w-md">
                The official independent journalism society of RCC Institute of Information Technology, Kolkata. Documenting campus chronicles, fests, debates, and cultural milestones since 2022.
              </p>
            </div>
            
            {/* Moved from bottom strip */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#14120e]/80 pt-4">
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
          <div className="flex flex-col justify-center items-center py-1 md:py-2">
            <div className="flex items-center gap-2 text-[#c83a1a] mb-5 opacity-60">
              <span className="w-8 h-px bg-[#c83a1a]/40"></span>
              <span className="text-[10px]">✦</span>
              <span className="w-8 h-px bg-[#c83a1a]/40"></span>
            </div>
            <Image 
              src="/logo.png" 
              alt="RCC Talkies Logo" 
              width={200} 
              height={200} 
              className="w-40 md:w-52 h-auto opacity-90 hover:opacity-100 transition-opacity mb-5" 
            />
            <div className="flex items-center gap-2 text-[#c83a1a] mb-4 opacity-60">
              <span className="w-8 h-px bg-[#c83a1a]/40"></span>
              <span className="text-[10px]">✦</span>
              <span className="w-8 h-px bg-[#c83a1a]/40"></span>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-[#14120e]/50 text-center max-w-[280px] leading-relaxed">
              "Documenting the untold stories of campus life, one issue at a time."
            </p>
          </div>

          {/* Col 3: Affiliation, Address & Right Footer */}
          <div className="flex flex-col justify-between space-y-6 items-center md:items-end text-center md:text-right">
            <div className="space-y-3">
              <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#14120e]/50 block mb-3">
                Campus Headquarters
              </span>
              <p className="text-[#14120e]/80 leading-relaxed text-sm font-sans">
                RCC Institute of Information Technology<br />
                Canal South Road, Beliaghata<br />
                Kolkata – 700015, WB
              </p>
              <a
                href={`mailto:${siteData.contact.email}`}
                className="inline-block mt-2 text-sm font-sans text-[#c83a1a] font-medium tracking-wide underline underline-offset-4"
              >
                {siteData.contact.email}
              </a>
            </div>

            {/* Moved from bottom strip */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs font-sans uppercase tracking-[0.2em] text-[#14120e]/80 pt-4">
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
