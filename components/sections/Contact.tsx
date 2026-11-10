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
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { site } from "@/lib/site";
import { content, serviceOptions } from "@/lib/content";
import {
  EMPTY_ENQUIRY,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryInput,
} from "@/lib/enquiry";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

type Status = "idle" | "submitting" | "success" | "error";

const fieldLabels: Record<EnquiryField, string> = {
  name: "Your name",
  phone: "Phone number",
  email: "Email address",
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
          inputMode={name === "phone" ? "tel" : undefined}
          className="field"
        />
      )}

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-[11px] text-[#9c4a35]">
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
  const [submittedName, setSubmittedName] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number>(0);
  const idempotencyKeyRef = useRef<string>("");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    idempotencyKeyRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }, []);

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
    if (status === "success") {
      successRef.current?.focus();
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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypotRef.current?.value ?? "",
          elapsedMs: Math.max(0, Date.now() - startedAt.current),
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: EnquiryErrors;
      };

      if (!response.ok) {
        if (payload.fields) setErrors(payload.fields);
        throw new Error(
          payload.error ??
          "We could not send your enquiry. Please try again or call us.",
        );
      }

      setSubmittedName(values.name.split(" ")[0] ?? values.name);
      setValues(EMPTY_ENQUIRY);
      setErrors({});
      setStatus("success");
      startedAt.current = Date.now();
      idempotencyKeyRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please call or WhatsApp us instead.",
      );
    }
  };

  const liveMessage =
    status === "success"
      ? "Enquiry sent successfully."
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
            alt=""
            fill
            sizes="100vw"
            quality={80}
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
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="border border-line bg-white p-6 shadow-xs md:p-8">
              <p className="text-xs font-bold text-muted">
                Visit Us
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
                  className="flex items-center gap-3 text-[14px] text-charcoal transition-colors hover:text-bronze"
                >
                  <Phone
                    size={15}
                    strokeWidth={1.5}
                    aria-hidden
                    className="text-bronze"
                  />
                  {site.phone.display}
                </a>
                <p className="flex items-start gap-3 text-[13px] leading-relaxed text-muted">
                  <Clock
                    size={15}
                    strokeWidth={1.5}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-bronze"
                  />
                  {site.hours.detail}
                </p>
                <a
                  href={site.google.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[13px] text-charcoal transition-colors hover:text-bronze"
                >
                  <MapPin
                    size={15}
                    strokeWidth={1.5}
                    aria-hidden
                    className="text-bronze"
                  />
                  <span className="link-underline">Find Us</span>
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

          <div className="lg:col-span-7">
            <div className="border border-line bg-white p-6 shadow-[0_20px_60px_-40px_rgba(41,40,36,0.35)] sm:p-8 md:p-10">
              {status === "success" ? (
                <div
                  ref={successRef}
                  tabIndex={-1}
                  className="flex min-h-[420px] flex-col justify-center outline-none"
                >
                  <CheckCircle2
                    size={38}
                    strokeWidth={1.1}
                    aria-hidden
                    className="text-bronze"
                  />
                  <h3 className="mt-6 font-sans text-[2rem] font-bold leading-tight tracking-[-0.03em] text-charcoal">
                    Thank you{submittedName ? `, ${submittedName}` : ""}.
                  </h3>
                  <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
                    We got your message. We&rsquo;ll call you on the number you
                    shared to talk about your home.
                  </p>
                  <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
                    Need to talk sooner? Call us at{" "}
                    <a
                      href={site.phone.href}
                      className="link-underline text-charcoal"
                    >
                      {site.phone.display}
                    </a>
                    .
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={site.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-solid"
                    >
                      WhatsApp Us
                      <MessageCircle size={15} strokeWidth={1.6} aria-hidden />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setSubmittedName("");
                      }}
                      className="btn btn-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                    <p className="font-sans text-[1.5rem] font-bold tracking-[-0.03em] text-charcoal">
                      Tell Us About Your Home
                    </p>
                    <span className="text-[12px] text-muted">
                      We reply during business hours
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
                        placeholder="Your name"
                      />
                      <Field
                        name="phone"
                        value={values.phone}
                        error={errors.phone}
                        onChange={update}
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91"
                      />
                      <Field
                        name="email"
                        value={values.email}
                        error={errors.email}
                        onChange={update}
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
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
                        placeholder="Area or town (optional)"
                        required={false}
                        className="sm:col-span-2"
                      />
                      <Field
                        name="description"
                        value={values.description}
                        error={errors.description}
                        onChange={update}
                        placeholder="Describe the work you need. Add any details that may help us."
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

                    <div className="mt-8 flex flex-col gap-5">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="btn btn-solid w-full disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {status === "submitting" ? (
                          <>
                            Sending
                            <Loader2
                              size={16}
                              strokeWidth={1.6}
                              aria-hidden
                              className="animate-spin"
                            />
                          </>
                        ) : (
                          <>
                            {content.contact.submitLabel}
                            <ArrowUpRight
                              size={16}
                              strokeWidth={1.6}
                              aria-hidden
                            />
                          </>
                        )}
                      </button>

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
                            className="underline underline-offset-2"
                          >
                            WhatsApp us
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
