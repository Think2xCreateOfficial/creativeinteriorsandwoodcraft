"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { scrollToTarget } from "@/lib/scroll";

/** In-page navigation that stays crawlable but hands scrolling to Lenis. */
export default function NavLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        scrollToTarget(href);
        onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}
