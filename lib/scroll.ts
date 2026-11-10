import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Offset that accounts for the fixed header. */
const HEADER_OFFSET = 76;

export function scrollToTarget(
  target: string | HTMLElement,
  options: { offset?: number; immediate?: boolean } = {},
) {
  if (typeof window === "undefined") return;

  const element =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;

  if (!element) return;

  const offset = options.offset ?? -HEADER_OFFSET;

  if (lenis) {
    lenis.scrollTo(element, {
      offset,
      duration: options.immediate ? 0 : 1.25,
      immediate: options.immediate,
    });
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top,
    behavior: options.immediate ? "auto" : "smooth",
  });
}

/** Locks native scrolling together with Lenis (menus, lightbox). */
export function setScrollLocked(locked: boolean) {
  if (typeof window === "undefined") return;

  if (locked) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.4 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
