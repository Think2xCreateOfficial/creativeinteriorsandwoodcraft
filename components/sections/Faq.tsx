"use client";

import { useState } from "react";
import { HelpCircle, ChevronRight } from "lucide-react";
import { content } from "@/lib/content";

/**
 * Section 08 — FAQ (Frequently Asked Questions)
 * Accordion card rows inspired by Reference 5 & Wintera Interiors.
 * Features a pill badge "(?) GOOD TO KNOW", rounded card items, thin borders,
 * chevron rotation and accessible expand/collapse.
 */
export default function Faq() {
  const { faq } = content;
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "faq-1": true, // First item open by default for immediate preview
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative overflow-hidden bg-white py-12 md:py-14 lg:py-16 border-t border-border-beige"
    >
      <div className="shell max-w-4xl">
        {/* Top Centered Pill Badge & Heading */}
        <div className="mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-beige bg-white px-4 py-1.5 shadow-xs">
            <HelpCircle size={14} className="text-medium-brown" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal-black">
              {faq.label}
            </span>
          </div>

          <h2 className="display-lg mt-4 text-charcoal-black">
            {faq.heading}
          </h2>
        </div>

        {/* 8 Accordion Card Rows */}
        <div className="mt-4 md:mt-6 space-y-3.5">
          {faq.items.map((item) => {
            const isOpen = Boolean(openIds[item.id]);
            const headerId = `faq-header-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl sm:rounded-2xl border border-border-beige bg-white shadow-xs transition-colors duration-200 hover:border-medium-brown/40"
              >
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 sm:px-7 sm:py-6 text-left transition-colors"
                  >
                    <span className="font-sans text-[12px] sm:text-[14px] font-bold uppercase tracking-wide text-charcoal-black/90">
                      {item.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-charcoal-black transition-transform duration-300 ${isOpen ? "rotate-90 text-deep-brown" : "rotate-0 text-muted-grey"
                        }`}
                      aria-hidden="true"
                    >
                      <ChevronRight size={18} strokeWidth={2.2} />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-6 pb-6 pt-1 sm:px-7 sm:pb-7"
                  >
                    <p className="text-[14.5px] leading-relaxed text-muted-grey border-t border-border-beige/50 pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

