import Link from "next/link";
import type { Metadata } from "next";

import NotFoundIllustration from "@/components/ui/NotFoundIllustration";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Creative Interiors & Woodcraft",
  description:
    "What you were looking for doesn't exist, or the address has changed. Please return back to home.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main
      id="content"
      className="relative flex min-h-[calc(100vh-var(--header-height))] items-center justify-center overflow-hidden bg-pure-white px-[var(--edge)] pt-[calc(var(--header-height)+2rem)] pb-16 sm:pb-24"
    >
      <div className="shell mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Typographic composition matching the reference screenshot */}
          <div className="flex flex-col items-start lg:col-span-5 text-left order-2 lg:order-1">
            {/* 404 Display Heading */}
            <h1 className="font-sans text-[clamp(4.5rem,10vw,7.5rem)] font-light leading-none tracking-tight text-medium-brown">
              404
            </h1>

            {/* Primary explanatory message */}
            <p className="mt-5 sm:mt-6 text-[18px] sm:text-[20px] font-normal leading-snug text-charcoal max-w-md">
              What you were looking for doesn&apos;t exist, or the address has changed.
            </p>

            {/* Secondary italic supporting copy */}
            <p className="mt-3 sm:mt-4 text-[14.5px] sm:text-[15.5px] italic text-muted-grey">
              Please return back to home.
            </p>

            {/* Pill CTA button matching reference */}
            <div className="mt-7 sm:mt-9">
              <Link
                href="/"
                className="group inline-flex items-center justify-center rounded-full bg-medium-brown px-8 py-3.5 text-[14px] font-semibold tracking-wide text-pure-white shadow-xs transition-all duration-300 hover:bg-deep-brown hover:shadow-md hover:scale-[1.02] active:scale-95"
              >
                <span>Go home</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Storefront Illustration matching reference */}
          <div className="flex items-center justify-center lg:col-span-7 order-1 lg:order-2">
            <NotFoundIllustration />
          </div>
        </div>
      </div>
    </main>
  );
}
