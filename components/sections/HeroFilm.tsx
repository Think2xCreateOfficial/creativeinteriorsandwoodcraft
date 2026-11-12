"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { content, film } from "@/lib/content";
import { scrollToTarget } from "@/lib/scroll";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

/**
 * Responsive Hero Section:
 * - On desktop (>=768px): sticky viewport over 200vh with smooth walkthrough video scrubbing.
 * - On mobile (<768px): fluid, responsive 100svh immersive hero without decoder contention or scroll traps.
 * - Prioritized LCP poster image guarantees instant visual render without blocking the main thread.
 * - Full reduced-motion compliance.
 */
export default function HeroFilm() {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const heading = headingRef.current;
    if (!root || !heading) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const split = new SplitText(heading, {
      type: "words",
      mask: "words",
      wordsClass: "hero-word",
    });

    const mm = gsap.matchMedia();

    // Universal entrance animation for all viewports
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({ delay: 0.1 });

      intro
        .from(split.words, {
          yPercent: 110,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.05,
        })
        .from(
          root.querySelectorAll("[data-hero-fade]"),
          {
            y: 18,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.3,
        )
        .from(
          cueRef.current,
          { opacity: 0, duration: 0.8, ease: "power2.out" },
          0.8,
        );
    });

    // Desktop only: Smooth ScrollTrigger video scrub
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const element = video;
      if (!element) return;

      const progress = { value: 0 };
      let ready = false;
      let smoothed = 0;

      const markReady = () => {
        if (!element || element.readyState < 2) return;
        const duration = Number.isFinite(element.duration)
          ? element.duration
          : film.duration;
        if (!ready) {
          smoothed = Math.min(
            progress.value * duration,
            Math.max(duration - 0.05, 0),
          );
        }
        ready = true;
      };

      element.addEventListener("loadeddata", markReady);
      element.addEventListener("canplay", markReady);
      element.addEventListener("loadedmetadata", markReady);
      element.addEventListener("seeked", markReady);

      if (element.readyState >= 2) markReady();

      let cueVisible = true;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.value = self.progress;

          const shouldShowCue = self.progress < 0.02;
          if (shouldShowCue !== cueVisible && cueRef.current) {
            cueVisible = shouldShowCue;
            gsap.to(cueRef.current, {
              opacity: cueVisible ? 1 : 0,
              duration: 0.3,
              overwrite: true,
            });
          }
        },
      });

      const tick = () => {
        if (!element || !ready) return;

        const duration = element.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;

        if (element.seeking) return;

        const target = Math.min(
          progress.value * duration,
          Math.max(duration - 0.05, 0),
        );
        smoothed += (target - smoothed) * 0.22;

        if (Math.abs(smoothed - element.currentTime) > 0.04) {
          try {
            if ("fastSeek" in element && typeof (element as unknown as { fastSeek: (t: number) => void }).fastSeek === "function") {
              (element as unknown as { fastSeek: (t: number) => void }).fastSeek(smoothed);
            } else {
              element.currentTime = smoothed;
            }
          } catch {
            element.currentTime = smoothed;
          }
        }
      };

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        trigger.kill();
        element.removeEventListener("loadeddata", markReady);
        element.removeEventListener("canplay", markReady);
        element.removeEventListener("loadedmetadata", markReady);
        element.removeEventListener("seeked", markReady);
      };
    });

    // Mobile only: Subtle auto-play ambient loop if allowed
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const element = video;
      if (!element) return;

      element.muted = true;
      element.loop = true;
      const playPromise = element.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Poster image remains visible if autoplay is blocked
        });
      }
    });

    return () => {
      split.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      aria-label="Creative Interiors showreel"
      className="relative min-h-[100svh] md:min-h-[200vh] md:h-[200vh] bg-charcoal"
    >
      <div className="sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden transform-gpu [backface-visibility:hidden]">
        <Image
          src={film.poster}
          alt="Creative Interiors & Woodcraft living room and architectural woodwork"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="object-cover object-center"
        />

        {!reduceMotion && (
          <video
            ref={videoRef}
            poster={film.poster}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            {/* High-fidelity 1080p WebM (VP9) source for modern browsers */}
            <source src="/interior-tour.webm" type="video/webm" />
            {/* Master 1080p MP4 (H.264) source for universal high-definition playback */}
            <source src={film.src} type="video/mp4" />
          </video>
        )}

        {/* Minimal scrims: enough contrast for typography without washing out imagery */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#171513]/60 via-[#171513]/25 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#171513]/85 via-[#171513]/40 to-transparent"
        />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="shell pb-10 pt-28 md:pb-14">
            <p
              data-hero-fade
              className="eyebrow text-ivory/80 before:bg-ivory/50"
            >
              {content.hero.label}
            </p>

            <h1
              ref={headingRef}
              aria-label={content.hero.heading}
              className="display-xl mt-2 max-w-[18ch] text-ivory"
            >
              {content.hero.heading}
            </h1>

            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p
                data-hero-fade
                className="max-w-md text-[14.5px] leading-relaxed text-ivory/80 md:text-[15px]"
              >
                {content.hero.description}
              </p>

              <div
                data-hero-fade
                className="flex flex-col gap-3 xs:flex-row xs:flex-wrap"
              >
                <button
                  type="button"
                  onClick={() => scrollToTarget(content.hero.primaryCta.href)}
                  className="btn border-ivory bg-ivory text-charcoal hover:border-bronze hover:bg-bronze hover:text-white"
                >
                  {content.hero.primaryCta.label}
                  <ArrowDown size={15} strokeWidth={1.8} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToTarget(content.hero.secondaryCta.href)}
                  className="btn btn-light"
                >
                  {content.hero.secondaryCta.label}
                  <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={cueRef}
          className="pointer-events-none absolute bottom-10 right-[var(--edge)] hidden flex-col items-center gap-4 lg:flex"
          aria-hidden
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-ivory/70 [writing-mode:vertical-rl]">
            {content.hero.scrollLabel}
          </span>
          <span className="relative block h-16 w-px overflow-hidden bg-ivory/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-hint bg-ivory/80" />
          </span>
        </div>
      </div>
    </section>
  );
}
