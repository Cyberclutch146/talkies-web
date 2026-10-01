"use client";

import React, { useMemo, useRef, useEffect } from "react";
import "./InfiniteSpiral.css";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const modulo = (val: number, max: number) => ((val % max) + max) % max;
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
  return t * t * (3 - 2 * t);
};

export interface InfiniteSpiralItem {
  src: string;
  alt?: string;
  title?: string;
  photographer?: string;
  dept?: string;
  href?: string;
  target?: string;
  id?: string | number;
  label?: string;
}

export interface InfiniteSpiralProps {
  items?: (string | InfiniteSpiralItem)[];
  speed?: number;
  direction?: "up" | "down";
  animationMode?: "auto" | "drag" | "scroll" | "all";
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  verticalSpacing?: number;
  perspective?: number;
  cardsPerTurn?: number;
  rotation?: number;
  cardTilt?: number;
  cardRadius?: number;
  centerScale?: number;
  edgeFade?: number;
  edgeBlur?: number;
  pauseOnHover?: boolean;
  imageFit?: "cover" | "contain";
  grayscale?: number;
  className?: string;
  onItemClick?: (item: InfiniteSpiralItem) => void;
}

const InfiniteSpiral: React.FC<InfiniteSpiralProps> = ({
  items = [],
  speed = 0.55,
  direction = "up",
  animationMode = "auto",
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = "cover",
  grayscale = 0,
  className = "",
  onItemClick,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const dragMovedRef = useRef(false);

  const normalizedItems: InfiniteSpiralItem[] = useMemo(
    () =>
      items.map((item, index) =>
        typeof item === "string"
          ? { src: item, alt: `Spiral image ${index + 1}` }
          : { alt: `Spiral image ${index + 1}`, ...item }
      ),
    [items]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frameId: number;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollEnabled = animationMode === "scroll" || animationMode === "all";
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(root);

    // Capture wheel events on the gallery itself to prevent page scroll
    // and drive the spiral rotation instead
    const handleWheel = (e: WheelEvent) => {
      if (!scrollEnabled || !visibleRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY || e.deltaX;
      targetProgressRef.current += clamp(
        (delta * scrollSpeedMultiplier * 0.5) / Math.max(verticalSpacing * 2, 1),
        -2.5,
        2.5
      );
    };
    // Must be non-passive to allow preventDefault
    root.addEventListener("wheel", handleWheel, { passive: false });

    // Stop Lenis smooth scroll when hovering over the spiral
    const stopLenisScroll = () => {
      const lenisEl = document.querySelector("[data-lenis-prevent]");
      if (!lenisEl) {
        root.setAttribute("data-lenis-prevent", "");
      }
    };
    const restoreLenisScroll = () => {
      root.removeAttribute("data-lenis-prevent");
    };
    root.addEventListener("mouseenter", stopLenisScroll);
    root.addEventListener("mouseleave", restoreLenisScroll);

    const render = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const autoEnabled = animationMode === "auto" || animationMode === "all";
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current);
      const directionMultiplier = direction === "down" ? -1 : 1;
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11));
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const responsiveRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        let offset = index - progressRef.current;
        offset = modulo(offset + half, count) - half;

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angle = offset * (360 / turnSize) + rotation;
        const angleRadians = (angle * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
        const visualScale = scale * depthScale;
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
        const blur = edgeBlur * smoothstep(0.35, 1, edge);

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : "none";
        card.style.zIndex = String(Math.round(depth * 100000) + index);
        card.style.pointerEvents = opacity > 0.25 ? "auto" : "none";
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      root.removeEventListener("wheel", handleWheel);
      root.removeEventListener("mouseenter", stopLenisScroll);
      root.removeEventListener("mouseleave", restoreLenisScroll);
      restoreLenisScroll();
    };
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
  ]);

  const rootStyle: React.CSSProperties = {
    perspective: `${perspective}px`,
    // @ts-expect-error CSS variable injection
    "--infinite-spiral-card-width": `${cardWidth}px`,
    // @ts-expect-error CSS variable injection
    "--infinite-spiral-card-height": `${cardHeight}px`,
    // @ts-expect-error CSS variable injection
    "--infinite-spiral-card-radius": `${cardRadius}px`,
    cursor: animationMode === "drag" || animationMode === "all" ? "grab" : "default",
    touchAction: animationMode === "drag" || animationMode === "all" ? "pan-x" : "auto",
    userSelect: animationMode === "drag" || animationMode === "all" ? "none" : "auto",
  };

  const dragEnabled = animationMode === "drag" || animationMode === "all";

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.cursor = dragEnabled ? "grab" : "default";
  };

  return (
    <div
      ref={rootRef}
      className={`infinite-spiral ${className}`.trim()}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={(event) => {
        if (!dragEnabled || event.button !== 0) return;
        draggingRef.current = true;
        dragMovedRef.current = false;
        lastPointerYRef.current = event.clientY;
        targetProgressRef.current = progressRef.current;
        // Don't setPointerCapture here — it redirects all events to the
        // root div, which prevents the card's onClick from ever firing.
        // Capture is deferred to onPointerMove once real drag is detected.
        event.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return;
        const pointerDelta = event.clientY - lastPointerYRef.current;
        lastPointerYRef.current = event.clientY;
        if (Math.abs(pointerDelta) > 0.5) {
          dragMovedRef.current = true;
          // Set pointer capture on first real movement so we can track
          // the drag even if the pointer leaves the container bounds
          const el = event.currentTarget;
          if (!el.hasPointerCapture(event.pointerId)) {
            try { el.setPointerCapture(event.pointerId); } catch { /* ignore */ }
          }
        }
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1);
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={(event) => {
        if (!dragMovedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragMovedRef.current = false;
      }}
    >
      <div className="infinite-spiral__stage" role="list" aria-label="Infinite spiral gallery">
        {normalizedItems.map((item, index) => {
          return (
            <div
              key={item.id ?? `${item.src}-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="infinite-spiral__item group"
              style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
              role="listitem"
              aria-label={item.label ?? item.alt}
              onClick={() => {
                if (!dragMovedRef.current) {
                  onItemClick?.(item);
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="infinite-spiral__image"
                src={item.src}
                alt={item.alt || "Gallery item"}
                loading={index < 8 ? "eager" : "lazy"}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "none",
                  maxHeight: "none",
                  objectFit: imageFit,
                  filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})`,
                }}
              />
              {/* Subtle hover photographer badge */}
              {item.photographer && (
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <p className="text-[10px] text-[#e5e0d3] font-serif truncate font-medium">
                    {item.photographer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfiniteSpiral;
