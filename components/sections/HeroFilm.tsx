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
 * Cinematic hero: a sticky viewport over 350vh of scroll.
 *
 * - On all devices (desktop and mobile), the walkthrough video scrubs to the scroll
 *   position through one shared GSAP ticker.
 * - Mobile devices load the lightweight 540p encode (interior-tour-mobile.mp4)
 *   to eliminate seek contention and battery drain.
 * - Reduced-motion visitors get the static poster and normal scrolling.
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
    const progress = { value: 0 };

    /* ----------------------------- entrance & scroll scrub ----------------------------- */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({ delay: 0.15 });

      intro
        .from(split.words, {
          yPercent: 115,
          duration: 1.35,
          ease: "power4.out",
          stagger: 0.055,
        })
        .from(
          root.querySelectorAll("[data-hero-fade]"),
          {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
          },
          0.35,
        )
        .from(
          cueRef.current,
          { opacity: 0, duration: 0.9, ease: "power2.out" },
          0.9,
        );

      const element = video;
      if (!element) return;

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

      const markLoading = () => {
        ready = false;
      };

      element.addEventListener("loadeddata", markReady);
      element.addEventListener("canplay", markReady);
      element.addEventListener("loadedmetadata", markReady);
      element.addEventListener("waiting", markLoading);
      element.addEventListener("stalled", markLoading);
      element.addEventListener("seeking", markLoading);
      element.addEventListener("seeked", markReady);
      element.addEventListener("error", markLoading);

      // iOS/Safari inline playback unlock: play then immediately pause
      const prime = () => {
        if (!element) return;
        element.muted = true;
        const playing = element.play();
        if (playing && typeof playing.then === "function") {
          playing
            .then(() => {
              element.pause();
              element.currentTime = 0.001;
              markReady();
            })
            .catch(() => {});
        }
      };

      const onFirstTouch = () => prime();
      window.addEventListener("touchstart", onFirstTouch, {
        once: true,
        passive: true,
      });

      if (element.readyState >= 1) prime();
      else element.addEventListener("loadedmetadata", prime, { once: true });

      let cueVisible = true;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.value = self.progress;

          const shouldShowCue = self.progress < 0.015;
          if (shouldShowCue !== cueVisible && cueRef.current) {
            cueVisible = shouldShowCue;
            gsap.to(cueRef.current, {
              opacity: cueVisible ? 1 : 0,
              duration: 0.35,
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

        // Throttle seeking to ~30fps frame interval (0.033s) to prevent hardware decoder contention
        if (Math.abs(smoothed - element.currentTime) > 0.033) {
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
        window.removeEventListener("touchstart", onFirstTouch);
        element.removeEventListener("loadeddata", markReady);
        element.removeEventListener("canplay", markReady);
        element.removeEventListener("loadedmetadata", markReady);
        element.removeEventListener("waiting", markLoading);
        element.removeEventListener("stalled", markLoading);
        element.removeEventListener("seeking", markLoading);
        element.removeEventListener("seeked", markReady);
        element.removeEventListener("error", markLoading);
      };
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
      aria-label="Interior design showreel"
      className="relative min-h-[350vh] h-[350vh] bg-charcoal"
    >
      <div className="sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden transform-gpu [backface-visibility:hidden]">
        <Image
          src={film.poster}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={82}
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
            <source
              src={film.mobileSrc}
              media="(max-width: 767px)"
              type="video/mp4"
            />
            <source
              src="/interior-tour-mobile.webm"
              media="(max-width: 767px)"
              type="video/webm"
            />
            <source src={film.src} type="video/mp4" />
          </video>
        )}

        {/* Minimal scrims: enough contrast for type, never a heavy overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#26251f]/55 via-[#26251f]/20 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#26251f]/80 via-[#26251f]/35 to-transparent"
        />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="shell pb-10 pt-32 md:pb-14">
            <p
              data-hero-fade
              className="eyebrow text-ivory/70 before:bg-ivory/45"
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

            <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p
                data-hero-fade
                className="max-w-md text-[14.5px] leading-relaxed text-ivory/75 md:text-[15px]"
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
                  <ArrowDown size={15} strokeWidth={1.6} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    scrollToTarget(content.hero.secondaryCta.href)
                  }
                  className="btn btn-light"
                >
                  {content.hero.secondaryCta.label}
                  <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden />
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
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-ivory/70 [writing-mode:vertical-rl]">
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
