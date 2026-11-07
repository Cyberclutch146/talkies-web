"use client";

import { useEffect, useRef, useState } from "react";

import "./TechText.css";

type TechTextProps = { text: string; className?: string; style?: React.CSSProperties; fontSize?: number };

export function TechText({ text, className = "", style, fontSize = 112 }: TechTextProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointer, setPointer] = useState(-1);
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!wrap || !canvas || !context) return;
    // Galada — wait for it so the canvas doesn't paint the fallback serif first.
    let cancelled = false;
    document.fonts?.load(`400 ${fontSize}px "Galada"`).catch(() => undefined).then(() => {
      if (!cancelled) draw();
    });
    const draw = () => {
      const width = wrap.clientWidth;
      if (!width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.min(fontSize, width / Math.max(text.length * 0.59, 1));
      // Size the wrapper tightly to the glyph so the heading doesn't reserve extra vertical space.
      const height = Math.max(24, Math.round(size * 0.96));
      wrap.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.font = `400 ${size}px "Galada", Georgia, serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.lineJoin = "round";
      const x = width / 2;
      const y = height / 2;
      context.fillStyle = "#faf6ee";
      context.fillText(text, x, y, width * 0.96);
      if (pointer >= 0) {
        context.save();
        context.beginPath();
        context.arc(pointer, y, 130, 0, Math.PI * 2);
        context.clip();
        context.globalCompositeOperation = "destination-out";
        context.fillText(text, x, y, width * 0.96);
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = "#d4a24e";
        context.lineWidth = 1.3;
        context.setLineDash([4, 3]);
        context.strokeText(text, x, y, width * 0.96);
        context.restore();
      }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(wrap);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [fontSize, pointer, text]);
  return <div ref={wrapRef} className={`tech-text ${className}`} style={style} onPointerMove={(event) => setPointer(event.clientX - event.currentTarget.getBoundingClientRect().left)} onPointerLeave={() => setPointer(-1)} role="img" aria-label={text}><canvas ref={canvasRef} /></div>;
}
