"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Device — a studio-lit 3D phone mockup that frames any image or content.
 *
 * Local equivalent of the React Bits Pro "Device" component
 * (@reactbits-starter/device-tw,
 * https://pro.reactbits.dev/docs/components/device).
 *
 * The licensed Pro component could not be installed here: components.json
 * already registers the @reactbits-starter / @reactbits-pro registries with
 * `Authorization: Bearer ${REACTBITS_LICENSE_KEY}`, but .env.local only
 * holds the placeholder value, so
 * `npx shadcn@latest add @reactbits-starter/device-tw` is rejected by
 * the registry with "[Unauthorized] License key not found".
 * This component reproduces the same visual intent — a black-bezel phone
 * with a Dynamic Island pill, side buttons, edge-to-edge screen and soft
 * studio lighting — with no extra dependencies, and exposes a simple
 * `children` surface so the Pro component can be dropped in later without
 * changing call sites.
 *
 * Once a real REACTBITS_LICENSE_KEY is set in .env.local, install the
 * licensed version with:
 *   npx shadcn@latest add @reactbits-starter/device-tw
 * and swap this file's internals for the generated component.
 */

type DeviceProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Accessible label for the framed content. */
  label?: string;
};

export function Device({ className = "", style, children, label }: DeviceProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[280px] [perspective:1200px] ${className}`}
      style={style}
      role="img"
      aria-label={label}
    >
      {/* ── Studio-lit phone body ───────────────────────────── */}
      <div className="relative aspect-[9/19] w-full">
        {/* drop shadow + soft studio glow */}
        <div
          className="absolute inset-0 rounded-[52px] bg-black shadow-[0_50px_100px_-16px_rgba(0,0,0,0.85),0_24px_40px_-16px_rgba(0,0,0,0.6)]"
          aria-hidden="true"
        />
        {/* aluminium edge */}
        <div className="absolute inset-0 rounded-[52px] bg-gradient-to-br from-[#3a3a3c] via-[#101012] to-[#2a2a2c] p-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.6)]">
          {/* black bezel */}
          <div className="relative h-full w-full rounded-[49px] bg-black p-[7px]">
            {/* screen */}
            <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-black ring-1 ring-white/10">
              {children}
              {/* glass glare — subtle studio reflection */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent"
                aria-hidden="true"
              />
              {/* Dynamic Island */}
              <div
                className="pointer-events-none absolute left-1/2 top-[8px] h-[18px] w-[84px] -translate-x-1/2 rounded-full bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* side buttons */}
        <div className="absolute -left-[2.5px] top-[88px] h-9 w-[3px] rounded-l-md bg-[#1c1c1e]" aria-hidden="true" />
        <div className="absolute -left-[2.5px] top-[150px] h-14 w-[3px] rounded-l-md bg-[#1c1c1e]" aria-hidden="true" />
        <div className="absolute -left-[2.5px] top-[212px] h-14 w-[3px] rounded-l-md bg-[#1c1c1e]" aria-hidden="true" />
        <div className="absolute -right-[2.5px] top-[158px] h-20 w-[3px] rounded-r-md bg-[#1c1c1e]" aria-hidden="true" />
      </div>

      {/* soft floor shadow */}
      <div
        className="pointer-events-none mx-auto mt-5 h-8 w-2/3 rounded-[50%] bg-black/50 blur-xl"
        aria-hidden="true"
      />
    </div>
  );
}
