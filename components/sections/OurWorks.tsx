"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { content, type PortfolioProject } from "@/lib/content";

function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

/**
 * Section 05 — Our Works (Video & Project Portfolio)
 * Layered card deck inspired by Reference 3 & Wintera Interiors.
 * Features an elevated active center card, layered flanking cards, and YouTube facade integration.
 * Both desktop 3D deck and mobile horizontal carousel stay synchronized via left/right buttons and swipe.
 */
export default function OurWorks() {
  const { works } = content;
  const [activeIndex, setActiveIndex] = useState(1); // Default to second item (featured)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);

  const total = works.projects.length;

  /**
   * Smoothly scrolls the mobile carousel to center the card at the given index.
   */
  const scrollToMobileIndex = useCallback((index: number) => {
    const container = mobileScrollRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement | undefined;
    if (!card) return;

    isProgrammaticScrollRef.current = true;
    const containerWidth = container.offsetWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const targetScroll = Math.max(0, cardLeft - (containerWidth - cardWidth) / 2);

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });

    // Release programmatic scroll flag after animation completes
    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 450);
  }, []);

  const handlePrev = useCallback(() => {
    setPlayingVideoId(null);
    const prevIndex = activeIndex === 0 ? total - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
    scrollToMobileIndex(prevIndex);
  }, [activeIndex, total, scrollToMobileIndex]);

  const handleNext = useCallback(() => {
    setPlayingVideoId(null);
    const nextIndex = activeIndex === total - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
    scrollToMobileIndex(nextIndex);
  }, [activeIndex, total, scrollToMobileIndex]);

  const selectCard = useCallback(
    (index: number) => {
      setPlayingVideoId(null);
      setActiveIndex(index);
      scrollToMobileIndex(index);
    },
    [scrollToMobileIndex],
  );

  // Sync mobile scroll position on mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      scrollToMobileIndex(1);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [scrollToMobileIndex]);

  // Keep activeIndex synchronized with swipe gestures on mobile
  useEffect(() => {
    const container = mobileScrollRef.current;
    if (!container) return;

    let ticking = false;

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!container || isProgrammaticScrollRef.current) {
            ticking = false;
            return;
          }
          const containerCenter = container.scrollLeft + container.offsetWidth / 2;
          let closestIndex = 0;
          let minDistance = Infinity;

          Array.from(container.children).forEach((child, index) => {
            const el = child as HTMLElement;
            const childCenter = el.offsetLeft + el.offsetWidth / 2;
            const distance = Math.abs(containerCenter - childCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });

          setActiveIndex(closestIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="works"
      aria-label="Our Works Portfolio"
      className="relative overflow-hidden bg-white py-12 md:py-14 lg:py-16 border-t border-border-beige"
    >
      <div className="shell">
        {/* Editorial Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-muted-grey">
            {works.label}
          </p>
          <h2 className="display-md mt-4 text-charcoal-black">
            {works.heading}
          </h2>
          <p className="lede mt-2 text-muted-grey">
            {works.description}
          </p>
        </div>

        {/* Desktop Layered Deck (>= 1024px) */}
        <div className="relative mt-6 hidden lg:flex items-center justify-center min-h-[560px]">
          <div className="relative w-full max-w-5xl h-[520px] flex items-center justify-center">
            {works.projects.map((project, idx) => {
              // Calculate relative offset from activeIndex (-2, -1, 0, 1, 2)
              let offset = idx - activeIndex;
              if (offset > 2) offset -= total;
              if (offset < -2) offset += total;

              const isCenter = offset === 0;
              const isImmediate = Math.abs(offset) === 1;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              // Transform calculations for the 3D layered deck
              const translateX = offset * 220; // px spacing
              const scale = isCenter ? 1 : isImmediate ? 0.88 : 0.76;
              const zIndex = isCenter ? 30 : isImmediate ? 20 : 10;
              const opacity = isCenter ? 1 : isImmediate ? 0.75 : 0.45;
              const rotate = offset * 2.5; // slight angle tilt like in reference 3

              const ytId = getYouTubeId(project.youtubeUrl);
              const isPlaying = isCenter && playingVideoId === project.id && ytId;

              return (
                <div
                  key={project.id}
                  onClick={() => !isCenter && selectCard(idx)}
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
                    zIndex,
                    opacity,
                  }}
                  className={`absolute w-[320px] h-[480px] rounded-2xl overflow-hidden bg-white shadow-xl transition-all duration-500 ease-out cursor-pointer select-none border border-border-beige ${isCenter ? "ring-2 ring-deep-brown/30" : "hover:opacity-90"
                    }`}
                >
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="relative w-full h-full group">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        quality={100}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover"
                      />
                      {/* Gradient overlay for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/90 via-charcoal-black/25 to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                        {/* <span className="rounded-full bg-charcoal-black/60 backdrop-blur-md px-3 py-1 text-[10.5px] font-medium uppercase tracking-wider text-white border border-white/10">
                          {project.category}
                        </span> */}
                        {ytId && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-brown/80 backdrop-blur-md text-white">
                            <Video size={13} aria-hidden="true" />
                          </span>
                        )}
                      </div>

                      {/* Center Play Button for YouTube Facade if center card has video */}
                      {isCenter && ytId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingVideoId(project.id);
                          }}
                          aria-label={`Play video for ${project.title}`}
                          className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-deep-brown shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 group-hover:bg-deep-brown group-hover:text-white"
                        >
                          <Play size={24} fill="currentColor" className="ml-1" />
                        </button>
                      )}

                      {/* Bottom Caption */}
                      {/* <div className="absolute bottom-5 inset-x-5 text-left text-white">
                        <p className="text-[11px] font-medium uppercase tracking-widest text-soft-beige">
                          {project.location}
                        </p>
                        <h3 className="mt-1 font-sans text-[18px] font-bold leading-snug line-clamp-2">
                          {project.title}
                        </h3>
                      </div> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Carousel (< 1024px) */}
        <div className="mt-4 lg:hidden">
          <div
            ref={mobileScrollRef}
            className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6"
          >
            {works.projects.map((project, idx) => {
              const ytId = getYouTubeId(project.youtubeUrl);
              const isPlaying = playingVideoId === project.id && ytId;
              const isActive = activeIndex === idx;

              return (
                <div
                  key={project.id}
                  onClick={() => selectCard(idx)}
                  className={`shrink-0 w-[280px] sm:w-[320px] h-[420px] rounded-2xl overflow-hidden bg-white shadow-md border snap-center relative cursor-pointer transition-all duration-300 ${isActive
                    ? "border-deep-brown ring-2 ring-deep-brown/25 shadow-lg"
                    : "border-border-beige opacity-90"
                    }`}
                >
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        quality={100}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/90 via-charcoal-black/30 to-transparent" />

                      <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                        {/* <span className="rounded-full bg-charcoal-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                          {project.category}
                        </span> */}
                        {ytId && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-brown text-white">
                            <Video size={11} aria-hidden="true" />
                          </span>
                        )}
                      </div>

                      {ytId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingVideoId(project.id);
                          }}
                          aria-label={`Play video for ${project.title}`}
                          className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-deep-brown shadow-xl"
                        >
                          <Play size={20} fill="currentColor" className="ml-0.5" />
                        </button>
                      )}

                      {/* <div className="absolute bottom-5 inset-x-5 text-left text-white">
                        <p className="text-[10.5px] font-medium uppercase tracking-widest text-soft-beige">
                          {project.location}
                        </p>
                        <h3 className="mt-1 font-sans text-[16px] font-bold leading-snug">
                          {project.title}
                        </h3>
                      </div> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Arrows & Dots */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-beige bg-white text-charcoal-black shadow-sm transition-all duration-200 hover:border-deep-brown hover:bg-deep-brown hover:text-white active:scale-95"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2">
            {works.projects.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => selectCard(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${dotIdx === activeIndex
                  ? "w-7 bg-deep-brown"
                  : "w-2 bg-border-beige hover:bg-medium-brown/60"
                  }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-beige bg-white text-charcoal-black shadow-sm transition-all duration-200 hover:border-deep-brown hover:bg-deep-brown hover:text-white active:scale-95"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
