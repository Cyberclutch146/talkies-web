"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./DappledLight.css";

/**
 * DappledLight — sunlight falling through swaying leaves onto a wall.
 *
 * Local equivalent of the React Bits Pro "Dappled Light" background
 * (@reactbits-starter/dappled-light-tw,
 * https://pro.reactbits.dev/docs/components/dappled-light).
 *
 * The licensed Pro component could not be installed here: components.json
 * now registers the @reactbits-starter / @reactbits-pro registries with
 * `Authorization: Bearer ${REACTBITS_LICENSE_KEY}`, but .env.local only
 * holds the placeholder value, so
 * `npx shadcn@latest add @reactbits-starter/dappled-light-tw` is
 * rejected by the registry with "[Unauthorized] License key not found".
 * This component reproduces the same visual
 * intent — drifting, blurred patches of warm light over swaying leaf
 * shadows on the Agomoni #14120e wall — with no extra dependencies,
 * and exposes the same prop surface so the Pro component can be dropped
 * in later without changing call sites.
 */

export type DappledLightRef = {
  /** Send a gust through the plant. */
  gust: (strength?: number) => void;
  /** Replay the intro arrangement. */
  replay: () => void;
};

type DappledLightProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;

  /* Pro API (https://pro.reactbits.dev/docs/components/dappled-light) */
  plant?: "ficus" | "olive" | "palm" | "fern";
  placement?: "top-right" | "top-left" | "right" | "left" | "bottom-right" | "bottom-left";
  scale?: number;
  density?: number;
  depth?: number;
  softness?: number;
  shadowStrength?: number;
  lightColor?: string;
  shadowColor?: string;
  backgroundColor?: string;
  window?: "auto" | "on" | "off";
  windowAngle?: number;
  windowSize?: number;
  intensity?: number;
  bloom?: number;
  wind?: number;
  windSpeed?: number;
  clouds?: number;
  breeze?: boolean;
  grain?: number;
  seed?: number;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;

  /* Legacy local alias (kept for existing call sites) */
  patches?: number;
};

/* Deterministic pseudo-random so SSR and first client paint agree. */
function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hexToRgb(hex: string): string | null {
  const value = hex.trim();
  const match = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const digits = match[1].length === 3 ? [...match[1]].map(c => c + c).join("") : match[1];
  const rgb = [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16));
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}

const PLACEMENT_BIAS: Record<string, { x: number; y: number }> = {
  "top-right": { x: 18, y: -14 },
  "top-left": { x: -18, y: -14 },
  right: { x: 20, y: 0 },
  left: { x: -20, y: 0 },
  "bottom-right": { x: 18, y: 16 },
  "bottom-left": { x: -18, y: 16 },
};

const PLANT_RADIUS: Record<string, string> = {
  ficus: "50%",
  olive: "60% 40% / 50%",
  palm: "45% 55% / 60% 55%",
  fern: "50%",
};

export const DappledLight = forwardRef<DappledLightRef, DappledLightProps>(function DappledLight(
  {
    className = "",
    style,
    children,
    plant = "ficus",
    placement = "top-right",
    scale = 1,
    density = 1,
    depth = 0.7,
    softness = 1,
    shadowStrength = 1,
    lightColor = "auto",
    shadowColor = "auto",
    backgroundColor = "transparent",
    intensity = 0.6,
    bloom = 0.6,
    wind = 0.6,
    windSpeed = 1,
    clouds = 0.25,
    breeze = true,
    seed = 1,
    intro = true,
    paused = false,
    patches,
  },
  ref,
) {
  const [replayKey, setReplayKey] = useState(0);
  const [gustBoost, setGustBoost] = useState(0);

  useImperativeHandle(
    ref,
    () => ({
      gust: (strength = 1) => setGustBoost(boost => Math.min(boost + strength, 3)),
      replay: () => {
        setGustBoost(0);
        setReplayKey(key => key + 1);
      },
    }),
    [],
  );

  const effectivePatches = useMemo(() => {
    if (typeof patches === "number") return Math.max(4, Math.min(patches, 40));
    return Math.max(4, Math.min(Math.round(14 * density), 40));
  }, [patches, density]);

  const { blobs, leaves } = useMemo(() => {
    const rand = seeded(seed * 997 + replayKey * 131 + 20261009);
    const bias = PLACEMENT_BIAS[placement] ?? PLACEMENT_BIAS["top-right"];
    const windFactor = Math.max(0, wind) * Math.max(0.2, windSpeed);
    const durationBase = Math.max(0.4, 14 + rand() * 22) / Math.max(0.25, 0.5 + windFactor);

    const blobs = Array.from({ length: effectivePatches }, (_, i) => {
      const warm = rand() > 0.35;
      return {
        id: i,
        left: Math.max(2, Math.min(98, rand() * 100 + bias.x * 0.4)),
        top: Math.max(2, Math.min(98, rand() * 100 + bias.y * 0.4)),
        size: (18 + rand() * 34) * scale,
        duration: durationBase,
        delay: -rand() * 30,
        driftX: (rand() - 0.5) * (6 + windFactor * 8) + gustBoost * 4,
        driftY: (rand() - 0.5) * (5 + windFactor * 7),
        opacity: 0.35 + rand() * 0.65,
        warm,
      };
    });

    const leaves = Array.from({ length: Math.round(effectivePatches / 2) }, (_, i) => ({
      id: i,
      left: Math.max(2, Math.min(98, rand() * 100 + bias.x * 0.5)),
      top: Math.max(2, Math.min(98, rand() * 100 + bias.y * 0.5)),
      size: (22 + rand() * 30) * scale,
      duration: Math.max(0.5, (18 + rand() * 26) / Math.max(0.25, 0.5 + windFactor)),
      delay: -rand() * 30,
      rotate: rand() * 360,
    }));

    return { blobs, leaves };
  }, [effectivePatches, scale, wind, windSpeed, placement, seed, replayKey, gustBoost]);

  const lightRgb = useMemo(() => {
    if (lightColor !== "auto") return hexToRgb(lightColor) ?? "212, 162, 78";
    return null; // auto: warm gold / cream mix on the dark wall
  }, [lightColor]);

  const shadowRgb = useMemo(() => {
    if (shadowColor !== "auto") return hexToRgb(shadowColor) ?? "6, 20, 12";
    return "6, 20, 12";
  }, [shadowColor]);

  const blur = Math.round(10 + softness * 14 + depth * 6);
  const leafOpacity = Math.min(1, 0.3 + shadowStrength * 0.35);

  const rootStyle = {
    ...style,
    ...(backgroundColor !== "transparent" ? { backgroundColor } : {}),
  } as CSSProperties;

  return (
    <div
      className={`dappled-light${paused ? " is-paused" : ""}${breeze ? "" : " no-breeze"}${intro ? " has-intro" : ""}${children ? "" : " is-fill"} ${className}`.trim()}
      style={rootStyle}
    >
      <div className="dappled-light__bg" aria-hidden="true">
        {leaves.map(leaf => (
          <span
            key={`leaf-${leaf.id}`}
            className="dappled-light__leaf"
            style={
              {
                left: `${leaf.left}%`,
                top: `${leaf.top}%`,
                width: `${leaf.size}vmin`,
                height: `${leaf.size * 0.62}vmin`,
                rotate: `${leaf.rotate}deg`,
                borderRadius: PLANT_RADIUS[plant] ?? "50%",
                background: `radial-gradient(ellipse at center, rgba(${shadowRgb}, ${leafOpacity}) 0%, rgba(${shadowRgb}, 0) 68%)`,
                filter: `blur(${blur + 10}px)`,
                "--drift-x": `${leaf.rotate * 0.06}px`,
                "--drift-y": "10px",
                animationDuration: `${leaf.duration}s`,
                animationDelay: `${leaf.delay}s`,
              } as CSSProperties
            }
          />
        ))}
        {blobs.map(blob => {
          const color =
            lightRgb ?? (blob.warm ? "212, 162, 78" : "250, 246, 238");
          const cloudDim = 1 - clouds * 0.35;
          return (
            <span
              key={`light-${blob.id}`}
              className="dappled-light__patch"
              style={
                {
                  left: `${blob.left}%`,
                  top: `${blob.top}%`,
                  width: `${blob.size}vmin`,
                  height: `${blob.size * 0.7}vmin`,
                  background: `radial-gradient(ellipse at center, rgba(${color}, ${blob.opacity}) 0%, rgba(${color}, 0) 70%)`,
                  filter: `blur(${blur}px)`,
                  "--dappled-intensity": intensity,
                  "--bloom": bloom,
                  "--drift-x": `${blob.driftX}vmin`,
                  "--drift-y": `${blob.driftY}vmin`,
                  animationDuration: `${blob.duration}s`,
                  animationDelay: `${blob.delay}s`,
                  opacity: Math.min(1, intensity * 0.9 * cloudDim),
                } as CSSProperties
              }
            />
          );
        })}
      </div>
      {children ? <div className="dappled-light__content">{children}</div> : null}
    </div>
  );
});

export default DappledLight;
