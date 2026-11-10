"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";

import { site } from "@/lib/site";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(isHome);
  const [announcement, setAnnouncement] = useState("");

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }

    const hero = document.getElementById("home");
    if (!hero) {
      setOverHero(false);
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const threshold = hero.offsetHeight - window.innerHeight * 0.9;
      setOverHero(window.scrollY < threshold);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    setScrollLocked(open);

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setAnnouncement("Navigation menu opened.");

      const timer = setTimeout(() => {
        const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
          'a, button, [tabindex="0"]',
        );
        firstFocusable?.focus();
      }, 50);

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
          return;
        }

        if (event.key === "Tab") {
          const menuFocusables = Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex="0"]',
            ) ?? [],
          );
          const allFocusables = triggerButtonRef.current
            ? [triggerButtonRef.current, ...menuFocusables]
            : menuFocusables;

          if (allFocusables.length === 0) return;

          const first = allFocusables[0];
          const last = allFocusables[allFocusables.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === first) {
              event.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", onKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", onKeyDown);
        setScrollLocked(false);
      };
    } else {
      if (previousFocusRef.current) {
        setAnnouncement("Navigation menu closed.");
        triggerButtonRef.current?.focus();
      }
    }
  }, [open]);

  const go = (hash: string) => {
    setOpen(false);
    if (!isHome) {
      window.location.href = `/${hash}`;
      return;
    }
    scrollToTarget(hash);
  };

  const light = isHome && overHero && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial ${
          open || !isHome || !overHero
            ? "border-line bg-pure-white backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-[var(--header-height)] items-center justify-between gap-4">
          {/* Brand Name — Refined Typography Only */}
          <a
            href={isHome ? "#home" : "/"}
            onClick={(event) => {
              if (isHome) {
                event.preventDefault();
                go("#home");
              }
            }}
            className="group flex flex-col leading-tight py-1"
            aria-label={`${site.name} — home`}
          >
            <span
              className={`font-sans text-[17px] sm:text-[19px] font-bold tracking-[-0.025em] transition-colors duration-500 ${
                light ? "text-ivory group-hover:text-ivory/80" : "text-charcoal group-hover:text-deep-brown"
              }`}
            >
              Creative Interiors
            </span>
            <span
              className={`text-[10px] sm:text-[10.5px] font-semibold tracking-[0.06em] uppercase transition-colors duration-500 ${
                light ? "text-ivory/70" : "text-medium-brown"
              }`}
            >
              &amp; Woodcraft
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 lg:flex xl:gap-8"
          >
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                onClick={(event) => {
                  if (isHome) {
                    event.preventDefault();
                    go(item.href);
                  }
                }}
                className={`link-underline text-[13px] font-medium tracking-tight transition-colors duration-300 ${
                  light
                    ? "text-ivory/80 hover:text-ivory"
                    : "text-charcoal/80 hover:text-deep-brown"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Phone Button */}
            <a
              href={site.phone.href}
              aria-label={`Call Creative Interiors: ${site.phone.display}`}
              title={`Call Creative Interiors: ${site.phone.display}`}
              className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                light
                  ? "border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal"
                  : "border-charcoal/20 text-charcoal hover:border-medium-brown hover:bg-medium-brown hover:text-pure-white"
              }`}
            >
              <Phone size={15} strokeWidth={1.8} aria-hidden />
            </a>

            <button
              type="button"
              onClick={() => go("#contact")}
              className={`group hidden sm:inline-flex items-center gap-2 border px-4 py-2.5 text-[12px] font-bold tracking-wider uppercase transition-colors duration-500 ${
                light
                  ? "border-ivory/45 text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal"
                  : "border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory"
              }`}
            >
              Talk to Us
              <ArrowUpRight
                size={14}
                strokeWidth={1.6}
                aria-hidden
                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>

            {/* Mobile Navigation Trigger */}
            <button
              ref={triggerButtonRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center border transition-colors duration-300 lg:hidden ${
                light
                  ? "border-ivory/40 text-ivory"
                  : "border-charcoal/20 text-charcoal hover:border-charcoal"
              }`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? (
                <X size={18} strokeWidth={1.5} aria-hidden />
              ) : (
                <Menu size={18} strokeWidth={1.5} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-[45] bg-white transition-[opacity,visibility] duration-500 ease-editorial lg:hidden ${
          open ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto px-[var(--edge)] pb-10 pt-[calc(var(--header-height)+2rem)]">
          <nav aria-label="Mobile" className="flex flex-col">
            {site.nav.map((item, index) => (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                onClick={(event) => {
                  if (isHome) {
                    event.preventDefault();
                  }
                  go(item.href);
                }}
                className={`group flex items-baseline gap-4 border-b border-line py-4 transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{
                  transitionDelay: open ? `${100 + index * 40}ms` : "0ms",
                }}
              >
                <span className="text-[9px] font-medium tracking-[0.22em] text-medium-brown">
                  0{index + 1}
                </span>
                <span className="font-sans text-[clamp(1.75rem,6vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-charcoal">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Bottom Action Area */}
          <div
            className={`mt-8 transition-all delay-300 duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <a
              href={site.phone.href}
              className="flex items-center justify-center gap-2 bg-charcoal px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory transition-colors hover:bg-deep-brown"
            >
              <Phone size={15} />
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
