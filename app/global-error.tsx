"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Creative Interiors] Global error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans text-neutral-900">
        <div className="max-w-md text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#806653]">
            {site.name}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#171513]">
            Application Error
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            A critical error prevented the application from loading. Please try reloading or contact us directly.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-md bg-[#171513] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#49372B]"
            >
              Reload Page
            </button>
            <a
              href={site.phone.href}
              className="rounded-md border border-neutral-300 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50"
            >
              Call Us
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

