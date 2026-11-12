"use client";

import Image from "next/image";
import { content } from "@/lib/content";

/**
 * Section 03 — Our Approach
 * 4-stage architectural process inspired by Reference 2 & Wintera Interiors.
 * Features alternating tall portrait photography, numbered phase labels, and hairline grid.
 */
export default function OurApproach() {
  const { approach } = content;

  return (
    <section
      id="approach"
      aria-label="Our Approach and Process"
      className="relative overflow-hidden bg-white py-12 md:py-14 lg:py-16 border-t border-border-beige"
    >
      {/* Architectural vertical hairline grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shell grid grid-cols-2 md:grid-cols-4 opacity-40"
      >
        <div className="border-r border-border-beige h-full" />
        <div className="border-r border-border-beige h-full hidden md:block" />
        <div className="border-r border-border-beige h-full hidden md:block" />
        <div className="h-full" />
      </div>

      <div className="shell relative z-10">
        {/* Centered Editorial Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-muted-grey">
            {approach.label}
          </p>
          <h2 className="display-lg mt-4 text-charcoal-black">
            {approach.headingPrefix}{" "}
            <span className="text-medium-brown font-serif italic font-normal">
              {approach.headingAccent}
            </span>
          </h2>
          <p className="lede mt-5 text-muted-grey">
            {approach.subtitle}
          </p>
        </div>

        {/* 4 Alternating Steps Grid */}
        <div className="mt-12 space-y-8 md:space-y-16">
          {approach.steps.map((step, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div
                key={step.number}
                className="grid gap-8 items-center md:grid-cols-12 md:gap-12 lg:gap-16"
              >
                {/* Image Column (alternates order on md screens) */}
                <div
                  className={`md:col-span-6 lg:col-span-6 ${isEven ? "md:order-2" : "md:order-1"
                    }`}
                >
                  <div className="relative aspect-[6/5] w-full max-w-lg mx-auto overflow-hidden rounded-sm bg-soft-beige shadow-sm">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      quality={100}
                      sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-border-beige px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-deep-brown">
                      Phase {step.number}
                    </div>
                  </div>
                </div>

                {/* Text Content Column */}
                <div
                  className={`md:col-span-6 lg:col-span-6 ${isEven ? "md:order-1 md:text-right" : "md:order-2"
                    }`}
                >
                  <div className={`max-w-md ${isEven ? "md:ml-auto" : ""}`}>
                    <span className="text-[12px] font-mono font-semibold uppercase tracking-[0.25em] text-medium-brown">
                      Step {step.number}
                    </span>
                    <h3 className="font-sans text-[clamp(1.75rem,2.8vw,2.5rem)] font-bold tracking-tight text-charcoal-black mt-2">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-grey">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

