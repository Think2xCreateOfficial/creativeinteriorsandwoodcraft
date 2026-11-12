"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Phone, RefreshCw } from "lucide-react";
import { site } from "@/lib/site";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("[Creative Interiors] Application error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-[var(--edge)] py-20 text-center">
      <div className="shell max-w-lg">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-medium-brown">
          Creative Interiors &amp; Woodcraft
        </span>
        <h1 className="mt-3 font-sans text-[2.2rem] font-bold leading-tight tracking-tight text-charcoal">
          Something went wrong
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-muted">
          We encountered an unexpected issue while rendering this page. You can try refreshing or contact our studio directly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-solid inline-flex items-center gap-2"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            Return Home
          </Link>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs text-muted">
          <p>Reach us directly:</p>
          <div className="mt-3 flex items-center justify-center gap-6">
            <a
              href={site.phone.href}
              className="inline-flex items-center gap-1.5 font-bold text-charcoal hover:text-bronze"
            >
              <Phone size={14} />
              {site.phone.display}
            </a>
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#25D366] hover:underline"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

