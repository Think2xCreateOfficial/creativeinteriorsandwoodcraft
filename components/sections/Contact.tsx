"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
} from "lucide-react";

import { site } from "@/lib/site";
import { content, serviceOptions } from "@/lib/content";
import {
  EMPTY_ENQUIRY,
  buildWhatsAppMessage,
  getWhatsAppEnquiryUrl,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryInput,
} from "@/lib/enquiry";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

type Status = "idle" | "preparing" | "ready" | "error";

const fieldLabels: Record<EnquiryField, string> = {
  name: "Your name",
  phone: "Mobile number",
  email: "Email address (optional)",
  service: "What do you need help with?",
  location: "Where is the home?",
  description: "Tell us what you need",
};

function Field({
  name,
  value,
  error,
  onChange,
  className = "",
  type = "text",
  autoComplete,
  placeholder,
  textarea = false,
  select = false,
  required = true,
}: {
  name: EnquiryField;
  value: string;
  error?: string;
  onChange: (name: EnquiryField, value: string) => void;
  className?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  textarea?: boolean;
  select?: boolean;
  required?: boolean;
}) {
  const id = `enquiry-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    required,
    "aria-required": required ? true : undefined,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange: (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => onChange(name, event.target.value),
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {fieldLabels[name]}
        {required ? (
          <span aria-hidden className="ml-1 text-bronze">
            *
          </span>
        ) : null}
      </label>

      {select ? (
        <select {...shared} className="field">
          <option value="" disabled>
            Choose an option
          </option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          {...shared}
          rows={4}
          placeholder={placeholder}
          className="field resize-none"
        />
      ) : (
        <input
          {...shared}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={name === "phone" ? "tel" : name === "email" ? "email" : undefined}
          className="field"
        />
      )}

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-[11px] font-medium text-[#9c4a35]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState<EnquiryInput>(EMPTY_ENQUIRY);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [formattedMessage, setFormattedMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const readyBoxRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const background = bgRef.current;
    if (!section || !background) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        background,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (status === "ready") {
      readyBoxRef.current?.focus();
    }
  }, [status]);

  const update = (field: EnquiryField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Spam protection honeypot
    if (honeypotRef.current?.value) {
      return;
    }

    const nextErrors = validateEnquiry(values);
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as EnquiryField[])[0];

    if (firstInvalid) {
      setStatus("error");
      setMessage("Please check the highlighted fields and try again.");
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    // Prepare WhatsApp message URL
    setStatus("preparing");
    setMessage("");

    const url = getWhatsAppEnquiryUrl(values);
    const msg = buildWhatsAppMessage(values);

    setWhatsappUrl(url);
    setFormattedMessage(msg);
    setStatus("ready");

    // Attempt to open WhatsApp directly
    try {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        // Fallback if popup blocked
        window.location.href = url;
      }
    } catch {
      // Fallback: the UI will present the direct link button
    }
  };

  const handleCopy = async () => {
    try {
      if (formattedMessage) {
        await navigator.clipboard.writeText(formattedMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Ignore clipboard write failures
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setMessage("");
    setCopied(false);
  };

  const liveMessage =
    status === "ready"
      ? "Your enquiry message is ready. Please send it through WhatsApp."
      : status === "error"
        ? message
        : "";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-line bg-white py-12 md:py-14 lg:py-16"
    >
      <div aria-hidden className="absolute inset-0">
        <div ref={bgRef} className="absolute inset-[-6%]">
          <Image
            src="/images/contact.webp"
            alt="Creative Interiors & Woodcraft workshop and studio"
            fill
            sizes="100vw"
            quality={100}
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-white/92" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white/95" />
      </div>

      <div className="shell relative z-10">
        <div className="max-w-3xl">
          <p className="eyebrow">{content.contact.label}</p>
          <h2 className="display-md mt-2 max-w-[20ch] text-charcoal">
            {content.contact.heading}
          </h2>
          <p className="lede mt-4 max-w-xl">
            {content.contact.description}
          </p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: Studio details & map */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="border border-line bg-white p-6 shadow-xs md:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Studio &amp; Workshop
              </p>
              <address className="mt-3 text-[14px] not-italic leading-relaxed text-charcoal">
                {site.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>

              <div className="mt-6 space-y-4">
                <a
                  href={site.phone.href}
                  className="flex items-center gap-3 text-[14px] font-medium text-charcoal transition-colors hover:text-bronze"
                >
                  <Phone
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden
                    className="text-bronze shrink-0"
                  />
                  <span>{site.phone.display}</span>
                </a>

                <a
                  href={site.email.href}
                  className="flex items-center gap-3 text-[14px] text-charcoal transition-colors hover:text-bronze"
                >
                  <Mail
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden
                    className="text-bronze shrink-0"
                  />
                  <span>{site.email.address}</span>
                </a>

                <p className="flex items-start gap-3 text-[13px] leading-relaxed text-muted">
                  <Clock
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-bronze"
                  />
                  <span>{site.hours.detail}</span>
                </p>

                <a
                  href={site.google.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[13px] font-medium text-charcoal transition-colors hover:text-bronze"
                >
                  <MapPin
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden
                    className="text-bronze shrink-0"
                  />
                  <span className="link-underline">Find Us on Google Maps</span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden border border-line bg-white shadow-xs">
              <div className="relative aspect-[16/11] w-full bg-soft-beige/30">
                <iframe
                  src={content.contact.mapEmbedSrc}
                  title="Creative Interiors & Woodcraft Studio Location on Google Maps"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* Right: Enquiry Form / WhatsApp Preparation */}
          <div className="lg:col-span-7">
            <div className="border border-line bg-white p-6 shadow-[0_20px_60px_-40px_rgba(41,40,36,0.35)] sm:p-8 md:p-10">
              {status === "ready" ? (
                <div
                  ref={readyBoxRef}
                  tabIndex={-1}
                  className="flex min-h-[440px] flex-col justify-center outline-none animate-in fade-in duration-300"
                >
                  <div className="flex items-center gap-3">
                    
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-medium-brown">
                        WhatsApp Enquiry Ready
                      </span>
                      <h3 className="font-sans text-[1.65rem] font-bold leading-tight tracking-[-0.025em] text-charcoal">
                        Your message has been prepared
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg border border-line bg-soft-beige/50 p-4 text-[13px] text-charcoal leading-relaxed">
                    <p className="font-semibold text-charcoal">
                      Your enquiry message is ready. Please send it through WhatsApp to connect with our team.
                    </p>
                    <p className="mt-1 text-muted text-[12px]">
                      Destination: Creative Interiors &amp; Woodcraft ({site.phone.display})
                    </p>
                  </div>

                  {/* Message Preview Box */}
                  <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-line bg-pure-white p-3.5 text-xs text-charcoal/80 font-mono whitespace-pre-wrap">
                    {formattedMessage}
                  </div>

                  {/* Primary & Secondary Action Controls */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#20ba59]"
                    >
                      Open WhatsApp to Send
                    </a>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-charcoal/20 bg-white px-5 py-3.5 text-[13px] font-semibold text-charcoal transition-colors hover:bg-soft-beige"
                    >
                      {copied ? (
                        <>
                          <Check size={16} className="text-[#25D366]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy Message
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
                    <span>Need to modify details?</span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-1.5 font-bold text-charcoal hover:text-bronze"
                    >
                      <RotateCcw size={13} />
                      Edit Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                    <div>
                      <p className="font-sans text-[1.5rem] font-bold tracking-[-0.03em] text-charcoal">
                        Tell Us About Your Home
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Submitting opens WhatsApp with your pre-filled project enquiry
                      </p>
                    </div>
                    <span className="hidden sm:inline-block text-[11.5px] font-medium text-muted">
                      Direct WhatsApp
                    </span>
                  </div>

                  <form
                    ref={formRef}
                    onSubmit={onSubmit}
                    noValidate
                    className="mt-6"
                  >
                    <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
                      <Field
                        name="name"
                        value={values.name}
                        error={errors.name}
                        onChange={update}
                        autoComplete="name"
                        placeholder="Your full name"
                      />
                      <Field
                        name="phone"
                        value={values.phone}
                        error={errors.phone}
                        onChange={update}
                        type="tel"
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                      />
                      <Field
                        name="email"
                        value={values.email}
                        error={errors.email}
                        onChange={update}
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        required={false}
                      />
                      <Field
                        name="service"
                        value={values.service}
                        error={errors.service}
                        onChange={update}
                        select
                      />
                      <Field
                        name="location"
                        value={values.location}
                        error={errors.location}
                        onChange={update}
                        placeholder="Area in Chennai (e.g. Mogappair, Anna Nagar)"
                        required={false}
                        className="sm:col-span-2"
                      />
                      <Field
                        name="description"
                        value={values.description}
                        error={errors.description}
                        onChange={update}
                        placeholder="Describe your home interior requirements, approximate size/BHK, timeline..."
                        textarea
                        className="sm:col-span-2"
                      />
                    </div>

                    <input
                      ref={honeypotRef}
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    <div className="mt-8 flex flex-col gap-4">
                      <button
                        type="submit"
                        disabled={status === "preparing"}
                        className="btn btn-solid w-full min-h-[48px] bg-charcoal text-ivory hover:bg-[#25D366] hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Send Enquiry via WhatsApp
                        <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden />
                      </button>

                      <p className="text-center text-[12px] text-muted">
                        We respect your privacy. Direct communication with Creative Interiors &amp; Woodcraft.
                      </p>

                      {status === "error" && message ? (
                        <div
                          role="alert"
                          className="border border-[#9c4a35]/30 bg-[#9c4a35]/5 px-4 py-3 text-[12px] leading-relaxed text-[#8a4331]"
                        >
                          {message}{" "}
                          <a
                            href={site.whatsapp.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 font-bold"
                          >
                            Click to WhatsApp directly
                          </a>
                          .
                        </div>
                      ) : null}
                    </div>

                    <p aria-live="polite" role="status" className="sr-only">
                      {liveMessage}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
