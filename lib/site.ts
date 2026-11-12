/**
 * Central business configuration.
 *
 * Single source of truth for business details: name, email, phone, address,
 * website domain, hours, rating, map links, and navigation items.
 * All components consume this centralized configuration.
 */

export const businessConfig = {
  name: "Creative Interiors & Woodcraft",
  shortName: "Creative Interiors",
  monogram: "CI",
  email: "interiorscreative083@gmail.com",
  phone: "9500183310",
  countryCode: "91",
  phoneDisplay: "+91 95001 83310",
  phoneRaw: "+919500183310",
  phoneHref: "tel:+919500183310",
  emailHref: "mailto:interiorscreative083@gmail.com",
  website: "https://creativeinteriorsandwoodcraft.think2xcreate.com/",
  whatsappNumber: "919500183310",
  whatsappBaseUrl: "https://wa.me/919500183310",
} as const;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? businessConfig.website
).replace(/\/$/, "");

const address = {
  name: businessConfig.name,
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

const defaultWhatsappMessage = encodeURIComponent(
  "Hello Creative Interiors & Woodcraft, I would like to discuss an interior design project.",
);

export const site = {
  url: siteUrl,
  name: businessConfig.name,
  shortName: businessConfig.shortName,
  monogram: businessConfig.monogram,
  category: "Interior Designer",
  tagline: "Home Interiors & Woodwork",
  locality: "Mogappair East, Chennai",
  email: {
    address: businessConfig.email,
    display: businessConfig.email,
    href: businessConfig.emailHref,
  },
  phone: {
    display: businessConfig.phoneDisplay,
    href: businessConfig.phoneHref,
    raw: businessConfig.phoneRaw,
    number: businessConfig.phone,
    countryCode: businessConfig.countryCode,
  },
  whatsapp: {
    href: `${businessConfig.whatsappBaseUrl}?text=${defaultWhatsappMessage}`,
    baseUrl: businessConfig.whatsappBaseUrl,
    number: businessConfig.whatsappNumber,
  },
  address: {
    ...address,
    lines: addressLines,
    oneLine: `${address.line1}, ${address.line2}, ${address.line3}, ${address.city}, ${address.state} – ${address.postalCode}`,
  },
  hours: {
    summary: "Open until 08:00 AM - 10:00 PM",
    detail:
      "Open until 08:00 AM - 10:00 PM. Call ahead to confirm timings on the day of your visit.",
  },
  rating: {
    value: 5.0,
    count: 14,
    display: "5.0",
    source: "Google",
  },
  google: {
    profileUrl: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
    reviewsUrl: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`,
    embedUrl:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
      `https://www.google.com/maps?q=${addressQuery}&z=16&output=embed`,
  },
  social: {
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
    secondary: { label: "See Our Work", href: "#services" },
  },
} as const;

export type SiteConfig = typeof site;
