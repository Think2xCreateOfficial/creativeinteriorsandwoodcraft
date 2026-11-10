"use client";

import Image from "next/image";
import { useState, useCallback, useId } from "react";
import { Star, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { content, type TestimonialItem } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Section 06 — Client Testimonials
 * Editorial asymmetric client experience layout based on genuine Google Business Profile reviews.
 * Features an expandable long review reading experience ("Read more" / "Show less"),
 * initials-based avatars, authentic interior photography, and accessible slider controls.
 */
export default function Testimonials() {
  const { testimonials } = content;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const reviewContentId = useId();

  const items = testimonials.items;
  const total = items.length;
  const activeItem: TestimonialItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    setIsExpanded(false);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setIsExpanded(false);
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const selectReview = useCallback((idx: number) => {
    setIsExpanded(false);
    setCurrentIndex(idx);
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Check if review has multiple paragraphs or is long (> 240 chars)
  const isLongReview = activeItem.reviewText.length > 240 || activeItem.reviewText.includes("\n\n");

  return (
    <section
      id="testimonials"
      aria-label="Client Experiences and Verified Google Reviews"
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
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-muted-grey">
            {testimonials.label}
          </p>
          <h2 className="display-lg mt-4 text-charcoal-black">
            {testimonials.headingPrefix}{" "}
            <span className="text-medium-brown font-serif italic font-normal">
              {testimonials.headingAccent}
            </span>
          </h2>
          <p className="lede mt-4 text-muted-grey">
            {testimonials.description}
          </p>
        </div>

        {/* Featured Testimonial Composition */}
        <div className="mt-14 md:mt-20 grid gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20 items-start">
          {/* Left Column: Authentic Project Photograph with refined crop */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-soft-beige shadow-md border border-border-beige group">
              <Image
                src={activeItem.relatedImage}
                alt={`${activeItem.reviewerName} interior woodwork project in Chennai`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/70 via-transparent to-black/20" />

              {/* Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-deep-brown shadow-xs">
                  Customer Experience
                </span>
                <span className="rounded-full bg-charcoal-black/75 backdrop-blur-md px-3 py-1 text-[10px] font-medium tracking-wide text-white">
                  {activeItem.source}
                </span>
              </div>

              {/* Bottom Caption on photo */}
              <div className="absolute bottom-5 inset-x-5 text-white">
                <p className="text-[11px] font-medium uppercase tracking-widest text-soft-beige">
                  {activeItem.location ?? "Chennai, Tamil Nadu"}
                </p>
                <h3 className="mt-1 font-sans text-[17px] font-bold leading-snug text-white">
                  {activeItem.relatedCategory}
                </h3>
              </div>
            </div>
          </div>

          {/* Right Column: Review Details & Expandable Content */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between">
            {/* Top Rating & Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-beige">
              <div className="flex items-center gap-2.5">
                <div className="flex text-amber-500" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill="currentColor"
                      strokeWidth={0}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-[13px] font-bold text-charcoal-black">
                  5.0 / 5.0
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeItem.designStyle && (
                  <span className="rounded-md border border-medium-brown/30 bg-soft-beige/50 px-2.5 py-0.5 text-[11px] font-medium text-deep-brown">
                    Style: {activeItem.designStyle}
                  </span>
                )}
                {activeItem.featured && (
                  <span className="rounded-md bg-deep-brown px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Top Featured
                  </span>
                )}
              </div>
            </div>

            {/* Review Body (Expandable for long reviews) */}
            <div className="py-6">
              <div
                id={reviewContentId}
                className={`transition-all duration-300 ease-in-out ${
                  !isExpanded && isLongReview ? "max-h-[160px] overflow-hidden relative" : "max-h-none"
                }`}
              >
                <div className="space-y-3.5 font-sans text-[15px] sm:text-[16px] leading-relaxed text-charcoal-black/90">
                  {activeItem.reviewText.split("\n\n").map((paragraph, pIdx) => (
                    <p key={pIdx} className="first:font-medium first:text-[16.5px]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Fade-out gradient when collapsed */}
                {!isExpanded && isLongReview && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
                  />
                )}
              </div>

              {/* Read more / Show less toggle */}
              {isLongReview && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={toggleExpand}
                    aria-expanded={isExpanded}
                    aria-controls={reviewContentId}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-deep-brown hover:text-medium-brown transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-brown"
                  >
                    <span>{isExpanded ? "Show less" : "Read more"}</span>
                    {isExpanded ? (
                      <ChevronUp size={15} strokeWidth={2.2} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={15} strokeWidth={2.2} aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Reviewer Profile & Slider Controls */}
            <div className="pt-6 border-t border-border-beige flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Reviewer Profile */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-soft-beige border border-border-beige text-deep-brown font-serif font-bold text-[17px] shadow-xs">
                  {activeItem.reviewerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-sans text-[16px] font-bold text-charcoal-black">
                    {activeItem.reviewerName}
                  </h3>
                  <p className="text-[12px] text-muted-grey">
                    Verified Google Reviewer
                  </p>
                </div>
              </div>

              {/* Navigation Controls & Position Indicator */}
              <div className="flex items-center gap-4">
                <span className="text-[12px] font-mono font-medium text-muted-grey">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-beige bg-white text-charcoal-black shadow-xs transition-all duration-200 hover:border-deep-brown hover:bg-deep-brown hover:text-white active:scale-95"
                  >
                    <ArrowLeft size={15} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-beige bg-white text-charcoal-black shadow-xs transition-all duration-200 hover:border-deep-brown hover:bg-deep-brown hover:text-white active:scale-95"
                  >
                    <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
