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
 * Removes dangerous control characters, null bytes, and trims excess whitespace.
 */
function sanitizeString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // Strip control characters (except common whitespace) and null bytes
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

  if (input.name.length < 2) {
    errors.name = "Please enter your full name.";
  } else if (input.name.length > 80) {
    errors.name = "Name must be under 80 characters.";
  }

  const digits = input.phone.replace(/\D/g, "");
  if (input.phone.length === 0) {
    errors.phone = "Please enter your phone number.";
  } else if (digits.length < 10 || digits.length > 15) {
    errors.phone = "Enter a valid phone number with at least 10 digits.";
  }

  if (input.email.length === 0) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(input.email) || input.email.length > 120) {
    errors.email = "Enter a valid email address, e.g. name@example.com.";
  }

  if (!input.service) {
    errors.service = "Please select the service you are interested in.";
  } else if (!serviceOptions.includes(input.service)) {
    errors.service = "Please choose a service from the list.";
  }

  if (input.location && input.location.length > 120) {
    errors.location = "Location must be under 120 characters.";
  }

  if (input.description.length < 10) {
    errors.description =
      "Tell us a little more about your project (at least 10 characters).";
  } else if (input.description.length > 2000) {
    errors.description = "Project description cannot exceed 2000 characters.";
  }

  return errors;
}
