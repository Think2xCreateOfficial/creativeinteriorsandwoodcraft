/**
 * Central business configuration.
 *
 * Everything a non-developer may need to change lives here (or in
 * lib/content.ts): phone number, address, hours, rating, map links and
 * social profiles. Components read from this file only.
 */

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://creativeinteriorswoodcraft.com"
).replace(/\/$/, "");

const phoneDisplay = "+91 95001 83310";
const phoneRaw = "+919500183310";
const whatsappNumber = "919500183310";

const address = {
  name: "Creative Interiors & Woodcraft",
  line1: "17, Eval Street",
  line2: "Golden George Nagar",
  line3: "Mogappair East",
  city: "Chennai",
  state: "Tamil Nadu",
  postalCode: "600107",
  country: "IN",
  countryName: "India",
};

const addressLines = [
  address.line1,
  address.line2,
  address.line3,
  `${address.city}, ${address.state} – ${address.postalCode}.`,
];

const addressQuery = encodeURIComponent(
  `${address.name}, ${address.line1}, ${address.line2}, ${address.line3}, ${address.city}, ${address.state} ${address.postalCode}`,
);

const whatsappMessage = encodeURIComponent(
  "Hello Creative Interiors & Woodcraft, I would like to discuss an interior design project.",
);

export const site = {
  url: siteUrl,
  name: address.name,
  shortName: "Creative Interiors",
  monogram: "CI",
  category: "Interior Designer",
  tagline: "Home Interiors & Woodwork",
  locality: "Mogappair East, Chennai",
  phone: {
    display: phoneDisplay,
    href: `tel:${phoneRaw}`,
    raw: phoneRaw,
  },
  whatsapp: {
    href: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
    number: whatsappNumber,
  },
  address: {
    ...address,
    lines: addressLines,
    oneLine: `${address.line1}, ${address.line2}, ${address.line3}, ${address.city}, ${address.state} – ${address.postalCode}`,
  },
  hours: {
    // Verified: the business is open until 08:00 AM - 10:00 PM.
    summary: "Open until 08:00 AM - 10:00 PM",
    detail:
      "Open until 08:00 AM - 10:00 PM. Call ahead to confirm timings on the day of your visit.",
  },
  rating: {
    value: 5.0,
    count: 14,
    // Only ever the Google rating supplied by the business — no invented reviews.
    display: "5.0",
    source: "Google",
  },
  google: {
    // Google Business Profile: searching the business name + address opens the
    // profile card on Google Maps, where the reviews live.
    profileUrl: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
    reviewsUrl: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`,
    // Keyless Google Maps embed, configurable via env if a place ID is preferred.
    embedUrl:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
      `https://www.google.com/maps?q=${addressQuery}&z=16&output=embed`,
  },
  social: {
    // Add real profile URLs when available; empty strings are not rendered.
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    houzz: "",
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Works", href: "#works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: {
    primary: { label: "Talk to Us", href: "#contact" },
    secondary: { label: "See Our Work", href: "#interiors" },
  },
} as const;

export type SiteConfig = typeof site;
