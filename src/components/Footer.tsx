import Link from "next/link";
import siteData from "@/data/site.json";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Col 1: About */}
          <div>
            <h3 className="font-display text-3xl mb-4 text-cream">
              RCC TALKIES
            </h3>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              {siteData.tagline}. The official journalism club of{" "}
              {siteData.college.name}, Kolkata. Covering campus news,
              interviews, photography, and culture since {siteData.established}.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-cream/40 mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {siteData.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cream/70 hover:text-red transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact + Social */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-cream/40 mb-4">
              Get In Touch
            </h4>
            <div className="space-y-3 text-sm text-cream/70">
              <a
                href={`mailto:${siteData.contact.email}`}
                className="block hover:text-red transition-colors"
              >
                {siteData.contact.email}
              </a>
              <p className="leading-relaxed">{siteData.contact.address}</p>
            </div>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a
                href={siteData.contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/50 hover:text-red transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href={siteData.contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/50 hover:text-red transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={siteData.contact.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/50 hover:text-red transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} RCC Talkies — {siteData.college.name}
          </p>
          <p className="text-xs text-cream/40 italic">
            &ldquo;{siteData.tagline}&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
