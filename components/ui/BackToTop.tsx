"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/scroll";

export default function BackToTop({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`group inline-flex items-center gap-2.5 text-[13px] font-bold transition-colors ${
        isDark ? "text-white/70 hover:text-white" : "text-muted hover:text-charcoal"
      }`}
    >
      Back to top
      <span
        className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-500 ${
          isDark
            ? "border-white/20 text-white/80 group-hover:border-white group-hover:bg-white group-hover:text-charcoal-black"
            : "border-line group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory"
        }`}
      >
        <ArrowUp size={14} strokeWidth={1.5} aria-hidden />
      </span>
    </button>
  );
}
