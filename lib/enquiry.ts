import { serviceOptions } from "@/lib/content";

export type EnquiryField =
  | "name"
  | "phone"
  | "email"
  | "service"
  | "location"
  | "description";

export type EnquiryInput = Record<EnquiryField, string>;

export type EnquiryPayload = EnquiryInput & {
  idempotencyKey?: string;
};

export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const EMPTY_ENQUIRY: EnquiryInput = {
  name: "",
  phone: "",
  email: "",
  service: "",
  location: "",
  description: "",
};

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates Indian 10-digit mobile numbers (optionally prefixed by +91, 91, or 0).
 */
export function validateIndianMobile(raw: string): { isValid: boolean; normalized: string } {
  const digits = raw.replace(/\D/g, "");
  let tenDigit = "";

  if (digits.length === 10) {
    tenDigit = digits;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    tenDigit = digits.slice(1);
  } else if (digits.length === 12 && digits.startsWith("91")) {
    tenDigit = digits.slice(2);
  }

  // Indian mobile numbers start with 6, 7, 8, or 9
  const isValid = tenDigit.length === 10 && /^[6-9]\d{9}$/.test(tenDigit);
  return { isValid, normalized: tenDigit };
}

/**
 * Removes dangerous control characters, null bytes, and trims excess whitespace.
 */
export function sanitizeString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, max);
}

export function normalizeEnquiry(payload: unknown): EnquiryPayload {
  const source =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const idempotencyKey =
    typeof source.idempotencyKey === "string"
      ? sanitizeString(source.idempotencyKey, 128)
      : undefined;

  return {
    name: sanitizeString(source.name, 80),
    phone: sanitizeString(source.phone, 24),
    email: sanitizeString(source.email, 120),
    service: sanitizeString(source.service, 80),
    location: sanitizeString(source.location, 120),
    description: sanitizeString(source.description, 2000),
    ...(idempotencyKey ? { idempotencyKey } : {}),
  };
}

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};

  const trimmedName = input.name.trim();
  if (trimmedName.length < 2) {
    errors.name = "Please enter your full name (minimum 2 characters).";
  } else if (trimmedName.length > 80) {
    errors.name = "Name must be under 80 characters.";
  }

  const phoneCheck = validateIndianMobile(input.phone);
  if (!input.phone.trim()) {
    errors.phone = "Please enter your 10-digit mobile number.";
  } else if (!phoneCheck.isValid) {
    errors.phone = "Enter a valid 10-digit Indian mobile number (e.g. 95001 83310).";
  }

  const trimmedEmail = input.email.trim();
  if (trimmedEmail.length > 0) {
    if (!EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > 120) {
      errors.email = "Enter a valid email address (e.g. name@example.com).";
    }
  }

  if (!input.service) {
    errors.service = "Please select the service or project type.";
  } else if (!serviceOptions.includes(input.service)) {
    errors.service = "Please choose a service from the list.";
  }

  const trimmedLocation = input.location.trim();
  if (trimmedLocation.length > 0 && trimmedLocation.length > 120) {
    errors.location = "Location must be under 120 characters.";
  }

  const trimmedDesc = input.description.trim();
  if (trimmedDesc.length < 10) {
    errors.description = "Tell us a little more about your requirements (at least 10 characters).";
  } else if (trimmedDesc.length > 2000) {
    errors.description = "Message must be under 2,000 characters.";
  }

  return errors;
}

/**
 * Builds the exact approved WhatsApp message body for Creative Interiors & Woodcraft enquiries.
 */
export function buildWhatsAppMessage(enquiry: EnquiryInput): string {
  const name = enquiry.name.trim();
  const phone = enquiry.phone.trim();
  const email = enquiry.email.trim() || "Not provided";
  const projectType = enquiry.service.trim() || "Interior Consultation";
  const location = enquiry.location.trim() || "Chennai";
  const message = enquiry.description.trim();

  return [
    "Hello Creative Interiors & Woodcraft,",
    "",
    "I would like to enquire about your interior services.",
    "",
    "Customer Details:",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Project Type: ${projectType}`,
    `Location: ${location}`,
    "",
    "Project Requirements:",
    message,
    "",
    "Please contact me to discuss my project.",
    "",
    "Thank you.",
  ].join("\n");
}

/**
 * Generates the direct WhatsApp sharing URL destination for wa.me.
 */
export function getWhatsAppEnquiryUrl(enquiry: EnquiryInput): string {
  const message = buildWhatsAppMessage(enquiry);
  const params = new URLSearchParams({
    text: message,
  });
  return `https://wa.me/919500183310?${params.toString()}`;
}
