import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Offset that accounts for the fixed header (5rem / 80px). */
const HEADER_OFFSET = 80;

/** Locks native scrolling together with Lenis (menus, lightbox). */
export function setScrollLocked(locked: boolean) {
  if (typeof window === "undefined") return;

  if (locked) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    lenis?.start();
  }
}

export function scrollToTarget(
  target: string | HTMLElement,
  options: { offset?: number; immediate?: boolean } = {},
) {
  if (typeof window === "undefined") return;

  // Ensure scroll is unlocked prior to executing scroll
  setScrollLocked(false);

  let element: HTMLElement | null = null;

  if (typeof target === "string") {
    const rawId = target.replace(/^#/, "");
    element =
      document.getElementById(rawId) ??
      document.querySelector<HTMLElement>(target);
  } else {
    element = target;
  }

  if (!element) return;

  const offset = options.offset ?? -HEADER_OFFSET;

  if (lenis) {
    try {
      lenis.start();
      lenis.scrollTo(element, {
        offset,
        duration: options.immediate ? 0 : 1.1,
        immediate: options.immediate,
      });
      return;
    } catch {
      // Fall through to native scroll
    }
  }

  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: options.immediate ? "auto" : "smooth",
  });
}

export function scrollToTop() {
  if (typeof window === "undefined") return;
  setScrollLocked(false);

  if (lenis) {
    try {
      lenis.start();
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    } catch {
      // Fallback
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
