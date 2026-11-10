"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { site } from "@/lib/site";
import { setScrollLocked } from "@/lib/scroll";

const STORAGE_KEY = "ciw_lead_popup_dismissed";
const DISPLAY_DELAY_MS = 15000; // 15 seconds after initial page render

const PROJECT_TYPES = [
  "Full Home Interior",
  "Modular Kitchen",
  "Bedroom & Wardrobe",
  "Living Room",
  "Custom Woodwork",
  "Renovation",
  "Other",
] as const;

export default function LeadGenerationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [location, setLocation] = useState("");
  const [requirement, setRequirement] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 1. Initial 15-second timer with session check
  useEffect(() => {
    // Check if previously dismissed or submitted in this session
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === "dismissed" || stored === "submitted") {
        return;
      }
    } catch {
      // Ignore storage access errors in restricted iframe/browser modes
    }

    const timer = window.setTimeout(() => {
      // Re-verify session storage before showing
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored === "dismissed" || stored === "submitted") return;
      } catch {
        // Fallthrough
      }
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setIsOpen(true);
      setScrollLocked(true);
    }, DISPLAY_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // 2. Dismiss modal handler
  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    setScrollLocked(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // Ignore
    }
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  // 3. Escape key & Accessibility Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleDismiss]);

  // 4. Form validation and submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string } = {};

    const cleanName = name.trim();
    if (!cleanName || cleanName.length < 2) {
      newErrors.name = "Please enter your full name.";
    }

    // Indian mobile number validation: 10 digits starting with 6, 7, 8, or 9
    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Construct structured WhatsApp message
    const lines = [
      "Hello Creative Interiors & Woodcraft,",
      "",
      "I'm interested in your interior services.",
      "",
      `Name: ${cleanName}`,
      `WhatsApp: +91 ${cleanPhone}`,
      `Project Type: ${projectType}`,
      `Location: ${location.trim() || "Chennai"}`,
      requirement.trim() ? `Requirement: ${requirement.trim()}` : "",
      "",
      "Please contact me to discuss my project.",
    ].filter(Boolean);

    const messageText = encodeURIComponent(lines.join("\n"));
    const whatsappUrl = `https://wa.me/${site.whatsapp.number}?text=${messageText}`;

    // Mark as submitted so popup never reappears in this session
    try {
      sessionStorage.setItem(STORAGE_KEY, "submitted");
    } catch {
      // Ignore
    }

    setSubmitted(true);

    // Open WhatsApp in new tab safely
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Close modal gracefully after brief feedback
    window.setTimeout(() => {
      setIsOpen(false);
      setScrollLocked(false);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-pure-white shadow-2xl border border-border-beige my-auto animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close project enquiry popup"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-pure-white/80 text-charcoal hover:bg-soft-beige hover:text-deep-brown transition-colors shadow-xs"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Left Visual Panel (Desktop) */}
          <div className="relative hidden lg:col-span-5 lg:flex flex-col justify-between overflow-hidden bg-soft-beige p-8">
            <Image
              src="/images/interiors/living-room.webp"
              alt="Creative Interiors & Woodcraft living room craftsmanship"
              fill
              sizes="320px"
              className="object-cover"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/85 via-charcoal-black/35 to-transparent" />

            {/* Top Monogram */}
            <div className="relative z-10">
              <span className="inline-block rounded-md bg-white/20 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xs">
                Creative Interiors
              </span>
            </div>

            {/* Bottom Invitation */}
            <div className="relative z-10 text-white">
              <p className="font-sans text-[22px] font-bold leading-snug tracking-tight">
                Let&apos;s Create a Space You&apos;ll Love.
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/80">
                Custom woodwork, modular kitchens, and residential interiors tailored to Chennai homes.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in">
                <CheckCircle2 size={48} className="text-[#25D366] mb-3" />
                <h3 className="font-sans text-xl font-bold text-charcoal-black">
                  Connecting to WhatsApp...
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-grey">
                  Your project enquiry has been formatted and opened in WhatsApp. Our team will connect with you shortly!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-medium-brown">
                    Quick Project Enquiry
                  </span>
                  <h3
                    id="lead-modal-title"
                    className="mt-1 font-sans text-xl sm:text-2xl font-bold tracking-tight text-charcoal-black"
                  >
                    Planning Your Dream Interior?
                  </h3>
                  <p className="mt-1 text-[13px] text-muted-grey leading-relaxed">
                    Tell us a little about your project. Our team will connect with you on WhatsApp to discuss your requirements.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="popup-name"
                      className="block text-[12px] font-semibold text-charcoal mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="popup-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted-grey/60 focus:outline-none focus:ring-2 focus:ring-medium-brown/30 ${
                        errors.name ? "border-red-500 bg-red-50/20" : "border-border-beige bg-pure-white"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[11px] text-red-600 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Mobile Number */}
                  <div>
                    <label
                      htmlFor="popup-phone"
                      className="block text-[12px] font-semibold text-charcoal mb-1"
                    >
                      WhatsApp Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex rounded-lg border border-border-beige focus-within:ring-2 focus-within:ring-medium-brown/30 overflow-hidden">
                      <span className="flex items-center bg-soft-beige px-3 text-xs font-semibold text-charcoal border-r border-border-beige select-none">
                        +91
                      </span>
                      <input
                        id="popup-phone"
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="98765 43210"
                        className={`w-full px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted-grey/60 focus:outline-none ${
                          errors.phone ? "bg-red-50/20" : "bg-pure-white"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-[11px] text-red-600 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Project Type & Location (2 columns on sm) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="popup-project"
                        className="block text-[12px] font-semibold text-charcoal mb-1"
                      >
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="popup-project"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full rounded-lg border border-border-beige bg-pure-white px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-medium-brown/30"
                      >
                        {PROJECT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="popup-location"
                        className="block text-[12px] font-semibold text-charcoal mb-1"
                      >
                        Location
                      </label>
                      <input
                        id="popup-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Mogappair, Anna Nagar"
                        className="w-full rounded-lg border border-border-beige bg-pure-white px-3 py-2.5 text-sm text-charcoal placeholder:text-muted-grey/60 focus:outline-none focus:ring-2 focus:ring-medium-brown/30"
                      />
                    </div>
                  </div>

                  {/* Optional Requirement Notes */}
                  <div>
                    <label
                      htmlFor="popup-requirement"
                      className="block text-[12px] font-semibold text-charcoal mb-1"
                    >
                      Project Notes <span className="text-muted-grey font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="popup-requirement"
                      rows={2}
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      placeholder="e.g. 3BHK flat interior, looking for modular kitchen & wardrobes..."
                      className="w-full rounded-lg border border-border-beige bg-pure-white px-3 py-2 text-sm text-charcoal placeholder:text-muted-grey/60 focus:outline-none focus:ring-2 focus:ring-medium-brown/30 resize-none"
                    />
                  </div>

                  {/* Submit CTA & Maybe Later */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-deep-brown px-6 py-3 text-sm font-semibold text-pure-white shadow-xs transition-all duration-200 hover:bg-medium-brown hover:scale-[1.01] active:scale-95"
                    >
                      <span>Continue on WhatsApp</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="w-full sm:w-auto text-xs font-medium text-muted-grey hover:text-charcoal px-3 py-2 transition-colors"
                    >
                      Maybe later
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

