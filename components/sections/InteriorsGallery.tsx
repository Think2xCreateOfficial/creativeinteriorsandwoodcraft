"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { content, interiorSpaces } from "@/lib/content";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

/**
 * Sticky interior gallery.
 *
 * Two stacked <img> layers crossfade so the outgoing photograph stays visible
 * while the incoming one decodes — src is never animated, which avoids white
 * flashes on slow networks. Active state, captions and dimming are applied
 * directly to the DOM so scrolling does not re-render React.
 */
export default function InteriorsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerARef = useRef<HTMLImageElement>(null);
  const layerBRef = useRef<HTMLImageElement>(null);
  const entriesRef = useRef<Array<HTMLButtonElement | null>>([]);
  const captionRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const activeRef = useRef(0);
  const frontRef = useRef<"a" | "b">("a");
  const requestRef = useRef(0);

  const syncUi = useCallback((index: number) => {
    entriesRef.current.forEach((entry, position) => {
      if (!entry) return;
      const active = position === index;
      entry.style.opacity = active ? "1" : "0.4";
      entry.dataset.active = String(active);
      entry.setAttribute("aria-current", active ? "true" : "false");
    });

    if (captionRef.current) {
      captionRef.current.textContent = interiorSpaces[index].title;
    }
    if (counterRef.current) {
      counterRef.current.textContent = `${interiorSpaces[index].number} / ${interiorSpaces.length.toString().padStart(2, "0")}`;
    }
    if (liveRef.current) {
      liveRef.current.textContent = `Showing ${interiorSpaces[index].title}`;
    }
  }, []);

  const show = useCallback(
    (index: number) => {
      if (index === activeRef.current) return;

      const incoming =
        frontRef.current === "a" ? layerBRef.current : layerARef.current;
      const outgoing =
        frontRef.current === "a" ? layerARef.current : layerBRef.current;
      if (!incoming || !outgoing) return;

      const space = interiorSpaces[index];
      const request = requestRef.current + 1;
      requestRef.current = request;

      const commit = () => {
        if (request !== requestRef.current) return;

        incoming.src = space.image;
        incoming.alt = space.title;
        incoming.style.opacity = "1";
        incoming.removeAttribute("aria-hidden");

        outgoing.style.opacity = "0";
        outgoing.setAttribute("aria-hidden", "true");
        outgoing.alt = "";

        frontRef.current = frontRef.current === "a" ? "b" : "a";
        activeRef.current = index;
        syncUi(index);
      };

      // Keep the current frame visible until the next one can be painted.
      const loader = new window.Image();
      loader.src = space.image;

      if (loader.complete && loader.naturalWidth > 0) {
        commit();
      } else {
        loader.onload = commit;
        loader.onerror = () => {
          if (request === requestRef.current) commit();
        };
      }
    },
    [syncUi],
  );

  // Preload all interior space images so transitions on scroll are immediate
  useIsomorphicLayoutEffect(() => {
    interiorSpaces.forEach((space) => {
      const img = new window.Image();
      img.src = space.image;
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    syncUi(0);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hysteresis-safe directional triggers: onEnter when scrolling down, onEnterBack when scrolling up.
      // A 10% deadband (55% to 45%) prevents micro-scroll chatter or toggle oscillation at boundaries.
      const triggers = interiorSpaces.map((space, index) =>
        ScrollTrigger.create({
          trigger: entriesRef.current[index] ?? sectionRef.current,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => show(index),
          onEnterBack: () => show(index),
        }),
      );

      return () => triggers.forEach((trigger) => trigger.kill());
    });

    return () => mm.revert();
  }, [show, syncUi]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative border-y border-border-beige bg-white py-12 md:py-14 lg:py-16"
    >
      <div id="interiors" className="sr-only" aria-hidden="true" />
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">{content.interiors.label}</p>
            <h2 className="display-lg mt-2 max-w-[18ch] text-charcoal">
              {content.interiors.heading}
            </h2>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <p className="lede max-w-sm text-pretty md:text-right">
              {content.interiors.description}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-14 lg:pb-[14vh]">
          <div className="sticky top-[calc(var(--header-height)+0.5rem)] z-20 self-start lg:col-span-7 lg:top-[calc(var(--header-height)+1.5rem)]">
            <div className="relative aspect-[16/10] overflow-hidden bg-soft-beige shadow-[0_18px_40px_-30px_rgba(38,37,31,0.55)] lg:aspect-auto lg:h-[min(75svh,600px)] transform-gpu [contain:paint_layout] [backface-visibility:hidden]">
              <img
                ref={layerARef}
                src={interiorSpaces[0].image}
                alt={interiorSpaces[0].title}
                width={1200}
                height={1500}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-editorial"
                style={{ opacity: 1 }}
              />
              <img
                ref={layerBRef}
                alt=""
                aria-hidden="true"
                width={1200}
                height={1500}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-editorial"
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#26251f]/65 via-[#26251f]/20 to-transparent"
              />

              <span
                ref={counterRef}
                className="absolute right-4 top-4 border border-ivory/40 bg-[#26251f]/20 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-ivory backdrop-blur-[2px] md:right-6 md:top-6"
              />
              <span
                ref={captionRef}
                className="absolute bottom-5 left-5 font-sans text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-none tracking-[-0.03em] text-ivory md:bottom-7 md:left-7"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-col lg:pt-2">
              {interiorSpaces.map((space, index) => (
                <button
                  key={space.id}
                  ref={(element) => {
                    entriesRef.current[index] = element;
                  }}
                  type="button"
                  onClick={() => show(index)}
                  style={{ opacity: index === 0 ? 1 : 0.4 }}
                  aria-label={`Show ${space.title}`}
                  aria-current={index === 0 ? "true" : "false"}
                  className="space-entry group block w-full border-t border-charcoal/15 py-6 text-left transition-opacity duration-500 last:border-b focus-visible:opacity-100 md:py-8 lg:py-9"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="w-7 shrink-0 text-[10px] font-medium tracking-[0.2em] text-bronze">
                      {space.number}
                    </span>
                    <span className="space-entry-title font-sans text-[clamp(1.5rem,2.5vw,2.15rem)] font-bold leading-[1.1] tracking-[-0.03em] text-charcoal transition-colors duration-500">
                      {space.title}
                    </span>
                  </span>
                  <span className="mt-2.5 block max-w-sm pl-11 text-[12.5px] leading-relaxed text-muted">
                    {space.description}
                  </span>
                </button>
              ))}

              <p className="mt-7 max-w-sm pl-11 text-[10.5px] leading-relaxed text-muted/90">
                {content.interiors.note}
              </p>
              <p ref={liveRef} aria-live="polite" className="sr-only" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
