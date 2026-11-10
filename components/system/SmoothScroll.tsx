"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { setLenis } from "@/lib/scroll";

/**
 * Single owner of the smooth-scroll + ScrollTrigger lifecycle.
 *
 * - One GSAP ticker drives Lenis, so scroll-triggered animations stay in sync.
 * - prefers-reduced-motion is respected: Lenis is never started, native
 *   scrolling remains, and components render their final states.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    const start = () => {
      if (lenis || reduceMotion.matches) return;

      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        syncTouch: false,
      });

      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (ticker) gsap.ticker.remove(ticker);
      ticker = null;
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };

    start();

    const onPreferenceChange = () => {
      if (reduceMotion.matches) {
        stop();
        // Ensure anything mid-animation settles into its final state.
        ScrollTrigger.refresh();
      } else {
        start();
      }
    };

    const onLoad = () => ScrollTrigger.refresh();

    reduceMotion.addEventListener("change", onPreferenceChange);
    window.addEventListener("load", onLoad);

    // Fonts finishing late can shift section heights.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      reduceMotion.removeEventListener("change", onPreferenceChange);
      window.removeEventListener("load", onLoad);
      stop();
    };
  }, []);

  return null;
}
