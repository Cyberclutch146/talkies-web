"use client";

import React from "react";
import DecryptedText from "@/components/DecryptedText";

export default function AboutCollege() {
  return (
    <section className="w-full border-b border-[#14120e]/20">
      {/* Section Header — Dark Banner */}
      <div className="w-full bg-[#14120e] text-[#e5e0d3] py-5 sm:py-8 px-4 sm:px-8 border-b border-[#14120e]">
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#e5e0d3] text-center">
          <DecryptedText
            text="THE INSTITUTE"
            animateOn="view"
            speed={40}
            maxIterations={8}
            sequential={true}
            revealDirection="center"
            className="text-[#e5e0d3]"
            encryptedClassName="text-[#c83a1a]"
          />
        </h2>
      </div>

      {/* Content Grid: Image Left + Text Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">
        {/* LEFT — Campus Photo */}
        <div className="lg:col-span-5 relative overflow-hidden bg-[#14120e] flex items-center justify-center">
          <img
            src="/rcc.jpg"
            alt="RCCIIT Campus — Kolkata"
            className="w-full h-auto max-h-[350px] lg:max-h-none lg:h-full object-cover object-center"
          />
          {/* Floating badges */}
          <div className="absolute top-3 left-3 bg-[#14120e] text-[#e5e0d3] px-2.5 py-1 text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] font-bold">
            RCCIIT CAMPUS
          </div>
          <div className="absolute bottom-3 right-3 bg-[#c83a1a] text-[#e5e0d3] px-2.5 py-1 text-[10px] sm:text-xs font-sans uppercase tracking-widest font-bold">
            EST. 2022
          </div>
        </div>

        {/* RIGHT — Editorial Text */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 bg-[#e5e0d3] flex flex-col justify-between">
          {/* Eyebrow */}
          <div>
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-4">
              ABOUT // RCCIIT, KOLKATA
            </span>

            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#14120e] leading-[0.9] mb-6">
              RCC INSTITUTE OF
              <br />
              INFORMATION TECHNOLOGY
            </h3>

            <div className="w-12 h-[2px] bg-[#c83a1a] mb-6" />

            <div className="space-y-4 font-serif text-sm sm:text-base text-[#14120e]/80 leading-relaxed max-w-2xl">
              <p>
                <span className="font-display text-4xl sm:text-5xl float-left mr-2 mt-1 leading-[0.8] text-[#14120e]">R</span>CC Institute of Information Technology (RCCIIT) is a reputed engineering college located in Kolkata. Established in <strong className="text-[#14120e]">1999</strong>, it was founded with the aim of providing quality technical education in the fields of engineering and information technology.
              </p>

              <p>
                The institute is affiliated with <strong className="text-[#14120e]">Maulana Abul Kalam Azad University of Technology (MAKAUT)</strong> and offers several undergraduate and postgraduate courses such as B.Tech, BCA, and MCA across different technical disciplines.
              </p>

              <p>
                In <strong className="text-[#c83a1a]">2023</strong>, continuing the institute&apos;s legacy of encouraging extracurricular growth, <em className="italic">RCC Talkies</em> was founded as the official journalism and media club — quickly evolving into the central voice of the student body, covering campus events, producing the annual magazine, and preparing members for careers in media and storytelling.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-10 pt-6 border-t border-[#14120e]/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "25+", label: "YEARS" },
              { value: "5000+", label: "ALUMNI" },
              { value: "7", label: "DEPARTMENTS" },
              { value: "MAKAUT", label: "AFFILIATED" },
            ].map((stat) => (
              <div key={stat.label} className="border-l-2 border-[#14120e] pl-3 sm:pl-4">
                <span className="font-display text-2xl sm:text-3xl text-[#14120e] block leading-tight uppercase">
                  {stat.value}
                </span>
                <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] text-[#14120e]/50 font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
