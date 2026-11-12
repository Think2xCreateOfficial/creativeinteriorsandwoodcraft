"use client";

import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { content } from "@/lib/content";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Section 02 — About
 * Editorial introduction inspired by Reference 1 & Wintera Interiors.
 * Features an asymmetric 3-image interior collage with architectural hairline grid.
 */
export default function About() {
  const { about } = content;

  return (
    <section
      id="about"
      aria-label="About Creative Interiors & Woodcraft"
      className="relative overflow-hidden bg-white py-12 md:py-14 lg:py-16"
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
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20 items-center">
          {/* Left Column: Editorial narrative & highlights */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="eyebrow text-muted-grey">
              {about.label}
            </p>

            <h2 className="display-lg mt-2 max-w-[16ch] text-charcoal-black">
              {about.headingPrefix}{" "}
              <span className="text-medium-brown font-normal italic font-serif">
                {about.headingAccent}
              </span>{" "}
              {about.headingSuffix}
            </h2>

            <p className="lede mt-4 max-w-xl text-muted-grey">
              {about.description}
            </p>

            {/* Business Highlights List */}
            <div className="mt-6 space-y-3.5">
              {about.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-medium-brown/30 bg-soft-beige/50 text-deep-brown">
                    <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <span className="text-[14px] font-medium text-charcoal-black/90 leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Pill CTA Button */}
            <div className="mt-10">
              <button
                type="button"
                onClick={() => scrollToTarget(about.cta.href)}
                className="inline-flex items-center gap-3 rounded-full bg-charcoal-black px-7 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition-all duration-300 hover:bg-deep-brown hover:gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal-black"
              >
                <span>{about.cta.label}</span>
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Column: Asymmetric 3-image editorial collage */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-12 gap-3 sm:gap-4">
              {/* Primary large image (top / full width) */}
              <div className="col-span-12 relative aspect-[16/10] overflow-hidden rounded-sm bg-soft-beige shadow-md">
                <Image
                  src={about.images.primary}
                  alt={about.images.primaryAlt}
                  fill
                  quality={100}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>

              {/* Secondary image (bottom-left) */}
              <div className="col-span-5 relative aspect-[4/5] overflow-hidden rounded-sm bg-soft-beige shadow-sm">
                <Image
                  src={about.images.secondary}
                  alt={about.images.secondaryAlt}
                  fill
                  quality={100}
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              {/* Tertiary image (bottom-right) */}
              <div className="col-span-7 relative aspect-[4/5] overflow-hidden rounded-sm bg-soft-beige shadow-sm">
                <Image
                  src={about.images.tertiary}
                  alt={about.images.tertiaryAlt}
                  fill
                  quality={100}
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

